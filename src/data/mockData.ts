import { Identity, AccessCard, Permission } from '../types/identity';

export const mockIdentities: Identity[] = [
  {
    id: '1',
    firstname: 'Sarah',
    lastname: 'Johnson',
    email: 'sarah.johnson@nebula.com',
    phone: '+1 (555) 123-4567',
    company: 'Engineering',
    position: 'Senior Software Engineer',
    employeeid: 'ENG-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-03-15',
    lastLogin: '2024-01-15T09:30:00Z',
    accessLevel: 'admin',
    location: 'San Francisco, CA',
    manager: 'David Chen',
    cards: [
      {
        id: 'card-1',
        cardNumber: '1234-5678-9012',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-03-15',
        expiryDate: '2025-03-15',
        accessZones: ['Building A', 'Engineering Floor', 'Server Room'],
        lastUsed: '2024-01-15T08:45:00Z',
      },
      {
        id: 'card-2',
        cardNumber: 'MOBILE-001',
        cardType: 'mobile',
        status: 'active',
        issuedDate: '2023-06-01',
        expiryDate: '2025-06-01',
        accessZones: ['Building A', 'Engineering Floor'],
        lastUsed: '2024-01-14T17:30:00Z',
      },
      {
        id: 'card-3',
        cardNumber: 'VIRTUAL-001',
        cardType: 'virtual',
        status: 'active',
        issuedDate: '2023-09-15',
        expiryDate: '2025-09-15',
        accessZones: ['Building A', 'Engineering Floor', 'Conference Rooms'],
        lastUsed: '2024-01-13T14:20:00Z',
      },
    ],
    permissions: [
      {
        id: 'perm-1',
        name: 'System Administration',
        description: 'Full system administration access',
        category: 'System',
        level: 'admin',
        grantedDate: '2022-03-15',
      },
      {
        id: 'perm-2',
        name: 'Code Repository',
        description: 'Read/write access to code repositories',
        category: 'Development',
        level: 'write',
        grantedDate: '2022-03-15',
      },
    ],
  },
  {
    id: '2',
    firstname: 'Michael',
    lastname: 'Rodriguez',
    email: 'michael.rodriguez@nebula.com',
    phone: '+1 (555) 234-5678',
    company: 'Security',
    position: 'Security Manager',
    employeeid: 'SEC-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2021-08-10',
    lastLogin: '2024-01-15T07:15:00Z',
    accessLevel: 'super_admin',
    location: 'San Francisco, CA',
    manager: 'Lisa Thompson',
    cards: [
      {
        id: 'card-3',
        cardNumber: '2345-6789-0123',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2021-08-10',
        expiryDate: '2025-08-10',
        accessZones: ['All Areas', 'Security Office', 'Server Room', 'Executive Floor'],
        lastUsed: '2024-01-15T07:00:00Z',
      },
      {
        id: 'card-4',
        cardNumber: 'MOBILE-002',
        cardType: 'mobile',
        status: 'active',
        issuedDate: '2022-01-15',
        expiryDate: '2025-01-15',
        accessZones: ['All Areas', 'Security Office'],
        lastUsed: '2024-01-14T18:30:00Z',
      },
    ],
    permissions: [
      {
        id: 'perm-3',
        name: 'Security Management',
        description: 'Full security system management',
        category: 'Security',
        level: 'admin',
        grantedDate: '2021-08-10',
      },
      {
        id: 'perm-4',
        name: 'Access Control',
        description: 'Manage user access and permissions',
        category: 'Security',
        level: 'admin',
        grantedDate: '2021-08-10',
      },
    ],
  },
  {
    id: '3',
    firstname: 'Emily',
    lastname: 'Chen',
    email: 'emily.chen@nebula.com',
    phone: '+1 (555) 345-6789',
    company: 'Marketing',
    position: 'Marketing Coordinator',
    employeeid: 'MKT-003',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-01-20',
    lastLogin: '2024-01-14T16:45:00Z',
    accessLevel: 'standard',
    location: 'New York, NY',
    manager: 'Robert Kim',
    cards: [
      {
        id: 'card-4',
        cardNumber: '3456-7890-1234',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2023-01-20',
        expiryDate: '2025-01-20',
        accessZones: ['Building B', 'Marketing Floor', 'Conference Rooms'],
        lastUsed: '2024-01-14T16:30:00Z',
      },
      {
        id: 'card-5',
        cardNumber: 'VIRTUAL-002',
        cardType: 'virtual',
        status: 'active',
        issuedDate: '2023-05-10',
        expiryDate: '2025-05-10',
        accessZones: ['Building B', 'Marketing Floor', 'Digital Assets'],
        lastUsed: '2024-01-13T11:45:00Z',
      },
    ],
    permissions: [
      {
        id: 'perm-5',
        name: 'Marketing Tools',
        description: 'Access to marketing software and tools',
        category: 'Marketing',
        level: 'write',
        grantedDate: '2023-01-20',
      },
    ],
  },
  {
    id: '4',
    firstname: 'James',
    lastname: 'Wilson',
    email: 'james.wilson@nebula.com',
    phone: '+1 (555) 456-7890',
    company: 'Finance',
    position: 'Financial Analyst',
    employeeid: 'FIN-002',
    status: 'pending',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2024-01-10',
    accessLevel: 'basic',
    location: 'Chicago, IL',
    manager: 'Amanda Davis',
    cards: [],
    permissions: [],
  },
  {
    id: '5',
    firstname: 'Lisa',
    lastname: 'Thompson',
    email: 'lisa.thompson@nebula.com',
    phone: '+1 (555) 567-8901',
    company: 'Executive',
    position: 'Chief Security Officer',
    employeeid: 'EXE-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2020-05-01',
    lastLogin: '2024-01-15T10:00:00Z',
    accessLevel: 'super_admin',
    location: 'San Francisco, CA',
    cards: [
      {
        id: 'card-5',
        cardNumber: '4567-8901-2345',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2020-05-01',
        expiryDate: '2025-05-01',
        accessZones: ['All Areas', 'Executive Floor', 'Board Room'],
        lastUsed: '2024-01-15T09:45:00Z',
      },
      {
        id: 'card-6',
        cardNumber: 'MOBILE-003',
        cardType: 'mobile',
        status: 'active',
        issuedDate: '2021-03-15',
        expiryDate: '2025-03-15',
        accessZones: ['All Areas', 'Executive Floor'],
        lastUsed: '2024-01-14T19:20:00Z',
      },
      {
        id: 'card-7',
        cardNumber: 'VIRTUAL-003',
        cardType: 'virtual',
        status: 'active',
        issuedDate: '2022-07-01',
        expiryDate: '2025-07-01',
        accessZones: ['All Areas', 'Executive Floor', 'Digital Assets'],
        lastUsed: '2024-01-13T15:30:00Z',
      },
    ],
    permissions: [
      {
        id: 'perm-6',
        name: 'Executive Access',
        description: 'Full executive level access',
        category: 'Executive',
        level: 'admin',
        grantedDate: '2020-05-01',
      },
    ],
  },
  {
    id: '6',
    firstname: 'David',
    lastname: 'Chen',
    email: 'david.chen@nebula.com',
    phone: '+1 (555) 678-9012',
    company: 'Engineering',
    position: 'Engineering Director',
    employeeid: 'ENG-002',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2021-02-15',
    lastLogin: '2024-01-14T11:30:00Z',
    accessLevel: 'admin',
    location: 'San Francisco, CA',
    cards: [
      {
        id: 'card-8',
        cardNumber: '5678-9012-3456',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2021-02-15',
        expiryDate: '2025-02-15',
        accessZones: ['Building A', 'Engineering Floor', 'Server Room', 'R&D Lab'],
        lastUsed: '2024-01-14T11:15:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-7',
        name: 'Engineering Management',
        description: 'Manage engineering resources and projects',
        category: 'Engineering',
        level: 'admin',
        grantedDate: '2021-02-15',
      }
    ],
  },
  {
    id: '7',
    firstname: 'Amanda',
    lastname: 'Davis',
    email: 'amanda.davis@nebula.com',
    phone: '+1 (555) 789-0123',
    company: 'Finance',
    position: 'Finance Director',
    employeeid: 'FIN-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2020-08-01',
    lastLogin: '2024-01-15T08:45:00Z',
    accessLevel: 'admin',
    location: 'Chicago, IL',
    cards: [
      {
        id: 'card-9',
        cardNumber: '6789-0123-4567',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2020-08-01',
        expiryDate: '2025-08-01',
        accessZones: ['Building C', 'Finance Department', 'Executive Floor'],
        lastUsed: '2024-01-15T08:30:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-8',
        name: 'Financial Systems',
        description: 'Access to financial systems and data',
        category: 'Finance',
        level: 'admin',
        grantedDate: '2020-08-01',
      }
    ],
  },
  {
    id: '8',
    firstname: 'Robert',
    lastname: 'Kim',
    email: 'robert.kim@nebula.com',
    phone: '+1 (555) 890-1234',
    company: 'Marketing',
    position: 'Marketing Director',
    employeeid: 'MKT-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2021-05-10',
    lastLogin: '2024-01-14T14:20:00Z',
    accessLevel: 'admin',
    location: 'New York, NY',
    cards: [
      {
        id: 'card-10',
        cardNumber: '7890-1234-5678',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2021-05-10',
        expiryDate: '2025-05-10',
        accessZones: ['Building B', 'Marketing Floor', 'Creative Studio'],
        lastUsed: '2024-01-14T14:00:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-9',
        name: 'Marketing Systems',
        description: 'Access to marketing platforms and analytics',
        category: 'Marketing',
        level: 'admin',
        grantedDate: '2021-05-10',
      }
    ],
  },
  {
    id: '9',
    firstname: 'Jennifer',
    lastname: 'Lopez',
    email: 'jennifer.lopez@nebula.com',
    phone: '+1 (555) 901-2345',
    company: 'HR',
    position: 'HR Manager',
    employeeid: 'HR-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-01-15',
    lastLogin: '2024-01-15T09:10:00Z',
    accessLevel: 'admin',
    location: 'Miami, FL',
    cards: [
      {
        id: 'card-11',
        cardNumber: '8901-2345-6789',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-01-15',
        expiryDate: '2025-01-15',
        accessZones: ['Building D', 'HR Department', 'Interview Rooms'],
        lastUsed: '2024-01-15T09:00:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-10',
        name: 'HR Systems',
        description: 'Access to HR systems and employee data',
        category: 'HR',
        level: 'admin',
        grantedDate: '2022-01-15',
      }
    ],
  },
  {
    id: '10',
    firstname: 'William',
    lastname: 'Brown',
    email: 'william.brown@nebula.com',
    phone: '+1 (555) 012-3456',
    company: 'IT',
    position: 'IT Support Specialist',
    employeeid: 'IT-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-06-01',
    lastLogin: '2024-01-14T15:30:00Z',
    accessLevel: 'standard',
    location: 'Austin, TX',
    cards: [
      {
        id: 'card-12',
        cardNumber: '9012-3456-7890',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-06-01',
        expiryDate: '2025-06-01',
        accessZones: ['All Buildings', 'Server Rooms', 'IT Department'],
        lastUsed: '2024-01-14T15:15:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-11',
        name: 'IT Support',
        description: 'Access to IT support systems and tickets',
        category: 'IT',
        level: 'write',
        grantedDate: '2022-06-01',
      }
    ],
  },
  {
    id: '11',
    firstname: 'Maria',
    lastname: 'Garcia',
    email: 'maria.garcia@nebula.com',
    phone: '+1 (555) 123-4567',
    company: 'Sales',
    position: 'Sales Representative',
    employeeid: 'SLS-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-09-15',
    lastLogin: '2024-01-15T11:45:00Z',
    accessLevel: 'standard',
    location: 'Los Angeles, CA',
    cards: [
      {
        id: 'card-13',
        cardNumber: '0123-4567-8901',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-09-15',
        expiryDate: '2025-09-15',
        accessZones: ['Building E', 'Sales Floor', 'Meeting Rooms'],
        lastUsed: '2024-01-15T11:30:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-12',
        name: 'Sales Tools',
        description: 'Access to CRM and sales tools',
        category: 'Sales',
        level: 'write',
        grantedDate: '2022-09-15',
      }
    ],
  },
  {
    id: '12',
    firstname: 'John',
    lastname: 'Smith',
    email: 'john.smith@nebula.com',
    phone: '+1 (555) 234-5678',
    company: 'Engineering',
    position: 'Software Engineer',
    employeeid: 'ENG-003',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-03-01',
    lastLogin: '2024-01-14T10:20:00Z',
    accessLevel: 'standard',
    location: 'Seattle, WA',
    cards: [
      {
        id: 'card-14',
        cardNumber: '1234-5678-9012',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2023-03-01',
        expiryDate: '2025-03-01',
        accessZones: ['Building F', 'Engineering Floor', 'Break Room'],
        lastUsed: '2024-01-14T10:00:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-13',
        name: 'Development Tools',
        description: 'Access to development environments and tools',
        category: 'Engineering',
        level: 'write',
        grantedDate: '2023-03-01',
      }
    ],
  },
  {
    id: '13',
    firstname: 'Olivia',
    lastname: 'Johnson',
    email: 'olivia.johnson@nebula.com',
    phone: '+1 (555) 345-6789',
    company: 'Design',
    position: 'UX Designer',
    employeeid: 'DSG-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-05-15',
    lastLogin: '2024-01-15T13:15:00Z',
    accessLevel: 'standard',
    location: 'Portland, OR',
    cards: [
      {
        id: 'card-15',
        cardNumber: '2345-6789-0123',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2023-05-15',
        expiryDate: '2025-05-15',
        accessZones: ['Building G', 'Design Studio', 'Creative Lab'],
        lastUsed: '2024-01-15T13:00:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-14',
        name: 'Design Tools',
        description: 'Access to design software and assets',
        category: 'Design',
        level: 'write',
        grantedDate: '2023-05-15',
      }
    ],
  },
  {
    id: '14',
    firstname: 'Daniel',
    lastname: 'Lee',
    email: 'daniel.lee@nebula.com',
    phone: '+1 (555) 456-7890',
    company: 'Product',
    position: 'Product Manager',
    employeeid: 'PRD-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-11-01',
    lastLogin: '2024-01-14T16:10:00Z',
    accessLevel: 'admin',
    location: 'San Francisco, CA',
    cards: [
      {
        id: 'card-16',
        cardNumber: '3456-7890-1234',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-11-01',
        expiryDate: '2025-11-01',
        accessZones: ['Building A', 'Product Floor', 'Meeting Rooms'],
        lastUsed: '2024-01-14T16:00:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-15',
        name: 'Product Management',
        description: 'Access to product management tools and roadmaps',
        category: 'Product',
        level: 'admin',
        grantedDate: '2022-11-01',
      }
    ],
  },
  {
    id: '15',
    firstname: 'Sophia',
    lastname: 'Martinez',
    email: 'sophia.martinez@nebula.com',
    phone: '+1 (555) 567-8901',
    company: 'Customer Support',
    position: 'Support Manager',
    employeeid: 'SUP-001',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2022-07-15',
    lastLogin: '2024-01-15T08:30:00Z',
    accessLevel: 'admin',
    location: 'Denver, CO',
    cards: [
      {
        id: 'card-17',
        cardNumber: '4567-8901-2345',
        cardType: 'physical',
        status: 'active',
        issuedDate: '2022-07-15',
        expiryDate: '2025-07-15',
        accessZones: ['Building H', 'Support Center', 'Training Room'],
        lastUsed: '2024-01-15T08:15:00Z',
      }
    ],
    permissions: [
      {
        id: 'perm-16',
        name: 'Support Systems',
        description: 'Access to customer support systems and tools',
        category: 'Support',
        level: 'admin',
        grantedDate: '2022-07-15',
      }
    ],
  },
];

