import { query } from '../../config/db.js';

export async function listProducts(category) {
    const baseSql = `
    SELECT id, sku, name, category, description, flavor_profile,
           price_cents, stock_quantity, batch_status, waitlist_count,
           image_url, is_active
    FROM products
    WHERE is_active = TRUE
  `;

    const sql = category
        ? `${baseSql} AND category = $1 ORDER BY created_at DESC`
        : `${baseSql} ORDER BY created_at DESC`;

    const params = category ? [category] : [];
    const { rows } = await query(sql, params);
    return rows;
}

export async function getProductById(id) {
    const { rows } = await query(
        'SELECT * FROM products WHERE id = $1 AND is_active = TRUE LIMIT 1',
        [id]
    );
    return rows[0] || null;
}

export async function updateProductStock(id, quantityDelta) {
    const { rows } = await query(
        `UPDATE products
     SET stock_quantity = GREATEST(0, stock_quantity + $1),
         batch_status = CASE
           WHEN (stock_quantity + $1) <= 0 THEN 'sold_out'
           WHEN (stock_quantity + $1) <= 10 THEN 'low_stock'
           ELSE 'available'
         END,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
        [quantityDelta, id]
    );
    return rows[0];
}

export async function incrementWaitlist(productId) {
    const { rows } = await query(
        'UPDATE products SET waitlist_count = waitlist_count + 1, updated_at = NOW() WHERE id = $1 RETURNING waitlist_count',
        [productId]
    );
    return rows[0];
}

export async function getScmDashboardData() {
    const { rows } = await query(`
    SELECT id, sku, name, category, stock_quantity, batch_status,
           waitlist_count,
           CASE
             WHEN waitlist_count > 0 THEN GREATEST(waitlist_count, 20)
             WHEN stock_quantity <= 10 THEN 30
             ELSE 0
           END AS recommended_batch_size
    FROM products
    WHERE is_active = TRUE
    ORDER BY waitlist_count DESC, stock_quantity ASC
  `);
    return rows;
}
