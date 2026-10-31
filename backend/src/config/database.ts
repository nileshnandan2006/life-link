import mongoose from 'mongoose';
import dns from 'dns';

// Reliable DNS resolution for Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // fallback to system default
}

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
    if (error.message.includes('IP that isn\'t whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.warn('👉 [Action Required in Atlas] Whitelist IP in MongoDB Atlas: Go to Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0).');
    }
    return false;
  }
}
