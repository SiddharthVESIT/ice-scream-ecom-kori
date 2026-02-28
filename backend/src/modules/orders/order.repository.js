import { query } from '../../config/db.js';

export async function createOrder({ userId, cartId, orderNumber, subtotalCents, shippingCents, totalCents }) {
    const sql = `
    INSERT INTO orders (user_id, cart_id, order_number, subtotal_cents, shipping_cents, total_cents)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
    const { rows } = await query(sql, [userId, cartId, orderNumber, subtotalCents, shippingCents, totalCents]);
    return rows[0];
}

export async function createOrderItems(orderId, items) {
    for (const item of items) {
        await query(
            'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1, $2, $3, $4)',
            [orderId, item.product_id, item.quantity, item.price_cents]
        );
    }
}

export async function createPayment({ orderId, method, amountCents }) {
    const sql = `
    INSERT INTO payments (order_id, method, amount_cents, status, paid_at)
    VALUES ($1, $2, $3, 'completed', NOW())
    RETURNING *
  `;
    const { rows } = await query(sql, [orderId, method, amountCents]);
    return rows[0];
}

export async function getOrdersByUserId(userId) {
    const sql = `
    SELECT o.*, json_agg(
      json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price_cents', oi.unit_price_cents,
        'name', p.name,
        'image_url', p.image_url
      )
    ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
    const { rows } = await query(sql, [userId]);
    return rows;
}
