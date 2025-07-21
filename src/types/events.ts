export interface SecurityEvent {
  id: string;
  eventDate: string;
  priority: 'Red' | 'Amber' | 'Blue';
  eventType: string;
  deviceName: string;
  location: string;
  building: string;
  floor: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  description: string;
  coordinates?: { x: number; y: number }; // For floor map view
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  mapImage: string;
  devices: Device[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  coordinates: { x: number; y: number };
  status: 'online' | 'offline' | 'maintenance';
}

export interface EventFilter {
  priority?: ('Red' | 'Amber' | 'Blue')[];
  timeRange?: 'today' | 'yesterday' | 'week' | 'month' | 'custom';
  customDateRange?: { start: string; end: string };
  building?: string;
  floor?: string;
  acknowledged?: boolean;
  eventType?: string[];
  deviceType?: string[];
}