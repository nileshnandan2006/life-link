import { Schema, model, Document } from 'mongoose';
import { BloodGroup } from '../utils/compatibility';

export interface IDonorProfile extends Document {
  userId: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'male' | 'female' | 'other';
  availability: 'available' | 'temp_unavailable' | 'emergency_only';
  city: string;
  area: string;
  approxDistanceKm?: number;
  latitude?: number;
  longitude?: number;
  lastDonationDate?: string;
  totalDonations: number;
  livesImpacted: number;
  isMedicalPrecheckPassed: boolean;
  badges: string[];
  notes?: string;
  phone: string;
}

const DonorProfileSchema = new Schema<IDonorProfile>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  age: { type: Number, required: true, min: 18, max: 65 },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  availability: { 
    type: String, 
    enum: ['available', 'temp_unavailable', 'emergency_only'], 
    default: 'available' 
  },
  city: { type: String, default: 'New York' },
  area: { type: String, default: 'Midtown East' },
  approxDistanceKm: { type: Number, default: 2.5 },
  latitude: { type: Number },
  longitude: { type: Number },
  lastDonationDate: { type: String },
  totalDonations: { type: Number, default: 0 },
  livesImpacted: { type: Number, default: 0 },
  isMedicalPrecheckPassed: { type: Boolean, default: true },
  badges: [{ type: String }],
  notes: { type: String },
  phone: { type: String, required: true }
}, {
  timestamps: true
});

export const DonorProfile = model<IDonorProfile>('DonorProfile', DonorProfileSchema);