// ENHANCED APP LIBRARY DATA STRUCTURE - HIERARCHICAL MODULES
export interface AppModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  apps: App[];
  totalUsers: number;
  lastUpdated: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'beta' | 'maintenance' | 'deprecated';
  users: number;
  lastUpdated: string;
  version: string;
  features: string[];
  moduleId: string;
  isFavorite?: boolean;
}

export const mockAppModules: AppModule[] = [
  {
    id: 'identity-access',
    name: 'Identity & Access',
    description: 'Comprehensive identity management and access control solutions',
    icon: '🔐',
    color: '#6366f1',
    totalUsers: 2450,
    lastUpdated: '2024-01-15',
    apps: [
      {
        id: 'identity-management',
        name: 'Identity Management',
        description: 'Core identity lifecycle management and user provisioning',
        icon: '👤',
        status: 'active',
        users: 1250,
        lastUpdated: '2024-01-15',
        version: '3.2.1',
        features: ['User Provisioning', 'Role Management', 'Identity Lifecycle', 'Self-Service Portal'],
        moduleId: 'identity-access',
        isFavorite: true,
      },
      {
        id: 'access-control',
        name: 'Access Control',
        description: 'Advanced access control policies and enforcement',
        icon: '🚪',
        status: 'active',
        users: 980,
        lastUpdated: '2024-01-14',
        version: '2.8.3',
        features: ['RBAC', 'ABAC', 'Policy Engine', 'Real-time Enforcement'],
        moduleId: 'identity-access',
        isFavorite: false,
      },
      {
        id: 'privileged-access',
        name: 'Privileged Access',
        description: 'Secure privileged account management and monitoring',
        icon: '👑',
        status: 'active',
        users: 220,
        lastUpdated: '2024-01-13',
        version: '1.9.2',
        features: ['PAM', 'Session Recording', 'Just-in-Time Access', 'Vault Management'],
        moduleId: 'identity-access',
        isFavorite: false,
      },
      {
        id: 'identity-governance',
        name: 'Identity Governance',
        description: 'Compliance, certification, and governance workflows',
        icon: '⚖️',
        status: 'beta',
        users: 85,
        lastUpdated: '2024-01-12',
        version: '0.8.1-beta',
        features: ['Access Reviews', 'Compliance Reports', 'Risk Analytics', 'Workflow Engine'],
        moduleId: 'identity-access',
        isFavorite: false,
      },
      {
        id: 'user-groups',
        name: 'User Group Management',
        description: 'Create and manage user groups with specific permissions',
        icon: '👥',
        status: 'active',
        users: 320,
        lastUpdated: '2024-01-16',
        version: '1.5.0',
        features: ['Group Management', 'Permission Assignment', 'Role-based Access', 'Audit Trails'],
        moduleId: 'identity-access',
        isFavorite: false,
      },
    ],
  },
  {
    id: 'visitor-management',
    name: 'Visitor Management',
    description: 'Complete visitor lifecycle and facility access management',
    icon: '🏢',
    color: '#10b981',
    totalUsers: 890,
    lastUpdated: '2024-01-14',
    apps: [
      {
        id: 'visitor-registration',
        name: 'Visitor Registration',
        description: 'Self-service visitor registration and pre-approval',
        icon: '📝',
        status: 'active',
        users: 450,
        lastUpdated: '2024-01-14',
        version: '2.1.4',
        features: ['Self-Registration', 'Pre-approval', 'QR Codes', 'Host Notifications'],
        moduleId: 'visitor-management',
        isFavorite: true,
      },
      {
        id: 'visitor-tracking',
        name: 'Visitor Tracking',
        description: 'Real-time visitor location and movement tracking',
        icon: '📍',
        status: 'active',
        users: 320,
        lastUpdated: '2024-01-13',
        version: '1.7.2',
        features: ['Real-time Tracking', 'Zone Monitoring', 'Alerts', 'Analytics'],
        moduleId: 'visitor-management',
        isFavorite: false,
      },
      {
        id: 'visitor-analytics',
        name: 'Visitor Analytics',
        description: 'Comprehensive visitor insights and reporting',
        icon: '📊',
        status: 'active',
        users: 120,
        lastUpdated: '2024-01-12',
        version: '1.3.1',
        features: ['Visit Analytics', 'Trend Reports', 'Capacity Planning', 'Dashboards'],
        moduleId: 'visitor-management',
        isFavorite: false,
      },
      {
        id: 'visitor-kiosk',
        name: 'Visitor Kiosk',
        description: 'Self-service check-in kiosk for visitors',
        icon: '🖥️',
        status: 'active',
        users: 180,
        lastUpdated: '2024-01-15',
        version: '1.0.0',
        features: ['Self Check-in', 'ID Verification', 'Badge Printing', 'Host Notifications'],
        moduleId: 'visitor-management',
        isFavorite: false,
      },
    ],
  },
  {
    id: 'contractor-management',
    name: 'Contractor Management',
    description: 'Contractor lifecycle, compliance, and access management',
    icon: '🔧',
    color: '#f59e0b',
    totalUsers: 650,
    lastUpdated: '2024-01-13',
    apps: [
      {
        id: 'contractor-onboarding',
        name: 'Contractor Onboarding',
        description: 'Streamlined contractor onboarding and verification',
        icon: '🎯',
        status: 'active',
        users: 280,
        lastUpdated: '2024-01-13',
        version: '2.0.3',
        features: ['Digital Onboarding', 'Document Verification', 'Background Checks', 'Compliance'],
        moduleId: 'contractor-management',
        isFavorite: false,
      },
      {
        id: 'contractor-compliance',
        name: 'Contractor Compliance',
        description: 'Compliance monitoring and certification tracking',
        icon: '✅',
        status: 'active',
        users: 180,
        lastUpdated: '2024-01-12',
        version: '1.8.7',
        features: ['Certification Tracking', 'Compliance Monitoring', 'Audit Trails', 'Renewals'],
        moduleId: 'contractor-management',
        isFavorite: false,
      },
      {
        id: 'contractor-access',
        name: 'Contractor Access',
        description: 'Temporary access provisioning and management',
        icon: '🔑',
        status: 'active',
        users: 190,
        lastUpdated: '2024-01-11',
        version: '1.5.2',
        features: ['Temporary Access', 'Time-based Permissions', 'Project Access', 'Revocation'],
        moduleId: 'contractor-management',
        isFavorite: true,
      },
    ],
  },
  {
    id: 'security-analytics',
    name: 'Security Analytics',
    description: 'Advanced security monitoring, threat detection, and analytics',
    icon: '🛡️',
    color: '#ef4444',
    totalUsers: 420,
    lastUpdated: '2024-01-15',
    apps: [
      {
        id: 'threat-detection',
        name: 'Threat Detection',
        description: 'AI-powered threat detection and anomaly analysis',
        icon: '🎯',
        status: 'active',
        users: 150,
        lastUpdated: '2024-01-15',
        version: '3.1.0',
        features: ['AI Detection', 'Behavioral Analytics', 'Risk Scoring', 'Real-time Alerts'],
        moduleId: 'security-analytics',
        isFavorite: false,
      },
      {
        id: 'security-monitoring',
        name: 'Security Monitoring',
        description: 'Continuous security monitoring and incident response',
        icon: '👁️',
        status: 'active',
        users: 180,
        lastUpdated: '2024-01-14',
        version: '2.7.4',
        features: ['24/7 Monitoring', 'Incident Response', 'SIEM Integration', 'Forensics'],
        moduleId: 'security-analytics',
        isFavorite: false,
      },
      {
        id: 'risk-analytics',
        name: 'Risk Analytics',
        description: 'Comprehensive risk assessment and analytics platform',
        icon: '⚠️',
        status: 'beta',
        users: 90,
        lastUpdated: '2024-01-13',
        version: '1.2.0-beta',
        features: ['Risk Assessment', 'Predictive Analytics', 'Risk Dashboards', 'Compliance Metrics'],
        moduleId: 'security-analytics',
        isFavorite: false,
      },
      {
        id: 'event-wall',
        name: 'Event Wall',
        description: 'Single pane of glass for monitoring security events across systems',
        icon: '🖥️',
        status: 'active',
        users: 210,
        lastUpdated: '2024-01-15',
        version: '2.0.0',
        features: ['Real-time Event Monitoring', 'Multi-system Integration', 'Floor Map View', 'Event Acknowledgement'],
        moduleId: 'security-analytics',
        isFavorite: true,
      },
    ],
  },
  {
    id: 'audit-compliance',
    name: 'Audit & Compliance',
    description: 'Comprehensive audit trails, compliance reporting, and governance',
    icon: '📋',
    color: '#8b5cf6',
    totalUsers: 320,
    lastUpdated: '2024-01-14',
    apps: [
      {
        id: 'audit-trails',
        name: 'Audit Trails',
        description: 'Comprehensive audit logging and trail management',
        icon: '📜',
        status: 'active',
        users: 200,
        lastUpdated: '2024-01-14',
        version: '2.5.1',
        features: ['Comprehensive Logging', 'Tamper-proof Storage', 'Search & Filter', 'Export'],
        moduleId: 'audit-compliance',
        isFavorite: false,
      },
      {
        id: 'compliance-reporting',
        name: 'Compliance Reporting',
        description: 'Automated compliance reporting and certification',
        icon: '📊',
        status: 'active',
        users: 120,
        lastUpdated: '2024-01-13',
        version: '1.9.3',
        features: ['Automated Reports', 'Compliance Templates', 'Certification', 'Scheduling'],
        moduleId: 'audit-compliance',
        isFavorite: false,
      },
       {
        id: 'compliance-policies',
        name: 'Compliance policies',
        description: 'Automated compliance policies and enforcement',
        icon: '⚙️',
        status: 'active',
        users: 120,
        lastUpdated: '2024-01-13',
        version: '1.9.3',
        features: ['Automated compliances', 'rules Templates', 'Enforcement', 'Scheduling'],
        moduleId: 'audit-compliance',
        isFavorite: false,
      }
      

    ],
  },
  {
    id: 'mobile-access',
    name: 'Mobile Access',
    description: 'Mobile applications for access control and management',
    icon: '📱',
    color: '#06b6d4',
    totalUsers: 1200,
    lastUpdated: '2024-01-15',
    apps: [
      {
        id: 'mobile-app',
        name: 'Nebula Mobile',
        description: 'Primary mobile app for access control and notifications',
        icon: '📱',
        status: 'active',
        users: 890,
        lastUpdated: '2024-01-15',
        version: '4.2.1',
        features: ['Mobile Access', 'Push Notifications', 'QR Scanning', 'Offline Mode'],
        moduleId: 'mobile-access',
        isFavorite: true,
      },
      {
        id: 'mobile-admin',
        name: 'Admin Mobile',
        description: 'Administrative mobile app for managers and security',
        icon: '⚙️',
        status: 'active',
        users: 210,
        lastUpdated: '2024-01-14',
        version: '2.8.0',
        features: ['Admin Controls', 'Emergency Access', 'Real-time Monitoring', 'Approvals'],
        moduleId: 'mobile-access',
        isFavorite: false,
      },
      {
        id: 'mobile-visitor',
        name: 'Visitor Mobile',
        description: 'Dedicated visitor mobile experience',
        icon: '🚶',
        status: 'beta',
        users: 100,
        lastUpdated: '2024-01-12',
        version: '1.0.0-beta',
        features: ['Visitor Check-in', 'Digital Badges', 'Navigation', 'Host Communication'],
        moduleId: 'mobile-access',
        isFavorite: false,
      },
    ],
  },
  {
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'Low-code form and page designer with drag-and-drop widgets',
    icon: '🎨',
    color: '#ec4899',
    totalUsers: 150,
    lastUpdated: '2024-01-15',
    apps: [
      {
        id: 'form-designer',
        name: 'Form Designer',
        description: 'Drag-and-drop form builder with validation and data binding',
        icon: '📝',
        status: 'active',
        users: 85,
        lastUpdated: '2024-01-15',
        version: '1.0.0',
        features: ['Drag & Drop', 'Field Validation', 'Data Binding', 'Preview Mode'],
        moduleId: 'ui-designer',
        isFavorite: false,
      },
      {
        id: 'model-manager',
        name: 'Model Manager',
        description: 'JSON model creation and management for data binding',
        icon: '🗂️',
        status: 'active',
        users: 65,
        lastUpdated: '2024-01-15',
        version: '1.0.0',
        features: ['JSON Schema', 'Model Import/Export', 'Version Control', 'Field Mapping'],
        moduleId: 'ui-designer',
        isFavorite: false,
      },
    ],
  },
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'Quick access to your most frequently used applications',
    icon: '⭐',
    color: '#f59e0b',
    totalUsers: 0, // This is a virtual module, so no direct users
    lastUpdated: '2024-01-15',
    apps: [], // This will be populated dynamically
  },
];

