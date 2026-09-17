import type { Request, Response } from 'express';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';

export const queryDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
   const { question } = req.body;
 
   if (!question) {
     res.status(400).json({
       success: false,
       data: null,
       error: { message: 'question is required' },
     });
     return;
   }
 
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((document) => document._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((chunk) => ({
    id: String(chunk._id),
    documentId: String(chunk.documentId),
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  if (chunks.length === 0) {
    res.status(200).json({
      success: true,
      data: [],
      error: null,
    });
    return;
  }

  const queryEmbedding = await createEmbedding(question);
  const rankedChunks = rankBySimilarity(queryEmbedding, chunks);

  res.status(200).json({
    success: true,
    data: rankedChunks,
    error: null,
  });
};