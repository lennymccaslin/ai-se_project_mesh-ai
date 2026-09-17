import { Schema, model, Types } from 'mongoose';

const chatSchema = new Schema({
  title: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Chat', chatSchema);