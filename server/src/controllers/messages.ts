import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/chat.js';
import Message from '../models/message.js';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { buildContext, getClient, LLM_MODEL, stripThinking } from '../utils/openai-client.js';

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const chatId = String(req.params.id);
  const userId = req.user?.userId;
  const { question } = req.body;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid chat id' },
    });
    return;
  }

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'The question field is required' },
    });
    return;
  }

  const chat = await Chat.findOne({
    _id: chatId,
    userId,
  });

  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' },
    });
    return;
  }

  const userMessage = await Message.create({
    chatId,
    role: 'user',
    content: question.trim(),
  });

  const userDocs = await Document.find({ userId }, '_id');
  const chunkRecords = await Chunk.find({
    documentId: { $in: userDocs.map((d) => d._id) },
  });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  if (chunks.length === 0) {
    const assistantMessage = await Message.create({
      chatId,
      role: 'assistant',
      content:
        "I don't have any uploaded documents to answer from. Please add one in the Knowledge Base.",
    });

    res.status(201).json({
      success: true,
      data: { userMessage, assistantMessage },
      error: null,
    });
    return;
  }

  const queryEmbedding = await createEmbedding(question.trim());
  const rankedChunks = rankBySimilarity(queryEmbedding, chunks);

  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content:
          `Answer the question using ONLY the context below. ` +
          `If the answer is not in the context, say I don't know based on the uploaded documents.\n\n` +
          `Context:\n${buildContext(rankedChunks)}`,
      },
      { role: 'user', content: question.trim() },
    ],
  });

  const answer =
    stripThinking(response.choices[0]!.message.content ?? '') ||
    'No answer returned.';

  const assistantMessage = await Message.create({
    chatId,
    role: 'assistant',
    content: answer,
  });

  res.status(201).json({
    success: true,
    data: {
      userMessage,
      assistantMessage,
    },
    error: null,
  });
};
