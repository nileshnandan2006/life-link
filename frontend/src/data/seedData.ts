import { 
  User, 
  DonorProfile, 
  BloodRequest, 
  Hospital, 
  NotificationItem, 
  DonationHistoryItem,
  ReportedUser
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-requester-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@medmail.org',
    phone: '+1 (555) 234-8901',
    role: 'requester',
    city: 'New York',
    area: 'Manhattan Medical District',
    avatar: 'https://images.unsplash.com/photo-1594824813586-455b9e0f6c26?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'user-donor-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@techcorp.io',
    phone: '+1 (555) 892-4112',
    role: 'donor',
    city: 'New York',
    area: 'Midtown East',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-10T11:20:00Z'
  },
  {
    id: 'user-admin-1',
    name: 'Elena Rostova',
    email: 'elena.admin@lifelink.org',
    phone: '+1 (555) 900-3322',
    role: 'admin',
    city: 'New York',
    area: 'Operations HQ',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-donor-2',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.m@sunrise.net',
    phone: '+1 (555) 431-7788',
    role: 'donor',
    city: 'New York',
    area: 'Queens - Astoria',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-07-20T14:10:00Z'
  },
  {
    id: 'user-donor-3',
    name: 'David Kim',
    email: 'david.kim@studio.design',
    phone: '+1 (555) 671-2299',
    role: 'donor',
    city: 'New York',
    area: 'Brooklyn Heights',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-30T16:45:00Z'
  },
  {
    id: 'user-donor-4',
    name: 'Priya Sharma',
    email: 'priya.sharma@healthfirst.org',
    phone: '+1 (555) 782-9011',
    role: 'donor',
    city: 'New York',
    area: 'Upper East Side',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'user-donor-5',
    name: 'Carlos Mendez',
    email: 'carlos.m@logix.com',
    phone: '+1 (555) 349-1100',
    role: 'donor',
    city: 'New York',
    area: 'Lower East Side',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    status: 'active',
    createdAt: '2026-09-12T09:00:00Z'
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
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
    id: 'hosp-2',
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
    id: 'hosp-3',
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
  },
  {
    id: 'hosp-4',
    name: 'Brooklyn Heart & Emergency Center',
    address: '121 DeKalb Ave, Brooklyn, NY 11201',
    city: 'New York',
    area: 'Downtown Brooklyn',
    latitude: 40.6908,
    longitude: -73.9785,
    phone: '+1 (555) 250-9900',
    emergencyHotline: '911 Ext 990',
    bloodBankAvailable: false,
    open24_7: true
  },
  {
    id: 'hosp-5',
    name: 'Mount Sinai West Emergency Care',
    address: '1000 10th Ave, New York, NY 10019',
    city: 'New York',
    area: 'Hell’s Kitchen',
    latitude: 40.7702,
    longitude: -73.9875,
    phone: '+1 (555) 523-4000',
    emergencyHotline: '911 Ext 440',
    bloodBankAvailable: true,
    open24_7: true
  }
];

