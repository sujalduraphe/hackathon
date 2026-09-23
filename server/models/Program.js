import mongoose from 'mongoose';
import { toClient } from './plugins.js';
import { PROGRAM_KINDS } from '../../src/lib/programs.js';

const programSchema = new mongoose.Schema({
  kind: { type: String, enum: Object.keys(PROGRAM_KINDS), required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  organization: { type: String, required: true },   // the posting company
  skills: [String],
  mode: { type: String, enum: ['Online', 'On-site', 'Hybrid'], default: 'Online' },
  location: String,
  startDate: String,
  duration: String,
  seats: { type: Number, min: 1 },
  compensation: String,                              // fee, stipend, funding or prize
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

toClient(programSchema);
export default mongoose.model('Program', programSchema);
