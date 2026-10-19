import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { createEmbedding } from '../utils/embeddings.js';
import { logger } from '../utils/logger.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { getCacheValue, setCacheValue, deleteCacheValue } from '../utils/cache.js';

export const uploadDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).send({
      success: false,
      data: null,
      error: { message: 'File is required' },
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

  try {
    const buffer = readFileSync(req.file.path);
    // Loaded lazily: its native canvas dependency crashes on CPUs without AVX
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const text = parsed.text?.trim();

    if (!text) {
      res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Uploaded file does not contain readable text' },
      });
      return;
    }

    const chunks = chunkText(text);
    const title = req.body.title || req.file.originalname;

    const document = await Document.create({
      title,
      fileName: req.file.originalname,
      userId,
    });

    deleteCacheValue(`documents-list:${userId}`);

    await Promise.all(
      chunks.map(async (chunkTextValue) => {
        const embedding = await createEmbedding(chunkTextValue);
        return Chunk.create({
          documentId: document._id,
          text: chunkTextValue,
          embedding,
        });
      }),
    );

    res.status(201).send({
      success: true,
      data: document,
      error: null,
    });
  } catch (error) {
    logger.error('Document upload failed', {
      stack: error instanceof Error ? error.stack : String(error),
    });
    res.status(400).json({
      success: false,
      data: null,
      error: {
        message: 'Uploaded file is not a valid PDF or could not be parsed',
      },
    });
  }
};

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  const cacheKey = `documents-list:${userId}`;
  const cached = getCacheValue(cacheKey);

  if (cached) {
    res.status(200).json(cached);
    return;
  }

  const documents = await Document.find({ userId });
  const responseData = { success: true, data: documents, error: null };
  setCacheValue(cacheKey, responseData, 30_000);

  res.status(200).json(responseData);
};

export const getDocumentById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

export const deleteDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const documentId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  if (typeof documentId !== 'string' || !documentId.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid document id' },
    });
    return;
  }

  if (!mongoose.isValidObjectId(documentId)) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid document id format' },
    });
    return;
  }

  const document = await Document.findOneAndDelete({
    _id: documentId,
    userId,
  });

  if (!document) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document not found' },
    });
    return;
  }

  await Chunk.deleteMany({ documentId: document._id });
  deleteCacheValue(`documents-list:${userId}`);

  res.status(204).send();
};
