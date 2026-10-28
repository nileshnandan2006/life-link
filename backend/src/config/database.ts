import mongoose from 'mongoose';

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not set in backend/.env. Running in in-memory fallback mode.');
    return false;
  }

  try {
    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ [MongoDB] Successfully connected to MongoDB database:', mongoose.connection.name);
    return true;
  } catch (error: any) {
    console.error('❌ [MongoDB] Connection error:', error.message);
    console.warn('⚠️ [MongoDB] Ensure your IP is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0) and cluster address is accurate.');
    return false;
  }
}
