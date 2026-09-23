import mongoose from 'mongoose';
import { toClient } from './plugins.js';

const assessmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  category: { type: String, required: true },
  answers: [Number],
  score: Number,
  skillResults: { type: Object },
  changes: { type: Object },
}, { timestamps: true });

toClient(assessmentSchema);
export default mongoose.model('Assessment', assessmentSchema);
