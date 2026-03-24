import { checkout, getMyOrders, checkoutDirect } from './order.service.js';
import { razorpayInstance } from '../../config/razorpay.js';
import crypto from 'crypto';

export async function postCheckout(req, res) {
    try {
        const result = await checkout(req.user.sub, req.body.paymentMethod);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function getOrders(req, res) {
    try {
        const orders = await getMyOrders(req.user.sub);
        return res.status(200).json({ data: orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createRazorpayOrder(req, res) {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit
            currency: 'JPY',
            receipt: 'receipt_order_' + Date.now(),
        };

        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({ orderId: order.id, amount: options.amount });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function verifyRazorpayPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, totalCents } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            let result = null;
            if (cartItems && totalCents) {
                result = await checkoutDirect(req.user.sub, 'razorpay', cartItems, totalCents);
            }
            return res.status(200).json({ success: true, message: 'Payment verified successfully.', data: result });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
