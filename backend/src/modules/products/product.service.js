import { listProducts, getProductById, incrementWaitlist, getScmDashboardData } from './product.repository.js';
import { cacheGet, cacheSet } from '../../config/redis.js';
import { FLAVOR_CATEGORIES } from '../../utils/constants.js';

export async function getCatalog(category) {
    if (category && !FLAVOR_CATEGORIES.includes(category)) {
        throw new Error('Invalid category filter');
    }

    const cacheKey = `products:${category || 'all'}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const products = await listProducts(category);
    await cacheSet(cacheKey, JSON.stringify(products), 60);
    return products;
}

export async function getProduct(id) {
    return getProductById(id);
}

export async function joinWaitlist(productId) {
    const result = await incrementWaitlist(productId);
    if (!result) throw new Error('Product not found');
    return result;
}

export async function getScmOverview() {
    return getScmDashboardData();
}
