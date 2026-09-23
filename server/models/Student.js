import mongoose from 'mongoose';
import { toClient } from './plugins.js';

const portfolioItem = fields => new mongoose.Schema({
  ...fields,
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
}, { timestamps: true });

// A student's skill profile. This is what recruiters rank and institutions track.
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: String,
  college: String,
  dept: String,
  year: String,
  cgpa: { type: Number, min: 0, max: 10 },
  skills: { type: Object, default: {} },                    // canonical skill -> level 0-100
  skillSource: { type: Object, default: {} },               // canonical skill -> 'self' | 'assessment'
  // Uploaded resume (PDF). The file bytes are only loaded when someone opens it.
  resume: {
    filename: String,
    size: Number,
    uploadedAt: Date,
    data: { type: Buffer, select: false },
  },
  // Portfolio entries added by the student. Only the student's institution can verify them.
  projects: [portfolioItem({ title: { type: String, required: true }, description: String, tech: [String], link: String })],
  achievements: [portfolioItem({ title: { type: String, required: true }, year: String, description: String })],
}, { timestamps: true });

toClient(studentSchema);
export default mongoose.model('Student', studentSchema);