// Helper function to get all apps across modules
export const getAllApps = (): App[] => {
  return mockAppModules.flatMap(module => module.apps);
};

// Get all favorite apps
export const getFavoriteApps = (): App[] => {
  return getAllApps().filter(app => app.isFavorite);
};

// Helper function to search apps
export const searchApps = (query: string): App[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllApps().filter(app =>
    app.name.toLowerCase().includes(lowercaseQuery) ||
    app.description.toLowerCase().includes(lowercaseQuery) ||
    app.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
};

// Toggle favorite status for an app
export const toggleFavoriteApp = (appId: string): void => {
  mockAppModules.forEach(module => {
    module.apps.forEach(app => {
      if (app.id === appId) {
        app.isFavorite = !app.isFavorite;
      }
    });
  });

  // Update the favorites module with current favorites
  const favoritesModule = mockAppModules.find(module => module.id === 'favorites');
  if (favoritesModule) {
    favoritesModule.apps = getFavoriteApps();
  }
};

// Helper function to get apps by module
export const getAppsByModule = (moduleId: string): App[] => {
  if (moduleId === 'favorites') {
    return getFavoriteApps();
  }
  const module = mockAppModules.find(m => m.id === moduleId);
  return module ? module.apps : [];
};

// Event Wall Data Types and Mock Data
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

// Mock Security Events
export const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'EVT-001',
    eventDate: '2024-01-15T08:30:00Z',
    priority: 'Red',
    eventType: 'Unauthorized Access Attempt',
    deviceName: 'Door Sensor A1',
    location: 'Main Entrance',
    building: 'Building A',
    floor: 'Ground Floor',
    acknowledged: false,
    description: 'Multiple failed access attempts with invalid credentials',
    coordinates: { x: 150, y: 120 }
  },
  {
    id: 'EVT-002',
    eventDate: '2024-01-15T09:15:00Z',
    priority: 'Amber',
    eventType: 'Door Held Open',
    deviceName: 'Door Sensor B3',
    location: 'Server Room',
    building: 'Building B',
    floor: '3rd Floor',
    acknowledged: false,
    description: 'Door held open for more than 60 seconds',
    coordinates: { x: 320, y: 210 }
  },
  {
    id: 'EVT-003',
    eventDate: '2024-01-15T10:05:00Z',
    priority: 'Blue',
    eventType: 'System Reboot',
    deviceName: 'Access Controller C2',
    location: 'IT Department',
    building: 'Building C',
    floor: '2nd Floor',
    acknowledged: true,
    acknowledgedBy: 'Michael Rodriguez',
    acknowledgedAt: '2024-01-15T10:10:00Z',
    description: 'Scheduled system reboot completed successfully',
    coordinates: { x: 280, y: 180 }
  },
  {
    id: 'EVT-004',
    eventDate: '2024-01-15T11:30:00Z',
    priority: 'Red',
    eventType: 'Fire Alarm Triggered',
    deviceName: 'Fire Sensor A2',
    location: 'Kitchen Area',
    building: 'Building A',
    floor: '2nd Floor',
    acknowledged: false,
    description: 'Fire alarm triggered in kitchen area',
    coordinates: { x: 200, y: 150 }
  },
  {
    id: 'EVT-005',
    eventDate: '2024-01-15T12:45:00Z',
    priority: 'Amber',
    eventType: 'Tailgating Detected',
    deviceName: 'Camera B1',
    location: 'South Entrance',
    building: 'Building B',
    floor: '1st Floor',
    acknowledged: false,
    description: 'Possible tailgating incident detected at south entrance',
    coordinates: { x: 180, y: 220 }
  },
  {
    id: 'EVT-006',
    eventDate: '2024-01-15T13:20:00Z',
    priority: 'Blue',
    eventType: 'Scheduled Maintenance',
    deviceName: 'Access Controller A3',
    location: 'HR Department',
    building: 'Building A',
    floor: '3rd Floor',
    acknowledged: true,
    acknowledgedBy: 'Sarah Johnson',
    acknowledgedAt: '2024-01-15T13:25:00Z',
    description: 'Scheduled maintenance started on access controller',
    coordinates: { x: 240, y: 160 }
  },
  {
    id: 'EVT-007',
    eventDate: '2024-01-15T14:10:00Z',
    priority: 'Red',
    eventType: 'Forced Door',
    deviceName: 'Door Sensor C1',
    location: 'Executive Office',
    building: 'Building C',
    floor: '1st Floor',
    acknowledged: false,
    description: 'Door forced open without valid access',
    coordinates: { x: 300, y: 130 }
  },
  {
    id: 'EVT-008',
    eventDate: '2024-01-15T15:05:00Z',
    priority: 'Amber',
    eventType: 'Badge Not Recognized',
    deviceName: 'Card Reader B2',
    location: 'Finance Department',
    building: 'Building B',
    floor: '2nd Floor',
    acknowledged: false,
    description: 'Multiple attempts with unrecognized badge',
    coordinates: { x: 260, y: 190 }
  },
  {
    id: 'EVT-009',
    eventDate: '2024-01-15T16:30:00Z',
    priority: 'Blue',
    eventType: 'Low Battery',
    deviceName: 'Wireless Lock A4',
    location: 'Conference Room',
    building: 'Building A',
    floor: '4th Floor',
    acknowledged: true,
    acknowledgedBy: 'Michael Rodriguez',
    acknowledgedAt: '2024-01-15T16:45:00Z',
    description: 'Battery level below 20% on wireless lock',
    coordinates: { x: 220, y: 170 }
  },
  {
    id: 'EVT-010',
    eventDate: '2024-01-15T17:15:00Z',
    priority: 'Red',
    eventType: 'Perimeter Breach',
    deviceName: 'Fence Sensor D1',
    location: 'North Perimeter',
    building: 'External',
    floor: 'Ground Level',
    acknowledged: false,
    description: 'Perimeter fence breach detected on north side',
    coordinates: { x: 350, y: 100 }
  },
  {
    id: 'EVT-011',
    eventDate: '2024-01-15T18:20:00Z',
    priority: 'Amber',
    eventType: 'After Hours Access',
    deviceName: 'Door Sensor B4',
    location: 'R&D Lab',
    building: 'Building B',
    floor: '4th Floor',
    acknowledged: false,
    description: 'Access granted outside normal business hours',
    coordinates: { x: 290, y: 200 }
  },
  {
    id: 'EVT-012',
    eventDate: '2024-01-15T19:05:00Z',
    priority: 'Blue',
    eventType: 'Camera Offline',
    deviceName: 'Camera C3',
    location: 'Parking Garage',
    building: 'Building C',
    floor: '3rd Floor',
    acknowledged: true,
    acknowledgedBy: 'Lisa Thompson',
    acknowledgedAt: '2024-01-15T19:15:00Z',
    description: 'Camera went offline, network issue suspected',
    coordinates: { x: 270, y: 140 }
  },
  {
    id: 'EVT-013',
    eventDate: '2024-01-15T20:30:00Z',
    priority: 'Red',
    eventType: 'Duress Code Used',
    deviceName: 'Keypad A2',
    location: 'Vault Room',
    building: 'Building A',
    floor: '2nd Floor',
    acknowledged: false,
    description: 'Duress code entered at vault room keypad',
    coordinates: { x: 230, y: 160 }
  },
  {
    id: 'EVT-014',
    eventDate: '2024-01-15T21:15:00Z',
    priority: 'Amber',
    eventType: 'Multiple Failed Attempts',
    deviceName: 'Card Reader C4',
    location: 'Data Center',
    building: 'Building C',
    floor: '4th Floor',
    acknowledged: false,
    description: 'Five consecutive failed access attempts',
    coordinates: { x: 310, y: 180 }
  },
  {
    id: 'EVT-015',
    eventDate: '2024-01-15T22:00:00Z',
    priority: 'Blue',
    eventType: 'Power Fluctuation',
    deviceName: 'Power Monitor B1',
    location: 'Electrical Room',
    building: 'Building B',
    floor: '1st Floor',
    acknowledged: true,
    acknowledgedBy: 'Michael Rodriguez',
    acknowledgedAt: '2024-01-15T22:10:00Z',
    description: 'Brief power fluctuation detected, backup systems engaged',
    coordinates: { x: 250, y: 130 }
  }
];

