export interface Visit {
  id: string;
  startDate: string;
  endDate: string;
  host: string;
  hostId: string;
  escort?: string;
  escortId?: string;
  description: string;
  visitor: string;
  visitorId: string;
  type: 'Business' | 'Interview' | 'Personal' | 'Vendor' | 'Contractor' | 'Other';
  status: 'scheduled' | 'checked-in' | 'checked-out' | 'cancelled';
  cardNumber?: string;
  idProofType?: 'Passport' | 'Driving License' | 'National ID' | 'Company ID' | 'Other';
  idProofNumber?: string;
  photo?: string;
  accessZones?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VisitFilter {
  status?: string[];
  type?: string[];
  startDateFrom?: string;
  startDateTo?: string;
  host?: string;
  visitor?: string;
}

export interface AccessZone {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  requiresEscort: boolean;
}