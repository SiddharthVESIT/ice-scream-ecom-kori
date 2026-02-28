import { query } from '../../config/db.js';

export async function getActiveCartByUserId(userId) {
    const { rows } = await query(
        'SELECT id, user_id, status FROM carts WHERE user_id = $1 AND status = $2 LIMIT 1',
        [userId, 'active']
    );
    return rows[0] || null;
}

export async function createCart(userId) {
    const { rows } = await query(
        'INSERT INTO carts (user_id, status) VALUES ($1, $2) RETURNING id, user_id, status',
        [userId, 'active']
    );
    return rows[0];
}

export async function upsertCartItem(cartId, productId, quantity) {
    const sql = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
  `;
    await query(sql, [cartId, productId, quantity]);
}

export async function updateCartItemQuantity(cartId, productId, quantity) {
    await query(
        'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
        [quantity, cartId, productId]
    );
}

export async function deleteCartItem(cartId, productId) {
    await query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
}

export async function getCartSummary(cartId) {
    const sql = `
    SELECT
      ci.product_id,
      p.name,
      p.price_cents,
      p.image_url,
      p.stock_quantity,
      p.batch_status,
      ci.quantity,
      (ci.quantity * p.price_cents) AS line_total_cents
    FROM cart_items ci
    INNER JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.created_at DESC
  `;
    const { rows } = await query(sql, [cartId]);
    return rows;
}

export async function markCartCheckedOut(cartId) {
    await query(
        "UPDATE carts SET status = 'checked_out', updated_at = NOW() WHERE id = $1",
        [cartId]
    );
}
