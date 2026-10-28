import { Schema, model, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyHotline: string;
  bloodBankAvailable: boolean;
  open24_7: boolean;
}

const HospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'New York' },
  area: { type: String, default: 'Medical District' },
  latitude: { type: Number, default: 40.7420 },
  longitude: { type: Number, default: -73.9740 },
  phone: { type: String, required: true },
  emergencyHotline: { type: String, default: '911' },
  bloodBankAvailable: { type: Boolean, default: true },
  open24_7: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Hospital = model<IHospital>('Hospital', HospitalSchema);
