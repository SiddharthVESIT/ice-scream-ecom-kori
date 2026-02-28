import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import crmRoutes from '../modules/crm/crm.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'kori-api-gateway' });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/crm', crmRoutes);

export default apiRouter;
