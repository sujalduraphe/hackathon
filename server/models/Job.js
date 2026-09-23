import mongoose from 'mongoose';
import { toClient } from './plugins.js';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  logo: String,
  color: String,
  type: { type: String, default: 'Internship' },
  category: { type: String, enum: ['internship', 'fulltime', 'research'], default: 'internship' },
  location: String,
  mode: String,
  stipend: String,
  duration: String,
  description: String,
  skills: { type: [String], required: true, validate: v => v.length > 0 },
  minSkillLevel: { type: Number, default: 60, min: 30, max: 100 },
  minCGPA: { type: Number, default: 0 },
  openings: { type: Number, default: 1 },
  deadline: String,
  departments: [String],
  applicants: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

jobSchema.virtual('posted').get(function () { return this.createdAt?.toISOString().slice(0, 10); });

toClient(jobSchema);
export default mongoose.model('Job', jobSchema);
