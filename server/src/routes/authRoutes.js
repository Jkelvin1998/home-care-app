import { Router } from 'express';
import { login, getUser, signup } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.get('/user', requireAuth, asyncHandler(getUser));

export default router;
