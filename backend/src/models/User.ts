import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid?: string;
  name: string;
  email: string;
  phone: string;
  role: 'requester' | 'donor' | 'admin';
  city: string;
  area: string;
  isVerified: boolean;
  status: 'active' | 'suspended';
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  firebaseUid: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['requester', 'donor', 'admin'], default: 'donor' },
  city: { type: String, default: 'New York' },
  area: { type: String, default: 'Metro Area' },
  isVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  avatar: { type: String }
}, {
  timestamps: true
});

export const User = model<IUser>('User', UserSchema);
