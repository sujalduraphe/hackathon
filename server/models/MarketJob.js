import mongoose from 'mongoose';
import { toClient } from './plugins.js';

// A real-world job description imported from an external dataset (e.g. a
// Glassdoor export). Used only to measure market skill demand.
const marketJobSchema = new mongoose.Schema({
  batch: { type: String, required: true, index: true },   // one import = one batch
  source: { type: String, required: true },
  title: { type: String, required: true },
  company: String,
  location: String,
  description: String,
  skills: [String],
  role: String,                                              // role family, if the title matches one
  importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

toClient(marketJobSchema);
export default mongoose.model('MarketJob', marketJobSchema);
