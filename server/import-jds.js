// Import job descriptions from a CSV (e.g. a Glassdoor export) into the market-demand data.
//   npm run import-jds -- path/to/file.csv "Source name"
import 'dotenv/config';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import MarketJob from './models/MarketJob.js';
import { parseCSV } from './utils/csv.js';
import { rowsToJobs } from './controllers/marketController.js';

const [file, source = file] = process.argv.slice(2);
if (!file) { console.error('Usage: npm run import-jds -- <file.csv> "<source name>"'); process.exit(1); }
try {
  await connectDB();
  const rows = parseCSV(fs.readFileSync(file, 'utf8'));
  const { jobs, skipped, columns } = rowsToJobs(rows, { batch: `b${Date.now().toString(36)}`, source });
  await MarketJob.insertMany(jobs);
  console.log(`Imported ${jobs.length} job descriptions from ${file} (${skipped} skipped). Columns used:`, columns);
} catch (e) {
  console.error(e.message); process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
