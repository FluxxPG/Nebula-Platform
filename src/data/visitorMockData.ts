import { Identity } from '../types/identity';
import { Visit, AccessZone } from '../types/visitor';
import { mockIdentities } from './mockData';

// Generate mock visits
export const mockVisits: Visit[] = [
  {
    id: 'V001',
    startDate: '2024-05-15T09:00:00Z',
    endDate: '2024-05-15T17:00:00Z',
    host: 'Sarah Johnson',
    hostId: '1',
    escort: 'Michael Rodriguez',
    escortId: '2',
    description: 'Quarterly business review meeting',
    visitor: 'John Smith',
    visitorId: 'VIS-001',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-10T14:30:00Z',
    updatedAt: '2024-05-10T14:30:00Z'
  },
  {
    id: 'V002',
    startDate: '2024-05-16T10:30:00Z',
    endDate: '2024-05-16T12:30:00Z',
    host: 'Emily Chen',
    hostId: '3',
    description: 'Interview for Marketing Specialist position',
    visitor: 'Jessica Williams',
    visitorId: 'VIS-002',
    type: 'Interview',
    status: 'scheduled',
    createdAt: '2024-05-11T09:15:00Z',
    updatedAt: '2024-05-11T09:15:00Z'
  },
  {
    id: 'V003',
    startDate: '2024-05-14T13:00:00Z',
    endDate: '2024-05-14T15:00:00Z',
    host: 'Michael Rodriguez',
    hostId: '2',
    escort: 'Lisa Thompson',
    escortId: '5',
    description: 'Security system maintenance',
    visitor: 'Robert Johnson',
    visitorId: 'VIS-003',
    type: 'Vendor',
    status: 'checked-in',
    cardNumber: 'V-1234',
    idProofType: 'Company ID',
    idProofNumber: 'TechSec-5678',
    photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==',
    accessZones: ['Building A - Main Entrance', 'Building A - Server Room'],
    createdAt: '2024-05-13T10:45:00Z',
    updatedAt: '2024-05-14T13:05:00Z'
  },
  {
    id: 'V004',
    startDate: '2024-05-13T09:30:00Z',
    endDate: '2024-05-13T11:30:00Z',
    host: 'David Chen',
    hostId: '6',
    description: 'Code review session',
    visitor: 'Alex Turner',
    visitorId: 'VIS-004',
    type: 'Business',
    status: 'checked-out',
    cardNumber: 'V-5678',
    idProofType: 'Driving License',
    idProofNumber: 'DL-987654',
    photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==',
    accessZones: ['Building B - Engineering Floor'],
    createdAt: '2024-05-12T16:20:00Z',
    updatedAt: '2024-05-13T11:35:00Z'
  },
  {
    id: 'V005',
    startDate: '2024-05-17T14:00:00Z',
    endDate: '2024-05-17T16:00:00Z',
    host: 'Lisa Thompson',
    hostId: '5',
    description: 'Executive board meeting',
    visitor: 'Richard Miller',
    visitorId: 'VIS-005',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-12T11:30:00Z',
    updatedAt: '2024-05-12T11:30:00Z'
  },
  {
    id: 'V006',
    startDate: '2024-05-15T11:00:00Z',
    endDate: '2024-05-15T12:30:00Z',
    host: 'Amanda Davis',
    hostId: '7',
    description: 'Financial audit discussion',
    visitor: 'Patricia White',
    visitorId: 'VIS-006',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-13T09:45:00Z',
    updatedAt: '2024-05-13T09:45:00Z'
  },
  {
    id: 'V007',
    startDate: '2024-05-14T10:00:00Z',
    endDate: '2024-05-14T11:00:00Z',
    host: 'Robert Kim',
    hostId: '8',
    description: 'Marketing campaign review',
    visitor: 'Susan Brown',
    visitorId: 'VIS-007',
    type: 'Business',
    status: 'checked-in',
    cardNumber: 'V-9012',
    idProofType: 'Passport',
    idProofNumber: 'P123456789',
    photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==',
    accessZones: ['Building C - Marketing Department'],
    createdAt: '2024-05-13T15:10:00Z',
    updatedAt: '2024-05-14T10:05:00Z'
  },
  {
    id: 'V008',
    startDate: '2024-05-16T15:30:00Z',
    endDate: '2024-05-16T17:00:00Z',
    host: 'Jennifer Lopez',
    hostId: '9',
    description: 'HR policy discussion',
    visitor: 'Thomas Garcia',
    visitorId: 'VIS-008',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-14T08:30:00Z',
    updatedAt: '2024-05-14T08:30:00Z'
  },
  {
    id: 'V009',
    startDate: '2024-05-15T13:30:00Z',
    endDate: '2024-05-15T14:30:00Z',
    host: 'William Brown',
    hostId: '10',
    description: 'IT support for network issues',
    visitor: 'Kevin Wilson',
    visitorId: 'VIS-009',
    type: 'Vendor',
    status: 'scheduled',
    createdAt: '2024-05-14T11:20:00Z',
    updatedAt: '2024-05-14T11:20:00Z'
  },
  {
    id: 'V010',
    startDate: '2024-05-13T14:00:00Z',
    endDate: '2024-05-13T16:00:00Z',
    host: 'Sarah Johnson',
    hostId: '1',
    description: 'Software demo presentation',
    visitor: 'Laura Martinez',
    visitorId: 'VIS-010',
    type: 'Vendor',
    status: 'checked-out',
    cardNumber: 'V-3456',
    idProofType: 'Company ID',
    idProofNumber: 'SoftCo-7890',
    photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==',
    accessZones: ['Building A - Conference Room A'],
    createdAt: '2024-05-12T09:15:00Z',
    updatedAt: '2024-05-13T16:05:00Z'
  },
  {
    id: 'V011',
    startDate: '2024-05-18T10:00:00Z',
    endDate: '2024-05-18T11:30:00Z',
    host: 'David Chen',
    hostId: '6',
    description: 'Product demo for potential client',
    visitor: 'Mark Johnson',
    visitorId: 'VIS-011',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-14T13:45:00Z',
    updatedAt: '2024-05-14T13:45:00Z'
  },
  {
    id: 'V012',
    startDate: '2024-05-19T14:30:00Z',
    endDate: '2024-05-19T16:00:00Z',
    host: 'Emily Chen',
    hostId: '3',
    description: 'Marketing strategy discussion',
    visitor: 'Rachel Green',
    visitorId: 'VIS-012',
    type: 'Business',
    status: 'scheduled',
    createdAt: '2024-05-14T15:20:00Z',
    updatedAt: '2024-05-14T15:20:00Z'
  }
];

