import { Router } from 'express';
import { getProducts, getProductDetail, postJoinWaitlist, getScmDashboard } from './product.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/scm', requireAuth, getScmDashboard);
router.get('/:id', getProductDetail);
router.post('/:id/waitlist', postJoinWaitlist);

export default router;
