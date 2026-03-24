import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';
import { query, dbPool } from './src/config/db.js';

async function run() {
    try {
        const { rows } = await query('SELECT id, email, role FROM users LIMIT 1');
        if (rows.length === 0) {
            console.log('No users found in database');
            return;
        }
        const user = rows[0];
        const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);

        console.log('Testing with real user:', user.email);

        const razorpay_order_id = 'rzp_test_1234';
        const razorpay_payment_id = 'pay_test_1234';
        const bodyStr = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(bodyStr)
            .digest('hex');

        // Let's also find a real product to use for cartItems
        const prodMatch = await query('SELECT id, name, price_cents FROM products LIMIT 1');
        const prod = prodMatch.rows[0];

        const res = await fetch('http://localhost:4000/api/v1/orders/razorpay/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature: expectedSignature,
                cartItems: [{ id: prod.id, name: prod.name, price: prod.price_cents / 100, quantity: 1 }],
                totalCents: prod.price_cents + 500 // adding shipping
            })
        });
        
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (err) {
        console.error(err);
    } finally {
        await dbPool.end();
        process.exit(0);
    }
}

run();
