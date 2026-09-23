import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aicp') {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  return mongoose.connection;
}