// Generate mock access zones
export const mockAccessZones: AccessZone[] = [
  {
    id: 'AZ001',
    name: 'Main Entrance',
    building: 'Building A',
    floor: 'Ground Floor',
    description: 'Main entrance to Building A',
    requiresEscort: false
  },
  {
    id: 'AZ002',
    name: 'Server Room',
    building: 'Building A',
    floor: '2nd Floor',
    description: 'Server room with restricted access',
    requiresEscort: true
  },
  {
    id: 'AZ003',
    name: 'Conference Room A',
    building: 'Building A',
    floor: '3rd Floor',
    description: 'Large conference room for meetings',
    requiresEscort: false
  },
  {
    id: 'AZ004',
    name: 'Executive Floor',
    building: 'Building A',
    floor: '5th Floor',
    description: 'Executive offices and meeting rooms',
    requiresEscort: true
  },
  {
    id: 'AZ005',
    name: 'Engineering Floor',
    building: 'Building B',
    floor: '2nd Floor',
    description: 'Engineering department workspace',
    requiresEscort: false
  },
  {
    id: 'AZ006',
    name: 'Marketing Department',
    building: 'Building C',
    floor: '1st Floor',
    description: 'Marketing team workspace',
    requiresEscort: false
  },
  {
    id: 'AZ007',
    name: 'HR Department',
    building: 'Building C',
    floor: '2nd Floor',
    description: 'Human Resources department',
    requiresEscort: false
  },
  {
    id: 'AZ008',
    name: 'Data Center',
    building: 'Building B',
    floor: 'Basement',
    description: 'Main data center with critical infrastructure',
    requiresEscort: true
  },
  {
    id: 'AZ009',
    name: 'Research Lab',
    building: 'Building B',
    floor: '3rd Floor',
    description: 'Research and development laboratory',
    requiresEscort: true
  },
  {
    id: 'AZ010',
    name: 'Cafeteria',
    building: 'Building A',
    floor: 'Ground Floor',
    description: 'Main cafeteria for all employees',
    requiresEscort: false
  }
];

