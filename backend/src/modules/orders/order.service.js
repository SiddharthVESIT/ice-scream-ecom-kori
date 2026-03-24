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

export async function checkoutDirect(userId, paymentMethod, items, totalCents) {
    if (!items || items.length === 0) {
        throw new Error('Cart is empty');
    }

    const subtotalCents = totalCents >= 5000 ? totalCents : totalCents - 500;
    const shippingCents = totalCents >= 5000 ? 0 : 500;
    const orderNumber = `KORI-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Ensure we have a valid cartId to satisfy DB constraints
    const cartData = await getCartTotals(userId);
    const cartId = cartData.cartId;

    // Create order
    const order = await createOrder({
        userId,
        cartId,
        orderNumber,
        subtotalCents,
        shippingCents,
        totalCents
    });

    // We mark the cart as checked out since it was used for this checkout order
    await markCartCheckedOut(cartId);

    // Format items for createOrderItems
    const formattedItems = items.map(item => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity,
        price_cents: Math.round(item.price * 100)
    }));

    // Create order items
    await createOrderItems(order.id, formattedItems);

    // Process payment
    await createPayment({
        orderId: order.id,
        method: paymentMethod,
        amountCents: totalCents
    });

    // Decrement stock for each item
    for (const item of formattedItems) {
        await updateProductStock(item.product_id, -item.quantity);
    }

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
