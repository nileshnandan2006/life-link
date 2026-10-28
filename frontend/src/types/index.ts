export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'critical' | 'urgent' | 'normal';

export type DonorAvailability = 'available' | 'temp_unavailable' | 'emergency_only';

export type UserRole = 'requester' | 'donor' | 'admin';

export type RequestStatus = 
  | 'created' 
  | 'searching' 
  | 'donor_responded' 
  | 'coordinated' 
  | 'fulfilled' 
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  area: string;
  avatar?: string;
  isVerified: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface DonorProfile {
  userId: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  availability: DonorAvailability;
  city: string;
  area: string;
  approxDistanceKm?: number;
  latitude: number;
  longitude: number;
  lastDonationDate?: string;
  totalDonations: number;
  livesImpacted: number;
  isMedicalPrecheckPassed: boolean;
  badges: string[];
  notes?: string;
  privacyShowPhone: boolean;
}

export interface DonorResponse {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  donorDistanceKm: number;
  etaMinutes: number;
  message?: string;
  status: 'responded' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface RequestTimelineEvent {
  status: RequestStatus;
  title: string;
  description: string;
  timestamp: string;
}

export interface BloodRequest {
  id: string;
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
  latitude: number;
  longitude: number;
  urgency: UrgencyLevel;
  contactNumber: string;
  alternateContact?: string;
  notes?: string;
  status: RequestStatus;
  timeline: RequestTimelineEvent[];
  donorResponses: DonorResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
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

export interface NotificationItem {
  id: string;
  userId?: string; // empty means broadcast to relevant role
  roleTarget?: UserRole;
  title: string;
  message: string;
  type: 'emergency_alert' | 'donor_response' | 'status_update' | 'system' | 'fulfillment';
  urgency?: UrgencyLevel;
  relatedRequestId?: string;
  read: boolean;
  createdAt: string;
}

export interface DonationHistoryItem {
  id: string;
  donorId: string;
  requestId?: string;
  patientIdentifier: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  unitsDonated: number;
  date: string;
  verifiedByHospital: boolean;
  certificateId: string;
  feedback?: string;
}

export interface ReportedUser {
  id: string;
  reportedByUserId: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'false_request' | 'unreachable' | 'inappropriate' | 'fraud' | 'other';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
