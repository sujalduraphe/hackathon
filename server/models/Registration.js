import mongoose from 'mongoose';
import { toClient } from './plugins.js';

const registrationSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, maxlength: 500 },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

registrationSchema.index({ program: 1, user: 1 }, { unique: true });

toClient(registrationSchema);
export default mongoose.model('Registration', registrationSchema);
