import { Router } from 'express';
import { queryDocuments } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', queryDocuments);

export { queryRouter };