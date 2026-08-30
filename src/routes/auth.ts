import { Router } from 'express';
import {
	getCurrentUser,
	loginUser,
	registerUser,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', getCurrentUser);

export { authRouter };