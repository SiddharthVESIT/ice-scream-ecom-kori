import { getCatalog, getProduct, joinWaitlist, getScmOverview } from './product.service.js';

export async function getProducts(req, res) {
    try {
        const products = await getCatalog(req.query.category);
        return res.status(200).json({ data: products });
    } catch (error) {
        if (error.message === 'Invalid category filter') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getProductDetail(req, res) {
    try {
        const product = await getProduct(Number(req.params.id));
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ data: product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function postJoinWaitlist(req, res) {
    try {
        const result = await joinWaitlist(Number(req.params.id));
        return res.status(200).json({ message: 'Joined waitlist', waitlistCount: result.waitlist_count });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function getScmDashboard(req, res) {
    try {
        const data = await getScmOverview();
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
