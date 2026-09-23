import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import { runSeed } from './seed.js';

const PORT = process.env.PORT || 5050;

connectDB()
  .then(async conn => {
    console.log(`MongoDB connected: ${conn.host}/${conn.name}`);
    // First deploy: fill an empty database with demo data (never touches existing data)
    if (process.env.SEED_DEMO === 'true' && (await User.estimatedDocumentCount()) === 0) {
      console.log('Empty database: loading demo data…');
      await runSeed();
    }
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
