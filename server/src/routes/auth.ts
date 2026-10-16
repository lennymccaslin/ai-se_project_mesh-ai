import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../controllers/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.js';

const authRouter = Router();

authRouter.post('/register', registerLimiter, registerUser);
authRouter.post('/login', loginLimiter, loginUser);
authRouter.get('/me', auth, getCurrentUser);

export { authRouter };
