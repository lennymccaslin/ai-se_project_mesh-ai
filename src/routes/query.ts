import { Router } from 'express';
import { answerQuery } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', answerQuery);

export { queryRouter };