import { Router, Request, Response } from 'express';

export const hospitalsRouter = Router();

const hospitals = [
  {
    id: 'hosp-1',
    name: 'Metro General Trauma Center',
    address: '520 1st Avenue, New York, NY 10016',
    phone: '+1 (555) 780-4000',
    bloodBankAvailable: true,
    open24_7: true
  },
  {
    id: 'hosp-2',
    name: 'St. Jude Memorial Hospital',
    address: '340 E 34th St, New York, NY 10016',
    phone: '+1 (555) 780-8000',
    bloodBankAvailable: true,
    open24_7: true
  },
  {
    id: 'hosp-3',
    name: 'City Children’s Speciality Hospital',
    address: '1000 5th Avenue, New York, NY 10028',
    phone: '+1 (555) 450-2020',
    bloodBankAvailable: true,
    open24_7: true
  }
];

hospitalsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: hospitals
  });
});
