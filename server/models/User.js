import mongoose from 'mongoose';
import { toClient } from './plugins.js';

export const ROLES = ['student', 'industry', 'faculty', 'institution'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ROLES, required: true },
  avatar: String,
  // organisation: company for industry, college for faculty/institution
  organization: { type: String, trim: true },
  designation: String,
  dept: String,
  // students keep their skill profile in a separate document (the talent pool entry)
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true });

toClient(userSchema);
export default mongoose.model('User', userSchema);
