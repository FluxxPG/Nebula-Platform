export interface Identity {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  employeeid: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  avatar?: string;
  joinDate: string;
  lastLogin?: string;
  accessLevel: 'basic' | 'standard' | 'admin' | 'super_admin';
  cards: AccessCard[];
  permissions: Permission[];
  location: string;
  manager?: string;
}

export interface AccessCard {
  id: string;
  cardNumber: string;
  cardType: 'physical' | 'virtual' | 'mobile';
  status: 'active' | 'inactive' | 'lost' | 'expired';
  issuedDate: string;
  expiryDate: string;
  accessZones: string[];
  lastUsed?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'read' | 'write' | 'admin';
  grantedDate: string;
  expiryDate?: string;
}

export interface AccessLog {
  id: string;
  identityId: string;
  cardId: string;
  location: string;
  action: 'entry' | 'exit' | 'denied';
  timestamp: string;
  reason?: string;
}