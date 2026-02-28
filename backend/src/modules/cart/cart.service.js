import {
    createCart,
    deleteCartItem,
    getActiveCartByUserId,
    getCartSummary,
    updateCartItemQuantity,
    upsertCartItem
} from './cart.repository.js';

function assertPositiveInteger(value, fieldName) {
    if (!Number.isInteger(value) || value < 1) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
}

async function ensureCart(userId) {
    return (await getActiveCartByUserId(userId)) || createCart(userId);
}

export async function addCartItem(userId, productId, quantity = 1) {
    assertPositiveInteger(productId, 'productId');
    assertPositiveInteger(quantity, 'quantity');

    const cart = await ensureCart(userId);
    await upsertCartItem(cart.id, productId, quantity);
    return getCartTotals(userId);
}

export async function changeCartItemQuantity(userId, productId, quantity) {
    assertPositiveInteger(productId, 'productId');
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error('quantity must be 0 or a positive integer');
    }

    const cart = await ensureCart(userId);
    if (quantity === 0) {
        await deleteCartItem(cart.id, productId);
    } else {
        await updateCartItemQuantity(cart.id, productId, quantity);
    }
    return getCartTotals(userId);
}

export async function getCartTotals(userId) {
    const cart = await ensureCart(userId);
    const items = await getCartSummary(cart.id);
    const subtotalCents = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);

    return {
        cartId: cart.id,
        items,
        subtotalCents,
        subtotal: (subtotalCents / 100).toFixed(2)
    };
}
