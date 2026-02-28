import { Router } from 'express';
import { addItem, getMyCart, updateItem } from './cart.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMyCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);

export default router;
