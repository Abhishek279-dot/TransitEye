import { EventType, IncidentStatus } from '../types';

export interface EventTypeConfig {
  key: EventType;
  label: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  pothole: {
    key: 'pothole',
    label: 'Pothole',
    color: '#E11D48', // Rose/Red
    bgLight: '#e4ffed',
    borderColor: '#FDA4AF',
    description: 'Road surface cavity / crater'
  },
  waterlogging: {
    key: 'waterlogging',
    label: 'Waterlogging',
    color: '#0284C7', // Sky blue
    bgLight: '#E0F2FE',
    borderColor: '#7DD3FC',
    description: 'Standing stormwater pool'
  },
  traffic_congestion: {
    key: 'traffic_congestion',
    label: 'Traffic Congestion',
    color: '#D97706', // Amber
    bgLight: '#FEF3C7',
    borderColor: '#FCD34D',
    description: 'High vehicle queue density'
  },
  unsafe_pedestrian: {
    key: 'unsafe_pedestrian',
    label: 'Unsafe Pedestrian',
    color: '#7C3AED', // Purple
    bgLight: '#EDE9FE',
    borderColor: '#C4B5FD',
    description: 'Pedestrian hazard on road'
  },
  hit_and_run: {
    key: 'hit_and_run',
    label: 'Hit-and-Run',
    color: '#991B1B', // Deep red
    bgLight: '#FEE2E2',
    borderColor: '#F87171',
    description: 'Vehicle incident with OCR'
  },
  traffic_sign_issue: {
    key: 'traffic_sign_issue',
    label: 'Traffic Sign Issue',
    color: '#0D9488', // Teal
    bgLight: '#CCFBF1',
    borderColor: '#5EEAD4',
    description: 'Damaged or obscured sign'
  }
};

export const COMING_SOON_EVENT_TYPES = [
  { label: 'Missing Road Divider', reason: 'Requires baseline road geo-inventory' },
  { label: 'Missing Zebra Crossing', reason: 'Requires spatial road markings map' },
  { label: 'Missing Traffic Signboard', reason: 'Requires reference sign inventory' }
];

export const STATUS_CONFIG: Record<IncidentStatus, { label: string; color: string; bg: string; text: string }> = {
  'Detected': {
    label: 'Detected',
    color: '#be1c1c',
    bg: '#F1F5F9',
    text: '#d12e2e'
  },
  'Verified': {
    label: 'Verified',
    color: '#2563EB',
    bg: '#EFF6FF',
    text: '#1D4ED8'
  },
  'Assigned': {
    label: 'Assigned',
    color: '#32e612',
    bg: '#FFFBEB',
    text: '#1bd511'
  },
  'Action Taken': {
    label: 'Action Taken',
    color: '#7C3AED',
    bg: '#FAF5FF',
    text: '#6D28D9'
  },
  'Resolved': {
    label: 'Resolved',
    color: '#059669',
    bg: '#ECFDF5',
    text: '#047857'
  }
};
