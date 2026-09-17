import { Schema, model, Types } from 'mongoose';

const messageSchema = new Schema({
  chatId: { type: Types.ObjectId, ref: 'Chat', required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Message', messageSchema);