// Helper functions
export const getVisitById = (id: string): Visit | undefined => {
  return mockVisits.find(visit => visit.id === id);
};

export const getAccessZoneById = (id: string): AccessZone | undefined => {
  return mockAccessZones.find(zone => zone.id === id);
};

export const getAccessZonesByBuilding = (building: string): AccessZone[] => {
  return mockAccessZones.filter(zone => zone.building === building);
};

export const getHostOptions = () => {
  return mockIdentities.map(identity => ({
    value: identity.id,
    label: `${identity.firstName} ${identity.lastName}`,
  }));
};

export const getEscortOptions = () => {
  return mockIdentities
    .filter(identity => identity.accessLevel === 'admin' || identity.accessLevel === 'super_admin')
    .map(identity => ({
      value: identity.id,
      label: `${identity.firstName} ${identity.lastName}`,
    }));
};

export const getVisitTypeOptions = () => {
  return [
    { value: 'Business', label: 'Business' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Contractor', label: 'Contractor' },
    { value: 'Other', label: 'Other' }
  ];
};

export const getIdProofTypeOptions = () => {
  return [
    { value: 'Passport', label: 'Passport' },
    { value: 'Driving License', label: 'Driving License' },
    { value: 'National ID', label: 'National ID' },
    { value: 'Company ID', label: 'Company ID' },
    { value: 'Other', label: 'Other' }
  ];
};

export const getAccessZoneOptions = () => {
  return mockAccessZones.map(zone => ({
    value: zone.id,
    label: `${zone.building} - ${zone.name}`,
    requiresEscort: zone.requiresEscort
  }));
};

// Function to check in a visitor
export const checkInVisitor = (
  visitId: string, 
  cardNumber: string, 
  idProofType: string, 
  idProofNumber: string, 
  photo: string,
  accessZones: string[]
): Visit | null => {
  const visitIndex = mockVisits.findIndex(visit => visit.id === visitId);
  
  if (visitIndex === -1) {
    return null;
  }
  
  const updatedVisit: Visit = {
    ...mockVisits[visitIndex],
    status: 'checked-in',
    cardNumber,
    idProofType: idProofType as any,
    idProofNumber,
    photo,
    accessZones,
    updatedAt: new Date().toISOString()
  };
  
  mockVisits[visitIndex] = updatedVisit;
  return updatedVisit;
};

// Function to filter visits
export interface VisitFilter {
  status?: string[];
  type?: string[];
  startDateFrom?: string;
  startDateTo?: string;
  host?: string;
  visitor?: string;
}

export const filterVisits = (filters: VisitFilter): Visit[] => {
  return mockVisits.filter(visit => {
    // Filter by status
    if (filters.status && filters.status.length > 0 && !filters.status.includes(visit.status)) {
      return false;
    }
    
    // Filter by type
    if (filters.type && filters.type.length > 0 && !filters.type.includes(visit.type)) {
      return false;
    }
    
    // Filter by start date range
    if (filters.startDateFrom) {
      const startDateFrom = new Date(filters.startDateFrom);
      const visitStartDate = new Date(visit.startDate);
      if (visitStartDate < startDateFrom) {
        return false;
      }
    }
    
    if (filters.startDateTo) {
      const startDateTo = new Date(filters.startDateTo);
      const visitStartDate = new Date(visit.startDate);
      if (visitStartDate > startDateTo) {
        return false;
      }
    }
    
    // Filter by host
    if (filters.host && !visit.host.toLowerCase().includes(filters.host.toLowerCase())) {
      return false;
    }
    
    // Filter by visitor
    if (filters.visitor && !visit.visitor.toLowerCase().includes(filters.visitor.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};