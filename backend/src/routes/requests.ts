import { Router, Request, Response } from 'express';
import { BloodGroup, isBloodCompatible } from '../utils/compatibility';

export const requestsRouter = Router();

// In-memory persistent emergency store
let requestsStore: any[] = [
  {
    id: 'req-101',
    requesterId: 'user-requester-1',
    requesterName: 'Dr. Sarah Chen',
    patientName: 'David Chen (Trauma Ward)',
    bloodGroup: 'B+',
    unitsNeeded: 3,
    hospitalName: 'Metro General Trauma Center',
    city: 'New York',
    area: 'Manhattan Medical District',
    urgency: 'critical',
    contactNumber: '+1 (555) 234-8901',
    status: 'searching',
    donorResponses: [],
    createdAt: new Date().toISOString()
  }
];

// GET /api/requests - Get all active emergency requests
requestsRouter.get('/', (req: Request, res: Response) => {
  const { bloodGroup, urgency, city } = req.query;
  let results = [...requestsStore];

  if (bloodGroup && typeof bloodGroup === 'string') {
    results = results.filter(r => r.bloodGroup === bloodGroup);
  }
  if (urgency && typeof urgency === 'string') {
    results = results.filter(r => r.urgency === urgency);
  }
  if (city && typeof city === 'string') {
    results = results.filter(r => r.city.toLowerCase() === city.toLowerCase());
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// GET /api/requests/:id - Get specific request
requestsRouter.get('/:id', (req: Request, res: Response) => {
  const found = requestsStore.find(r => r.id === req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Emergency request not found' });
  }
  res.json({ success: true, data: found });
});

// POST /api/requests - Create an emergency request
requestsRouter.post('/', (req: Request, res: Response) => {
  const { 
    patientName, 
    bloodGroup, 
    unitsNeeded, 
    hospitalName, 
    city, 
    area, 
    urgency, 
    contactNumber,
    notes 
  } = req.body;

  if (!patientName || !bloodGroup || !hospitalName || !contactNumber) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: patientName, bloodGroup, hospitalName, contactNumber' 
    });
  }

  const newRequest = {
    id: `req-${Date.now()}`,
    patientName,
    bloodGroup,
    unitsNeeded: unitsNeeded || 1,
    hospitalName,
    city: city || 'New York',
    area: area || 'Metro Area',
    urgency: urgency || 'critical',
    contactNumber,
    notes: notes || '',
    status: 'searching',
    donorResponses: [],
    createdAt: new Date().toISOString()
  };

  requestsStore.unshift(newRequest);

  res.status(201).json({
    success: true,
    message: 'Emergency blood request published and matching donors alerted',
    data: newRequest
  });
});

// POST /api/requests/:id/respond - Donor responds to request
requestsRouter.post('/:id/respond', (req: Request, res: Response) => {
  const { donorId, donorName, donorBloodGroup, etaMinutes, message } = req.body;
  const request = requestsStore.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const response = {
    id: `resp-${Date.now()}`,
    donorId: donorId || 'donor-anon',
    donorName: donorName || 'Verified Donor',
    donorBloodGroup: donorBloodGroup || 'O-',
    etaMinutes: etaMinutes || 30,
    message: message || 'I am on my way to donate.',
    status: 'responded',
    createdAt: new Date().toISOString()
  };

  request.donorResponses.push(response);
  if (request.status === 'searching') {
    request.status = 'donor_responded';
  }

  res.json({
    success: true,
    message: 'Donor response logged successfully',
    data: response
  });
});

// PATCH /api/requests/:id/status - Update status (fulfill or cancel)
requestsRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const request = requestsStore.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  request.status = status;
  res.json({
    success: true,
    message: `Request status updated to ${status}`,
    data: request
  });
});
