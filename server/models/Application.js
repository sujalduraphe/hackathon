import mongoose from 'mongoose';
import { toClient } from './plugins.js';

export const STAGES = ['applied', 'shortlisted', 'assessment', 'interview', 'offered', 'rejected'];

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: STAGES, default: 'applied' },
  // match score at the time of applying, kept for recruitment analytics
  matchAtApply: Number,
  history: [{ status: String, at: { type: Date, default: Date.now }, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

toClient(applicationSchema);
export default mongoose.model('Application', applicationSchema);
