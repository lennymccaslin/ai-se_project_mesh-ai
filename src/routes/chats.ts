import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  sendMessage,
} from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChat);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessage);

export { chatsRouter };