import { checkout, getMyOrders } from './order.service.js';

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
