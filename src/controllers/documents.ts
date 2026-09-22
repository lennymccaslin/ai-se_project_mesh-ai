import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { PDFParse } from 'pdf-parse';
import { createEmbedding } from '../utils/embeddings.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
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
    console.error('Document upload failed', error);
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Uploaded file is not a valid PDF or could not be parsed' },
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

  const documents = await Document.find({ userId });

  res.status(200).json({
    success: true,
    data: documents,
    error: null,
  });
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
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

  res.status(204).send();
};