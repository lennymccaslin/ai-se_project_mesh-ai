import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { authRouter } from './auth.js';
import { chatsRouter } from './chats.js';
import { documentsRouter } from './documents.js';
import { queryRouter } from './query.js';
import { usersRouter } from './users.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/chats', auth, chatsRouter);
router.use('/documents', auth, documentsRouter);
router.use('/query', auth, queryRouter);
router.use('/users', auth, usersRouter)

export default router;
