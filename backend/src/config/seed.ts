import { User } from '../models/User';
import { DonorProfile } from '../models/DonorProfile';
import { BloodRequest } from '../models/BloodRequest';
import { Hospital } from '../models/Hospital';

export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`ℹ️ [MongoDB] Database already initialized with ${userCount} users.`);
      return;
    }

    console.log('🌱 [MongoDB] Seeding initial LifeLink emergency database records...');

    // Seed Hospitals
    await Hospital.insertMany([
      {
        name: 'Metro General Trauma Center',
        address: '520 1st Avenue, New York, NY 10016',
        city: 'New York',
        area: 'Manhattan Medical District',
        latitude: 40.7420,
        longitude: -73.9740,
        phone: '+1 (555) 780-4000',
        emergencyHotline: '911 Ext 400',
        bloodBankAvailable: true,
        open24_7: true
      },
      {
        name: 'St. Jude Memorial Hospital',
        address: '340 E 34th St, New York, NY 10016',
        city: 'New York',
        area: 'Murray Hill',
        latitude: 40.7445,
        longitude: -73.9725,
        phone: '+1 (555) 780-8000',
        emergencyHotline: '911 Ext 811',
        bloodBankAvailable: true,
        open24_7: true
      },
      {
        name: 'City Children’s Speciality Hospital',
        address: '1000 5th Avenue, New York, NY 10028',
        city: 'New York',
        area: 'Upper East Side',
        latitude: 40.7794,
        longitude: -73.9632,
        phone: '+1 (555) 450-2020',
        emergencyHotline: '911 Ext 202',
        bloodBankAvailable: true,
        open24_7: true
      }
    ]);

    // Seed Users
    const seededUsers = await User.insertMany([
      {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@medmail.org',
        phone: '+1 (555) 234-8901',
        role: 'requester',
        city: 'New York',
        area: 'Manhattan Medical District',
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@techcorp.io',
        phone: '+1 (555) 892-4112',
        role: 'donor',
        city: 'New York',
        area: 'Midtown East',
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Elena Rostova',
        email: 'elena.admin@lifelink.org',
        phone: '+1 (555) 900-3322',
        role: 'admin',
        city: 'New York',
        area: 'Operations HQ',
        isVerified: true,
        status: 'active'
      }
    ]);

    // Seed Donor Profiles
    await DonorProfile.insertMany([
      {
        userId: seededUsers[1]._id.toString(),
        name: 'Marcus Vance',
        bloodGroup: 'O-',
        age: 29,
        gender: 'male',
        availability: 'available',
        city: 'New York',
        area: 'Midtown East',
        approxDistanceKm: 1.8,
        latitude: 40.7549,
        longitude: -73.9728,
        lastDonationDate: '2026-06-12',
        totalDonations: 6,
        livesImpacted: 18,
        isMedicalPrecheckPassed: true,
        badges: ['Universal Hero', 'Quick Responder', 'Golden Heart'],
        notes: 'Available for urgent emergency calls. Car accessible.',
        phone: '+1 (555) 892-4112'
      }
    ]);

    // Seed Emergency Blood Request
    await BloodRequest.create({
      requesterId: seededUsers[0]._id.toString(),
      requesterName: 'Dr. Sarah Chen',
      patientName: 'David Chen (Trauma Ward)',
      patientAge: 32,
      bloodGroup: 'B+',
      unitsNeeded: 3,
      hospitalName: 'Metro General Trauma Center',
      hospitalAddress: '520 1st Avenue, New York, NY 10016',
      city: 'New York',
      area: 'Manhattan Medical District',
      urgency: 'critical',
      contactNumber: '+1 (555) 234-8901',
      notes: 'Motorcycle collision blood loss. Immediate surgery scheduled.',
      status: 'searching',
      donorResponses: []
    });

    console.log('✅ [MongoDB] Initial emergency database successfully seeded.');
  } catch (err: any) {
    console.error('⚠️ [MongoDB] Seeding error (non-fatal):', err.message);
  }
}
