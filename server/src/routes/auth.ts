import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
	getCurrentUser,
	loginUser,
	registerUser,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', auth, getCurrentUser);

export { authRouter };