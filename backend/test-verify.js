import crypto from 'crypto';
import 'dotenv/config';

console.log('Secret:', process.env.RAZORPAY_KEY_SECRET);

const body = 'test_order_id|test_payment_id';
try {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    console.log('Signature:', expectedSignature);
} catch (e) {
    console.error('Error:', e);
}
