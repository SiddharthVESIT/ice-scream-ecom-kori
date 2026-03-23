import { Router } from 'express';
import { postCheckout, getOrders, createRazorpayOrder, verifyRazorpayPayment } from './order.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getOrders);
router.post('/checkout', postCheckout);
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

export default router;
