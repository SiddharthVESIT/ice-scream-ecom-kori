import { Router } from 'express';
import { postCheckout, getOrders } from './order.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getOrders);
router.post('/checkout', postCheckout);

export default router;
