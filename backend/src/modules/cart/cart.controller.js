import { addCartItem, changeCartItemQuantity, getCartTotals } from './cart.service.js';

export async function getMyCart(req, res) {
    try {
        const data = await getCartTotals(req.user.sub);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addItem(req, res) {
    try {
        const productId = Number(req.body.productId);
        const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1;
        const data = await addCartItem(req.user.sub, productId, quantity);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function updateItem(req, res) {
    try {
        const productId = Number(req.params.productId);
        const quantity = Number(req.body.quantity);
        const data = await changeCartItemQuantity(req.user.sub, productId, quantity);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
