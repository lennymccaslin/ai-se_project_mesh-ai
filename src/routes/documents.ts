import { Router } from 'express';
import multer from 'multer';
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from '../controllers/documents.js';

const documentsRouter = Router();
 const upload = multer({ dest: 'uploads/' });
 documentsRouter.post('/', upload.single('file'), uploadDocument);

documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };