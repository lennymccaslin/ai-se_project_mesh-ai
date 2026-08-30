import { Router } from 'express';
import {
  deleteDocument,
  getDocumentById,
  listDocuments,
  uploadDocument,
} from '../controllers/documents.js';

const documentsRouter = Router();

documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', listDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };