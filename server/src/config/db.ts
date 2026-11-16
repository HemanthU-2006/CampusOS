import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    if (env.MONGODB_URI.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
      } catch {
        // ignore if custom dns set not permitted
      }
    }
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.warn('⚠️  MongoDB Connection Warning: ' + (error?.message || 'Could not connect to MongoDB'));
    console.warn('👉 If using MongoDB Atlas, make sure 0.0.0.0/0 (Allow Access from Anywhere) is added under Network Access in Atlas.');
  }
};
