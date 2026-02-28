import { Router } from 'express';
import { login, register, session } from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', requireAuth, session);

export default router;
