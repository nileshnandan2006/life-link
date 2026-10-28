import { BloodGroup, UrgencyLevel, RequestStatus } from '../types';

/**
 * Red Blood Cell Compatibility Matrix:
 * Recipient -> List of compatible Donor blood groups
 */
export const RECIPIENT_CAN_RECEIVE_FROM: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Can only receive from O-
};

/**
 * Donor -> List of compatible Recipient blood groups
 */
export const DONOR_CAN_GIVE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'A+': ['A+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB+', 'AB-'],
  'AB+': ['AB+'] // Can only give to AB+
};

/**
 * Determine if a donor can donate to a recipient
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowed = RECIPIENT_CAN_RECEIVE_FROM[recipientGroup] || [];
  return allowed.includes(donorGroup);
}

/**
 * Check if donor is an exact match
 */
export function isExactMatch(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return donorGroup === recipientGroup;
}

/**
 * Get compatibility explanation text
 */
export function getCompatibilityLabel(donorGroup: BloodGroup, recipientGroup: BloodGroup): {
  type: 'exact' | 'compatible' | 'incompatible';
  badgeText: string;
  subtext: string;
} {
  if (isExactMatch(donorGroup, recipientGroup)) {
    return {
      type: 'exact',
      badgeText: 'Exact Match',
      subtext: `${donorGroup} matches recipient ${recipientGroup} perfectly.`
    };
  }
  if (isBloodCompatible(donorGroup, recipientGroup)) {
    const isUniv = donorGroup === 'O-';
    return {
      type: 'compatible',
      badgeText: isUniv ? 'Universal Donor Match' : 'Compatible Match',
      subtext: isUniv 
        ? 'O- is the universal donor, highly safe for emergency transfusion.' 
        : `${donorGroup} is biologically compatible with ${recipientGroup}.`
    };
  }
  return {
    type: 'incompatible',
    badgeText: 'Incompatible',
    subtext: `${donorGroup} cannot be transfused to ${recipientGroup}.`
  };
}

/**
 * Haversine distance in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Mask phone number for privacy display
 * e.g. "+1 (555) 345-6789" -> "+1 (555) •••-6789"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '••••••••••';
  const clean = phone.trim();
  if (clean.length <= 6) return '••••••' + clean.slice(-2);
  return clean.slice(0, 4) + ' ••• ••' + clean.slice(-2);
}

/**
 * Urgency badge properties
 */
export function getUrgencyBadge(urgency: UrgencyLevel) {
  switch (urgency) {
    case 'critical':
      return {
        label: 'Critical – Needed Immediately',
        shortLabel: 'Critical',
        bg: 'bg-red-500',
        text: 'text-white',
        border: 'border-red-600',
        lightBg: 'bg-red-50 text-red-700 border-red-200',
        pulse: true
      };
    case 'urgent':
      return {
        label: 'Urgent – Within a Few Hours',
        shortLabel: 'Urgent',
        bg: 'bg-amber-500',
        text: 'text-white',
        border: 'border-amber-600',
        lightBg: 'bg-amber-50 text-amber-700 border-amber-200',
        pulse: false
      };
    case 'normal':
    default:
      return {
        label: 'Normal – Needed Today',
        shortLabel: 'Normal',
        bg: 'bg-blue-600',
        text: 'text-white',
        border: 'border-blue-700',
        lightBg: 'bg-blue-50 text-blue-700 border-blue-200',
        pulse: false
      };
  }
}

/**
 * Status timeline sequence definition
 */
export const REQUEST_STEPS: { key: RequestStatus; label: string; desc: string }[] = [
  { key: 'created', label: 'Request Created', desc: 'Emergency request registered' },
  { key: 'searching', label: 'Searching Donors', desc: 'Alerting nearby compatible matches' },
  { key: 'donor_responded', label: 'Donor Responded', desc: 'Eligible donor accepted call' },
  { key: 'coordinated', label: 'Donation Coordinated', desc: 'Transit & hospital check underway' },
  { key: 'fulfilled', label: 'Request Fulfilled', desc: 'Blood units safely collected' }
];

export function getStepIndex(status: RequestStatus): number {
  if (status === 'cancelled') return -1;
  const index = REQUEST_STEPS.findIndex(s => s.key === status);
  return index !== -1 ? index : 0;
}

/**
 * Browser Web Audio Emergency Chime
 */
export function playEmergencyAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // Create 2 beeps
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.setValueAtTime(1174.66, now + 0.15); // D6
    
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second beep
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1174.66, ctx.currentTime);
        osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.12);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.35);
      } catch {
        // audio context blocked by browser gesture
      }
    }, 200);
  } catch {
    // AudioContext might be muted or not allowed without user gesture
  }
}
