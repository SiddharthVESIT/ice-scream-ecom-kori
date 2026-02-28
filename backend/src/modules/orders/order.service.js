import { createOrder, createOrderItems, createPayment, getOrdersByUserId } from './order.repository.js';
import { getCartTotals } from '../cart/cart.service.js';
import { markCartCheckedOut } from '../cart/cart.repository.js';
import { updateProductStock } from '../products/product.repository.js';
import { updateLoyaltyPoints } from '../auth/auth.repository.js';
import { POINTS_PER_DOLLAR } from '../../utils/constants.js';
import crypto from 'crypto';

export async function checkout(userId, paymentMethod = 'card') {
    const cart = await getCartTotals(userId);

    if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }

    const shippingCents = cart.subtotalCents >= 5000 ? 0 : 500; // Free shipping over $50
    const totalCents = cart.subtotalCents + shippingCents;
    const orderNumber = `KORI-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Create order
    const order = await createOrder({
        userId,
        cartId: cart.cartId,
        orderNumber,
        subtotalCents: cart.subtotalCents,
        shippingCents,
        totalCents
    });

    // Create order items
    await createOrderItems(order.id, cart.items);

    // Process payment
    await createPayment({
        orderId: order.id,
        method: paymentMethod,
        amountCents: totalCents
    });

    // Decrement stock for each item
    for (const item of cart.items) {
        await updateProductStock(item.product_id, -item.quantity);
    }

    // Mark cart as checked out
    await markCartCheckedOut(cart.cartId);

    // Award loyalty points (10 pts per dollar spent)
    const pointsEarned = Math.floor((totalCents / 100) * POINTS_PER_DOLLAR);
    await updateLoyaltyPoints(userId, pointsEarned);

    return {
        order,
        pointsEarned,
        ecoPackaging: true,
        shippingNote: 'Shipped with eco-friendly dry-ice packaging 🧊'
    };
}

export async function getMyOrders(userId) {
    return getOrdersByUserId(userId);
}