// Mock Buildings and Floors for Floor Map View
export const mockBuildings: Building[] = [
  {
    id: 'building-a',
    name: 'Building A',
    floors: [
      {
        id: 'a-ground',
        name: 'Ground Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-a-g-1',
            name: 'Door Sensor A1',
            type: 'door-sensor',
            coordinates: { x: 150, y: 120 },
            status: 'online'
          },
          {
            id: 'dev-a-g-2',
            name: 'Camera A1',
            type: 'camera',
            coordinates: { x: 180, y: 150 },
            status: 'online'
          }
        ]
      },
      {
        id: 'a-2nd',
        name: '2nd Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-a-2-1',
            name: 'Fire Sensor A2',
            type: 'fire-sensor',
            coordinates: { x: 200, y: 150 },
            status: 'online'
          },
          {
            id: 'dev-a-2-2',
            name: 'Keypad A2',
            type: 'keypad',
            coordinates: { x: 230, y: 160 },
            status: 'online'
          }
        ]
      }
    ]
  },
  {
    id: 'building-b',
    name: 'Building B',
    floors: [
      {
        id: 'b-1st',
        name: '1st Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-b-1-1',
            name: 'Camera B1',
            type: 'camera',
            coordinates: { x: 180, y: 220 },
            status: 'online'
          },
          {
            id: 'dev-b-1-2',
            name: 'Power Monitor B1',
            type: 'power-monitor',
            coordinates: { x: 250, y: 130 },
            status: 'online'
          }
        ]
      },
      {
        id: 'b-2nd',
        name: '2nd Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-b-2-1',
            name: 'Card Reader B2',
            type: 'card-reader',
            coordinates: { x: 260, y: 190 },
            status: 'online'
          }
        ]
      }
    ]
  },
  {
    id: 'building-c',
    name: 'Building C',
    floors: [
      {
        id: 'c-1st',
        name: '1st Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-c-1-1',
            name: 'Door Sensor C1',
            type: 'door-sensor',
            coordinates: { x: 300, y: 130 },
            status: 'online'
          }
        ]
      },
      {
        id: 'c-2nd',
        name: '2nd Floor',
        mapImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        devices: [
          {
            id: 'dev-c-2-1',
            name: 'Access Controller C2',
            type: 'access-controller',
            coordinates: { x: 280, y: 180 },
            status: 'online'
          }
        ]
      }
    ]
  }
];
