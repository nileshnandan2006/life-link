import { Schema, model, Document } from 'mongoose';
import { BloodGroup } from '../utils/compatibility';

export interface IDonorResponse {
  id: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  etaMinutes: number;
  message?: string;
  status: 'responded' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface IBloodRequest extends Document {
  requesterId: string;
  requesterName: string;
  patientName: string;
  patientAge?: number;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  urgency: 'critical' | 'urgent' | 'normal';
  contactNumber: string;
  alternateContact?: string;
  notes?: string;
  status: 'created' | 'searching' | 'donor_responded' | 'coordinated' | 'fulfilled' | 'cancelled';
  donorResponses: IDonorResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema = new Schema<IBloodRequest>({
  requesterId: { type: String, required: true },
  requesterName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  unitsNeeded: { type: Number, default: 1, min: 1 },
  hospitalName: { type: String, required: true },
  hospitalAddress: { type: String, default: '' },
  city: { type: String, default: 'New York' },
  area: { type: String, default: 'Metro Area' },
  latitude: { type: Number },
  longitude: { type: Number },
  urgency: { type: String, enum: ['critical', 'urgent', 'normal'], default: 'critical' },
  contactNumber: { type: String, required: true },
  alternateContact: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'searching', 'donor_responded', 'coordinated', 'fulfilled', 'cancelled'], 
    default: 'searching' 
  },
  donorResponses: [{
    id: String,
    donorId: String,
    donorName: String,
    donorBloodGroup: String,
    donorPhone: String,
    etaMinutes: Number,
    message: String,
    status: String,
    createdAt: String
  }]
}, {
  timestamps: true
});

export const BloodRequest = model<IBloodRequest>('BloodRequest', BloodRequestSchema);
