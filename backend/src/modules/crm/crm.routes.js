import { Router } from 'express';
import { postQuiz, getLoyaltyBalance, postSaveFlavors, postNewsletter, redeemPoints } from './crm.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public — quiz doesn't require auth
router.post('/quiz', postQuiz);

// Protected — CRM features require user context
router.get('/loyalty', requireAuth, getLoyaltyBalance);
router.post('/loyalty/redeem', requireAuth, redeemPoints);
router.post('/flavors', requireAuth, postSaveFlavors);
router.post('/newsletter', requireAuth, postNewsletter);

export default router;
