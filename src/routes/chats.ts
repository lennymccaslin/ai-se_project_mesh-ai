import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChatById,
  listChats,
  sendMessage,
} from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.get('/', listChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessage);

export { chatsRouter };