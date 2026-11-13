import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn('⚠️  MongoDB Connection Warning: Could not connect to MongoDB at ' + env.MONGODB_URI);
    console.warn('👉 To seed or use persistent data, start MongoDB locally or set MONGODB_URI in server/.env');
  }
};
