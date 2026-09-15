export type EventType =
  | 'pothole'
  | 'waterlogging'
  | 'traffic_congestion'
  | 'unsafe_pedestrian'
  | 'traffic_sign_issue'
  | 'hit_and_run';

export type IncidentStatus =
  | 'Detected'
  | 'Verified'
  | 'Assigned'
  | 'Action Taken'
  | 'Resolved';

export interface Incident {
  id: number;
  bus_id: string;
  event_type: EventType;
  confidence: number;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  plate_number: string | null;
  timestamp: string;
}

export interface Bus {
  bus_id: string;
  route_name: string;
  bus_status: 'Active' | 'Inactive';
  created_at: string;
}

export interface FilterState {
  eventTypes: EventType[];
  dateFrom: string;
  dateTo: string;
  minConfidence: number;
  statuses: IncidentStatus[];
}