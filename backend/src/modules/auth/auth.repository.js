import { query } from '../../config/db.js';

export async function createUser({ fullName, email, passwordHash }) {
    const sql = `
    INSERT INTO users (full_name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, full_name, email, loyalty_points, role, created_at
  `;
    const { rows } = await query(sql, [fullName, email, passwordHash]);
    return rows[0];
}

export async function findUserByEmail(email) {
    const { rows } = await query(
        'SELECT id, full_name, email, password_hash, role, loyalty_points, favorite_flavors, newsletter_subscribed FROM users WHERE email = $1 LIMIT 1',
        [email]
    );
    return rows[0] || null;
}

export async function findUserById(id) {
    const { rows } = await query(
        'SELECT id, full_name, email, role, loyalty_points, favorite_flavors, newsletter_subscribed, created_at FROM users WHERE id = $1 LIMIT 1',
        [id]
    );
    return rows[0] || null;
}

export async function updateLoyaltyPoints(userId, pointsDelta) {
    const { rows } = await query(
        'UPDATE users SET loyalty_points = loyalty_points + $1, updated_at = NOW() WHERE id = $2 RETURNING loyalty_points',
        [pointsDelta, userId]
    );
    return rows[0];
}

export async function updateFavoriteFlavors(userId, flavors) {
    const { rows } = await query(
        'UPDATE users SET favorite_flavors = $1, updated_at = NOW() WHERE id = $2 RETURNING favorite_flavors',
        [flavors, userId]
    );
    return rows[0];
}

export async function updateNewsletterSubscription(userId, subscribed) {
    const { rows } = await query(
        'UPDATE users SET newsletter_subscribed = $1, updated_at = NOW() WHERE id = $2 RETURNING newsletter_subscribed',
        [subscribed, userId]
    );
    return rows[0];
}
