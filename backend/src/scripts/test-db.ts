import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Configure public DNS to resolve Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // fallback to system default
}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection with URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ SUCCESS! Connected to MongoDB Atlas successfully.');
    console.log('Database name:', mongoose.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
}

testConnection();