export const INITIAL_DONOR_PROFILES: DonorProfile[] = [
  {
    userId: 'user-donor-1',
    bloodGroup: 'O-', // Universal donor!
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
    badges: ['Universal Hero', 'Quick Responder (30m)', 'Golden Heart'],
    notes: 'Available for urgent emergency calls. Car accessible.',
    privacyShowPhone: true
  },
  {
    userId: 'user-donor-2',
    bloodGroup: 'B+',
    age: 26,
    gender: 'female',
    availability: 'available',
    city: 'New York',
    area: 'Queens - Astoria',
    approxDistanceKm: 4.5,
    latitude: 40.7648,
    longitude: -73.9235,
    lastDonationDate: '2026-07-01',
    totalDonations: 3,
    livesImpacted: 9,
    isMedicalPrecheckPassed: true,
    badges: ['Verified Donor', 'Rare Group Supporter'],
    notes: 'Can reach Manhattan in 25 mins by subway.',
    privacyShowPhone: true
  },
  {
    userId: 'user-donor-3',
    bloodGroup: 'A+',
    age: 34,
    gender: 'male',
    availability: 'emergency_only',
    city: 'New York',
    area: 'Brooklyn Heights',
    approxDistanceKm: 3.2,
    latitude: 40.6958,
    longitude: -73.9936,
    lastDonationDate: '2026-05-18',
    totalDonations: 8,
    livesImpacted: 24,
    isMedicalPrecheckPassed: true,
    badges: ['Life Saver Master', 'Century Club Member'],
    notes: 'Text preferred first before calling.',
    privacyShowPhone: true
  },
  {
    userId: 'user-donor-4',
    bloodGroup: 'AB+', // Universal recipient, gives to AB+
    age: 31,
    gender: 'female',
    availability: 'available',
    city: 'New York',
    area: 'Upper East Side',
    approxDistanceKm: 2.1,
    latitude: 40.7736,
    longitude: -73.9566,
    lastDonationDate: '2026-06-25',
    totalDonations: 4,
    livesImpacted: 12,
    isMedicalPrecheckPassed: true,
    badges: ['Plasma Specialist', 'Fast Responder'],
    notes: 'Walkable to City Children’s and Mount Sinai.',
    privacyShowPhone: false
  },
  {
    userId: 'user-donor-5',
    bloodGroup: 'O+',
    age: 27,
    gender: 'male',
    availability: 'available',
    city: 'New York',
    area: 'Lower East Side',
    approxDistanceKm: 2.9,
    latitude: 40.7180,
    longitude: -73.9870,
    lastDonationDate: '2026-07-15',
    totalDonations: 2,
    livesImpacted: 6,
    isMedicalPrecheckPassed: true,
    badges: ['New Champion'],
    notes: 'Available anytime after 4 PM or during emergencies.',
    privacyShowPhone: true
  }
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-101',
    requesterId: 'user-requester-1',
    requesterName: 'Dr. Sarah Chen',
    patientName: 'David Chen (Trauma Ward, Bed 4B)',
    patientAge: 32,
    bloodGroup: 'B+',
    unitsNeeded: 3,
    hospitalName: 'Metro General Trauma Center',
    hospitalAddress: '520 1st Avenue, New York, NY 10016',
    city: 'New York',
    area: 'Manhattan Medical District',
    latitude: 40.7420,
    longitude: -73.9740,
    urgency: 'critical',
    contactNumber: '+1 (555) 234-8901',
    alternateContact: '+1 (555) 234-8999 (Nurse Station)',
    notes: 'Post-motorcycle collision urgent blood loss. Immediate surgery scheduled. Blood bank supplies depleted.',
    status: 'searching',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'created',
        title: 'Emergency Request Created',
        description: 'Requester filed Critical request for 3 units of B+ at Metro General.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        status: 'searching',
        title: 'Matching Donors Alerted',
        description: 'LifeLink broadcasted emergency alerts to 5 compatible donors within 8 km.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ],
    donorResponses: [
      {
        id: 'resp-1',
        requestId: 'req-101',
        donorId: 'user-donor-1',
        donorName: 'Marcus Vance',
        donorBloodGroup: 'O-',
        donorPhone: '+1 (555) 892-4112',
        donorDistanceKm: 1.8,
        etaMinutes: 20,
        message: 'I am on my way with O- blood! ETA 20 minutes to Metro General ICU reception.',
        status: 'responded',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'req-102',
    requesterId: 'user-requester-demo2',
    requesterName: 'Emily Watson',
    patientName: 'Sophia Watson (Pediatric Oncology)',
    patientAge: 8,
    bloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalName: 'City Children’s Speciality Hospital',
    hospitalAddress: '1000 5th Avenue, New York, NY 10028',
    city: 'New York',
    area: 'Upper East Side',
    latitude: 40.7794,
    longitude: -73.9632,
    urgency: 'urgent',
    contactNumber: '+1 (555) 912-3004',
    notes: 'Scheduled transfusion required by this evening. O- universal match required.',
    status: 'donor_responded',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'created',
        title: 'Request Created',
        description: 'Urgent request for 2 units O- at City Children’s.',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        status: 'searching',
        title: 'Alerts Dispatched',
        description: 'Broadcasted to registered O- donors.',
        timestamp: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString()
      },
      {
        status: 'donor_responded',
        title: 'Donor Responded',
        description: 'Donor accepted and is undergoing preliminary hospital check.',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      }
    ],
    donorResponses: [
      {
        id: 'resp-2',
        requestId: 'req-102',
        donorId: 'user-donor-1',
        donorName: 'Marcus Vance',
        donorBloodGroup: 'O-',
        donorPhone: '+1 (555) 892-4112',
        donorDistanceKm: 2.4,
        etaMinutes: 35,
        message: 'Checked with blood bank desk. Can donate at 4:30 PM.',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'req-103',
    requesterId: 'user-requester-demo3',
    requesterName: 'Robert Vance',
    patientName: 'Arthur Vance (Cardiac Bypass)',
    patientAge: 68,
    bloodGroup: 'A+',
    unitsNeeded: 4,
    hospitalName: 'St. Jude Memorial Hospital',
    hospitalAddress: '340 E 34th St, New York, NY 10016',
    city: 'New York',
    area: 'Murray Hill',
    latitude: 40.7445,
    longitude: -73.9725,
    urgency: 'normal',
    contactNumber: '+1 (555) 888-2940',
    notes: 'Replacement units needed before tomorrow morning surgery.',
    status: 'coordinated',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'created',
        title: 'Request Created',
        description: 'Normal request registered for 4 units A+.',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      },
      {
        status: 'searching',
        title: 'Donors Matched',
        description: 'Found 7 compatible local donors.',
        timestamp: new Date(Date.now() - 7.5 * 3600 * 1000).toISOString()
      },
      {
        status: 'donor_responded',
        title: 'Donors Confirmed',
        description: '2 donors registered for donation time slot.',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      },
      {
        status: 'coordinated',
        title: 'Donation Slot Coordinated',
        description: 'Hospital blood bank counter confirmed donation slot.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    donorResponses: []
  },
  {
    id: 'req-104',
    requesterId: 'user-requester-demo4',
    requesterName: 'Karen Miller',
    patientName: 'Liam Miller (Severe Anemia)',
    patientAge: 19,
    bloodGroup: 'AB-',
    unitsNeeded: 1,
    hospitalName: 'Mount Sinai West Emergency Care',
    hospitalAddress: '1000 10th Ave, New York, NY 10019',
    city: 'New York',
    area: 'Hell’s Kitchen',
    latitude: 40.7702,
    longitude: -73.9875,
    urgency: 'critical',
    contactNumber: '+1 (555) 678-1928',
    notes: 'Urgent need for AB- or compatible negative units.',
    status: 'fulfilled',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    timeline: [
      {
        status: 'created',
        title: 'Request Created',
        description: 'Critical request submitted.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        status: 'fulfilled',
        title: 'Request Fulfilled Successfully',
        description: 'Patient received transfusion. Verified by hospital blood bank.',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      }
    ],
    donorResponses: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    roleTarget: 'donor',
    title: 'CRITICAL EMERGENCY: B+ Blood Needed',
    message: '3 units needed immediately at Metro General Trauma Center (1.8 km away).',
    type: 'emergency_alert',
    urgency: 'critical',
    relatedRequestId: 'req-101',
    read: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    roleTarget: 'requester',
    title: 'Donor Responded to Your Request!',
    message: 'Marcus Vance (O- Universal Donor) has responded: "ETA 20 minutes to Metro General ICU reception."',
    type: 'donor_response',
    urgency: 'critical',
    relatedRequestId: 'req-101',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    roleTarget: 'donor',
    title: 'Donation Badge Awarded: Golden Heart',
    message: 'Thank you for your life-saving contribution. Your donation certificate has been issued.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
  }
];

export const INITIAL_DONATION_HISTORY: DonationHistoryItem[] = [
  {
    id: 'hist-1',
    donorId: 'user-donor-1',
    requestId: 'req-old-1',
    patientIdentifier: 'Emergency Patient #NY-9021',
    hospitalName: 'Metro General Trauma Center',
    bloodGroup: 'O-',
    unitsDonated: 1,
    date: '2026-06-12',
    verifiedByHospital: true,
    certificateId: 'LL-CERT-2026-0891',
    feedback: 'Life-saving blood for multi-vehicle trauma patient.'
  },
  {
    id: 'hist-2',
    donorId: 'user-donor-1',
    requestId: 'req-old-2',
    patientIdentifier: 'Pediatric Care #NY-4412',
    hospitalName: 'City Children’s Speciality Hospital',
    bloodGroup: 'O-',
    unitsDonated: 1,
    date: '2026-03-04',
    verifiedByHospital: true,
    certificateId: 'LL-CERT-2026-0312',
    feedback: 'Critical transfusion for premature infant.'
  },
  {
    id: 'hist-3',
    donorId: 'user-donor-1',
    patientIdentifier: 'Community Blood Drive #CBD-22',
    hospitalName: 'Mount Sinai West Emergency Care',
    bloodGroup: 'O-',
    unitsDonated: 1,
    date: '2025-11-19',
    verifiedByHospital: true,
    certificateId: 'LL-CERT-2025-1109',
    feedback: 'Regular volunteer replenishment donation.'
  }
];

export const INITIAL_REPORTS: ReportedUser[] = [
  {
    id: 'rep-1',
    reportedByUserId: 'user-requester-1',
    reportedUserId: 'user-spam-9',
    reportedUserName: 'Fake Agent Test',
    reason: 'inappropriate',
    details: 'User asked for money reimbursement before donating blood. Commercial blood selling is illegal.',
    status: 'pending',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];
