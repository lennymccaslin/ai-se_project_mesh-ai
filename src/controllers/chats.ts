import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/chat.js';
import Message from '../models/message.js';

export const createChat = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  if (typeof title !== 'string' || !title.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'title is required' },
    });
    return;
  }

  const chat = await Chat.create({
    title: title.trim(),
    userId,
  });

  res.status(201).json({
    success: true,
    data: chat,
    error: null,
  });
};

export const getChats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  const chats = await Chat.find({ userId });
  res.status(200).json({ success: true, data: chats, error: null });
};

export const getChat = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const chatId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  if (typeof chatId !== 'string' || !chatId.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid chat id' },
    });
    return;
  }

  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid chat id format' },
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

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: { chat, messages },
    error: null,
  });
};

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
  const chatId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authentication required' },
    });
    return;
  }

  if (typeof chatId !== 'string' || !chatId.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid chat id' },
    });
    return;
  }

  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Invalid chat id format' },
    });
    return;
  }

  const chat = await Chat.findOneAndDelete({
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

  res.status(204).send();
};

