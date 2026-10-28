import { Router, Request, Response } from 'express';
import { BloodGroup, isBloodCompatible } from '../utils/compatibility';

export const donorsRouter = Router();

let donorsStore = [
  {
    id: 'user-donor-1',
    name: 'Marcus Vance',
    bloodGroup: 'O-',
    age: 29,
    availability: 'available',
    city: 'New York',
    area: 'Midtown East',
    totalDonations: 6,
    livesImpacted: 18,
    phone: '+1 (555) 892-4112'
  },
  {
    id: 'user-donor-2',
    name: 'Aisha Al-Mansoor',
    bloodGroup: 'B+',
    age: 26,
    availability: 'available',
    city: 'New York',
    area: 'Queens - Astoria',
    totalDonations: 3,
    livesImpacted: 9,
    phone: '+1 (555) 431-7788'
  }
];

// GET /api/donors - Get nearby donors (with privacy protection)
donorsRouter.get('/', (req: Request, res: Response) => {
  const { bloodGroup, availability, city, compatibleFor } = req.query;
  let results = [...donorsStore];

  if (bloodGroup && typeof bloodGroup === 'string') {
    results = results.filter(d => d.bloodGroup === bloodGroup);
  }
  if (availability && typeof availability === 'string') {
    results = results.filter(d => d.availability === availability);
  }
  if (compatibleFor && typeof compatibleFor === 'string') {
    results = results.filter(d => isBloodCompatible(d.bloodGroup as BloodGroup, compatibleFor as BloodGroup));
  }

  // Mask exact phone numbers for privacy
  const sanitized = results.map(d => ({
    ...d,
    phoneMasked: d.phone.slice(0, 4) + ' ••• ••' + d.phone.slice(-2)
  }));

  res.json({
    success: true,
    count: sanitized.length,
    data: sanitized
  });
});

// PATCH /api/donors/:id/availability - Update availability status
donorsRouter.patch('/:id/availability', (req: Request, res: Response) => {
  const { availability } = req.body;
  const donor = donorsStore.find(d => d.id === req.params.id);

  if (!donor) {
    return res.status(404).json({ success: false, message: 'Donor not found' });
  }

  donor.availability = availability;
  res.json({
    success: true,
    message: `Donor availability updated to ${availability}`,
    data: donor
  });
});
