import { DataSource, Report, Dashboard, CalculatedColumn, SQLQuery } from '../types/reporting';

// Mock Data Sources
export const mockDataSources: DataSource[] = [
  {
    id: 'ds-001',
    name: 'Persons',
    description: 'Identity management data source containing all person records',
    type: 'table',
    schema: {
      columns: [
        { id: 'id', name: 'id', displayName: 'ID', type: 'string', isNumeric: false, isDate: false, isBoolean: false, isPrimaryKey: true },
        { id: 'firstName', name: 'first_name', displayName: 'First Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'lastName', name: 'last_name', displayName: 'Last Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'email', name: 'email', displayName: 'Email', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'department', name: 'department', displayName: 'Department', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'position', name: 'position', displayName: 'Position', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'status', name: 'status', displayName: 'Status', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'joinDate', name: 'join_date', displayName: 'Join Date', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'lastLogin', name: 'last_login', displayName: 'Last Login', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'accessLevel', name: 'access_level', displayName: 'Access Level', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'location', name: 'location', displayName: 'Location', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
      ],
      rows: [
        ['1', 'Sarah', 'Johnson', 'sarah.johnson@nebula.com', 'Engineering', 'Senior Software Engineer', 'active', '2022-03-15', '2024-01-15T09:30:00Z', 'admin', 'San Francisco, CA'],
        ['2', 'Michael', 'Rodriguez', 'michael.rodriguez@nebula.com', 'Security', 'Security Manager', 'active', '2021-08-10', '2024-01-15T07:15:00Z', 'super_admin', 'San Francisco, CA'],
        ['3', 'Emily', 'Chen', 'emily.chen@nebula.com', 'Marketing', 'Marketing Coordinator', 'active', '2023-01-20', '2024-01-14T16:45:00Z', 'standard', 'New York, NY'],
        ['4', 'James', 'Wilson', 'james.wilson@nebula.com', 'Finance', 'Financial Analyst', 'pending', '2024-01-10', null, 'basic', 'Chicago, IL'],
        ['5', 'Lisa', 'Thompson', 'lisa.thompson@nebula.com', 'Executive', 'Chief Security Officer', 'active', '2020-05-01', '2024-01-15T10:00:00Z', 'super_admin', 'San Francisco, CA'],
        ['6', 'David', 'Chen', 'david.chen@nebula.com', 'Engineering', 'Engineering Director', 'active', '2021-02-15', '2024-01-14T11:30:00Z', 'admin', 'San Francisco, CA'],
        ['7', 'Amanda', 'Davis', 'amanda.davis@nebula.com', 'Finance', 'Finance Director', 'active', '2020-08-01', '2024-01-15T08:45:00Z', 'admin', 'Chicago, IL'],
        ['8', 'Robert', 'Kim', 'robert.kim@nebula.com', 'Marketing', 'Marketing Director', 'active', '2021-05-10', '2024-01-14T14:20:00Z', 'admin', 'New York, NY'],
        ['9', 'Jennifer', 'Lopez', 'jennifer.lopez@nebula.com', 'HR', 'HR Manager', 'active', '2022-01-15', '2024-01-15T09:10:00Z', 'admin', 'Miami, FL'],
        ['10', 'William', 'Brown', 'william.brown@nebula.com', 'IT', 'IT Support Specialist', 'active', '2022-06-01', '2024-01-14T15:30:00Z', 'standard', 'Austin, TX'],
        ['11', 'Maria', 'Garcia', 'maria.garcia@nebula.com', 'Sales', 'Sales Representative', 'active', '2022-09-15', '2024-01-15T11:45:00Z', 'standard', 'Los Angeles, CA'],
        ['12', 'John', 'Smith', 'john.smith@nebula.com', 'Engineering', 'Software Engineer', 'active', '2023-03-01', '2024-01-14T10:20:00Z', 'standard', 'Seattle, WA'],
        ['13', 'Olivia', 'Johnson', 'olivia.johnson@nebula.com', 'Design', 'UX Designer', 'active', '2023-05-15', '2024-01-15T13:15:00Z', 'standard', 'Portland, OR'],
        ['14', 'Daniel', 'Lee', 'daniel.lee@nebula.com', 'Product', 'Product Manager', 'active', '2022-11-01', '2024-01-14T16:10:00Z', 'admin', 'San Francisco, CA'],
        ['15', 'Sophia', 'Martinez', 'sophia.martinez@nebula.com', 'Customer Support', 'Support Manager', 'active', '2022-07-15', '2024-01-15T08:30:00Z', 'admin', 'Denver, CO'],
        ['16', 'Ethan', 'Taylor', 'ethan.taylor@nebula.com', 'Engineering', 'QA Engineer', 'inactive', '2021-10-01', '2023-12-01T14:45:00Z', 'standard', 'Boston, MA'],
        ['17', 'Ava', 'Anderson', 'ava.anderson@nebula.com', 'Marketing', 'Content Strategist', 'active', '2023-02-15', '2024-01-14T11:20:00Z', 'standard', 'Chicago, IL'],
        ['18', 'Noah', 'Thomas', 'noah.thomas@nebula.com', 'Sales', 'Sales Manager', 'active', '2021-12-01', '2024-01-15T10:45:00Z', 'admin', 'Dallas, TX'],
        ['19', 'Emma', 'Jackson', 'emma.jackson@nebula.com', 'HR', 'Recruiter', 'active', '2022-08-15', '2024-01-14T09:30:00Z', 'standard', 'Atlanta, GA'],
        ['20', 'Liam', 'White', 'liam.white@nebula.com', 'IT', 'Network Administrator', 'active', '2022-04-01', '2024-01-15T14:15:00Z', 'standard', 'Phoenix, AZ'],
      ]
    },
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'ds-002',
    name: 'Visitors',
    description: 'Visitor management data source containing all visitor records',
    type: 'table',
    schema: {
      columns: [
        { id: 'id', name: 'id', displayName: 'ID', type: 'string', isNumeric: false, isDate: false, isBoolean: false, isPrimaryKey: true },
        { id: 'firstName', name: 'first_name', displayName: 'First Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'lastName', name: 'last_name', displayName: 'Last Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'email', name: 'email', displayName: 'Email', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'company', name: 'company', displayName: 'Company', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'purpose', name: 'purpose', displayName: 'Purpose', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'hostId', name: 'host_id', displayName: 'Host ID', type: 'string', isNumeric: false, isDate: false, isBoolean: false, isForeignKey: true, referencedTable: 'Persons', referencedColumn: 'id' },
        { id: 'hostName', name: 'host_name', displayName: 'Host Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'checkInTime', name: 'check_in_time', displayName: 'Check-in Time', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'checkOutTime', name: 'check_out_time', displayName: 'Check-out Time', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'status', name: 'status', displayName: 'Status', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'location', name: 'location', displayName: 'Location', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
      ],
      rows: [
        ['V001', 'John', 'Doe', 'john.doe@example.com', 'Acme Corp', 'Business Meeting', '1', 'Sarah Johnson', '2024-01-15T09:00:00Z', '2024-01-15T11:30:00Z', 'completed', 'San Francisco, CA'],
        ['V002', 'Jane', 'Smith', 'jane.smith@example.com', 'XYZ Inc', 'Interview', '3', 'Emily Chen', '2024-01-15T10:15:00Z', '2024-01-15T12:00:00Z', 'completed', 'New York, NY'],
        ['V003', 'Robert', 'Johnson', 'robert.johnson@example.com', 'Tech Solutions', 'Vendor Meeting', '2', 'Michael Rodriguez', '2024-01-15T13:30:00Z', '2024-01-15T15:45:00Z', 'completed', 'San Francisco, CA'],
        ['V004', 'Maria', 'Garcia', 'maria.garcia@example.com', 'Global Services', 'Client Meeting', '5', 'Lisa Thompson', '2024-01-15T14:00:00Z', '2024-01-15T16:30:00Z', 'completed', 'San Francisco, CA'],
        ['V005', 'David', 'Lee', 'david.lee@example.com', 'Innovate LLC', 'Product Demo', '1', 'Sarah Johnson', '2024-01-16T09:30:00Z', '2024-01-16T11:00:00Z', 'completed', 'San Francisco, CA'],
        ['V006', 'Linda', 'Brown', 'linda.brown@example.com', 'Creative Designs', 'Interview', '9', 'Jennifer Lopez', '2024-01-16T11:15:00Z', '2024-01-16T13:00:00Z', 'completed', 'Miami, FL'],
        ['V007', 'Michael', 'Wilson', 'michael.wilson@example.com', 'Data Systems', 'Maintenance', '10', 'William Brown', '2024-01-16T14:30:00Z', '2024-01-16T17:00:00Z', 'completed', 'Austin, TX'],
        ['V008', 'Susan', 'Taylor', 'susan.taylor@example.com', 'Marketing Pro', 'Consultation', '3', 'Emily Chen', '2024-01-17T10:00:00Z', '2024-01-17T12:30:00Z', 'completed', 'New York, NY'],
        ['V009', 'James', 'Anderson', 'james.anderson@example.com', 'Finance Group', 'Audit', '4', 'James Wilson', '2024-01-17T13:45:00Z', '2024-01-17T16:15:00Z', 'completed', 'Chicago, IL'],
        ['V010', 'Patricia', 'Thomas', 'patricia.thomas@example.com', 'Legal Advisors', 'Legal Consultation', '5', 'Lisa Thompson', '2024-01-18T09:15:00Z', '2024-01-18T11:45:00Z', 'completed', 'San Francisco, CA'],
        ['V011', 'Christopher', 'Jackson', 'christopher.jackson@example.com', 'Security Systems', 'Security Audit', '2', 'Michael Rodriguez', '2024-01-18T13:00:00Z', '2024-01-18T16:00:00Z', 'completed', 'San Francisco, CA'],
        ['V012', 'Elizabeth', 'White', 'elizabeth.white@example.com', 'HR Solutions', 'Training', '9', 'Jennifer Lopez', '2024-01-19T10:30:00Z', '2024-01-19T15:00:00Z', 'completed', 'Miami, FL'],
        ['V013', 'Daniel', 'Harris', 'daniel.harris@example.com', 'Tech Innovations', 'Product Presentation', '1', 'Sarah Johnson', '2024-01-19T14:15:00Z', '2024-01-19T16:30:00Z', 'completed', 'San Francisco, CA'],
        ['V014', 'Jessica', 'Martin', 'jessica.martin@example.com', 'Design Studio', 'Project Discussion', '13', 'Olivia Johnson', '2024-01-20T09:45:00Z', '2024-01-20T12:15:00Z', 'completed', 'Portland, OR'],
        ['V015', 'Matthew', 'Thompson', 'matthew.thompson@example.com', 'Consulting Group', 'Business Meeting', '14', 'Daniel Lee', '2024-01-20T13:30:00Z', '2024-01-20T15:00:00Z', 'completed', 'San Francisco, CA'],
        ['V016', 'Ashley', 'Garcia', 'ashley.garcia@example.com', 'Marketing Agency', 'Campaign Planning', '3', 'Emily Chen', '2024-01-21T10:00:00Z', null, 'in-progress', 'New York, NY'],
        ['V017', 'Joshua', 'Martinez', 'joshua.martinez@example.com', 'Software Inc', 'Software Demo', '12', 'John Smith', '2024-01-21T11:30:00Z', null, 'in-progress', 'Seattle, WA'],
        ['V018', 'Amanda', 'Robinson', 'amanda.robinson@example.com', 'Financial Services', 'Investment Meeting', '4', 'James Wilson', '2024-01-21T14:00:00Z', null, 'in-progress', 'Chicago, IL'],
        ['V019', 'Ryan', 'Clark', 'ryan.clark@example.com', 'Tech Support', 'IT Maintenance', '10', 'William Brown', '2024-01-22T09:30:00Z', null, 'scheduled', 'Austin, TX'],
        ['V020', 'Sarah', 'Lewis', 'sarah.lewis@example.com', 'Educational Services', 'Training Session', '15', 'Sophia Martinez', '2024-01-22T13:15:00Z', null, 'scheduled', 'Denver, CO'],
      ]
    },
    lastUpdated: '2024-01-15T14:30:00Z'
  },
  {
    id: 'ds-003',
    name: 'Meetings',
    description: 'Meeting management data source containing all meeting records',
    type: 'table',
    schema: {
      columns: [
        { id: 'id', name: 'id', displayName: 'ID', type: 'string', isNumeric: false, isDate: false, isBoolean: false, isPrimaryKey: true },
        { id: 'title', name: 'title', displayName: 'Title', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'description', name: 'description', displayName: 'Description', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'organizerId', name: 'organizer_id', displayName: 'Organizer ID', type: 'string', isNumeric: false, isDate: false, isBoolean: false, isForeignKey: true, referencedTable: 'Persons', referencedColumn: 'id' },
        { id: 'organizerName', name: 'organizer_name', displayName: 'Organizer Name', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'startTime', name: 'start_time', displayName: 'Start Time', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'endTime', name: 'end_time', displayName: 'End Time', type: 'date', isNumeric: false, isDate: true, isBoolean: false },
        { id: 'location', name: 'location', displayName: 'Location', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'room', name: 'room', displayName: 'Room', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'status', name: 'status', displayName: 'Status', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'type', name: 'type', displayName: 'Type', type: 'string', isNumeric: false, isDate: false, isBoolean: false },
        { id: 'attendeeCount', name: 'attendee_count', displayName: 'Attendee Count', type: 'number', isNumeric: true, isDate: false, isBoolean: false },
      ],
      rows: [
        ['M001', 'Weekly Team Sync', 'Regular team sync meeting', '1', 'Sarah Johnson', '2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z', 'San Francisco, CA', 'Conference Room A', 'completed', 'internal', 8],
        ['M002', 'Project Kickoff', 'New project kickoff meeting', '2', 'Michael Rodriguez', '2024-01-15T13:30:00Z', '2024-01-15T15:00:00Z', 'San Francisco, CA', 'Conference Room B', 'completed', 'internal', 12],
        ['M003', 'Marketing Campaign Review', 'Review Q1 marketing campaign results', '3', 'Emily Chen', '2024-01-16T09:30:00Z', '2024-01-16T11:00:00Z', 'New York, NY', 'Marketing Room', 'completed', 'internal', 6],
        ['M004', 'Budget Planning', 'Annual budget planning session', '4', 'James Wilson', '2024-01-16T14:00:00Z', '2024-01-16T16:30:00Z', 'Chicago, IL', 'Finance Room', 'completed', 'internal', 5],
        ['M005', 'Executive Board Meeting', 'Quarterly executive board meeting', '5', 'Lisa Thompson', '2024-01-17T09:00:00Z', '2024-01-17T12:00:00Z', 'San Francisco, CA', 'Board Room', 'completed', 'internal', 7],
        ['M006', 'Client Presentation', 'Presentation for Acme Corp', '1', 'Sarah Johnson', '2024-01-17T14:30:00Z', '2024-01-17T16:00:00Z', 'San Francisco, CA', 'Presentation Room', 'completed', 'external', 10],
        ['M007', 'Security Review', 'Monthly security review meeting', '2', 'Michael Rodriguez', '2024-01-18T10:00:00Z', '2024-01-18T11:30:00Z', 'San Francisco, CA', 'Security Room', 'completed', 'internal', 9],
        ['M008', 'Product Demo', 'Demo for new product features', '14', 'Daniel Lee', '2024-01-18T13:00:00Z', '2024-01-18T14:30:00Z', 'San Francisco, CA', 'Demo Room', 'completed', 'internal', 15],
        ['M009', 'HR Policy Update', 'Discuss new HR policies', '9', 'Jennifer Lopez', '2024-01-19T09:30:00Z', '2024-01-19T11:00:00Z', 'Miami, FL', 'HR Conference Room', 'completed', 'internal', 12],
        ['M010', 'IT Infrastructure Planning', 'Plan for Q2 IT infrastructure updates', '10', 'William Brown', '2024-01-19T13:30:00Z', '2024-01-19T15:30:00Z', 'Austin, TX', 'IT Room', 'completed', 'internal', 8],
        ['M011', 'Sales Strategy Meeting', 'Discuss Q2 sales strategy', '18', 'Noah Thomas', '2024-01-20T10:00:00Z', '2024-01-20T12:00:00Z', 'Dallas, TX', 'Sales Room', 'completed', 'internal', 10],
        ['M012', 'Design Review', 'Review new website designs', '13', 'Olivia Johnson', '2024-01-20T14:00:00Z', '2024-01-20T15:30:00Z', 'Portland, OR', 'Design Studio', 'completed', 'internal', 7],
        ['M013', 'Customer Feedback Session', 'Review customer feedback for product improvements', '15', 'Sophia Martinez', '2024-01-21T09:00:00Z', '2024-01-21T11:00:00Z', 'Denver, CO', 'Support Room', 'completed', 'internal', 9],
        ['M014', 'Engineering Sprint Planning', 'Plan next development sprint', '6', 'David Chen', '2024-01-21T13:00:00Z', '2024-01-21T15:00:00Z', 'San Francisco, CA', 'Engineering Room', 'completed', 'internal', 14],
        ['M015', 'Investor Meeting', 'Quarterly meeting with investors', '5', 'Lisa Thompson', '2024-01-22T10:00:00Z', '2024-01-22T12:30:00Z', 'San Francisco, CA', 'Board Room', 'scheduled', 'external', 8],
        ['M016', 'Team Building Event', 'Monthly team building activity', '1', 'Sarah Johnson', '2024-01-22T14:00:00Z', '2024-01-22T17:00:00Z', 'San Francisco, CA', 'Recreation Area', 'scheduled', 'internal', 25],
        ['M017', 'Product Roadmap Planning', 'Plan product roadmap for next quarter', '14', 'Daniel Lee', '2024-01-23T09:30:00Z', '2024-01-23T12:00:00Z', 'San Francisco, CA', 'Product Room', 'scheduled', 'internal', 12],
        ['M018', 'Marketing Budget Review', 'Review marketing budget for Q1', '3', 'Emily Chen', '2024-01-23T13:30:00Z', '2024-01-23T15:00:00Z', 'New York, NY', 'Marketing Room', 'scheduled', 'internal', 6],
        ['M019', 'Security Training', 'Mandatory security training for all staff', '2', 'Michael Rodriguez', '2024-01-24T10:00:00Z', '2024-01-24T12:00:00Z', 'San Francisco, CA', 'Training Room', 'scheduled', 'internal', 30],
        ['M020', 'Executive Strategy Session', 'Annual strategy planning session', '5', 'Lisa Thompson', '2024-01-24T13:00:00Z', '2024-01-24T17:00:00Z', 'San Francisco, CA', 'Executive Suite', 'scheduled', 'internal', 7],
      ]
    },
    lastUpdated: '2024-01-15T16:45:00Z'
  }
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'report-001',
    name: 'Person Status by Department',
    description: 'Analysis of person status distribution across departments',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    createdBy: 'admin',
    isCustomSQL: false,
    visualizations: [
      {
        id: 'viz-001',
        name: 'Status Distribution',
        type: 'pie',
        config: {
          title: 'Person Status Distribution',
          showLegend: true,
          legendPosition: 'right',
          colors: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['status'],
          metrics: ['count'],
          filters: [],
        },
        order: 0
      },
      {
        id: 'viz-002',
        name: 'Department Breakdown',
        type: 'bar',
        config: {
          title: 'Persons by Department',
          xAxisLabel: 'Department',
          yAxisLabel: 'Count',
          showLegend: true,
          legendPosition: 'top',
          colors: ['#6366f1'],
          stacked: false,
          horizontal: true,
          showValues: true,
          showGrid: true,
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['department'],
          metrics: ['count'],
          filters: [],
          sort: {
            column: 'count',
            direction: 'desc'
          }
        },
        order: 1
      },
      {
        id: 'viz-003',
        name: 'Persons Table',
        type: 'table',
        config: {
          title: 'Persons Data',
        },
        dataConfig: {
          dimensions: ['firstName', 'lastName', 'department', 'position', 'status', 'joinDate', 'location'],
          metrics: [],
          filters: [],
        },
        order: 2
      }
    ],
    filters: [
      {
        id: 'filter-001',
        column: 'status',
        operator: 'in',
        value: ['active', 'pending'],
        isActive: true
      },
      {
        id: 'filter-002',
        column: 'joinDate',
        operator: 'greater_than',
        value: '2022-01-01',
        isActive: false
      }
    ],
    columns: [
      {
        id: 'col-001',
        name: 'firstName',
        displayName: 'First Name',
        sourceColumn: 'firstName',
        type: 'dimension',
        isVisible: true,
        order: 0
      },
      {
        id: 'col-002',
        name: 'lastName',
        displayName: 'Last Name',
        sourceColumn: 'lastName',
        type: 'dimension',
        isVisible: true,
        order: 1
      },
      {
        id: 'col-003',
        name: 'department',
        displayName: 'Department',
        sourceColumn: 'department',
        type: 'dimension',
        isVisible: true,
        order: 2
      },
      {
        id: 'col-004',
        name: 'position',
        displayName: 'Position',
        sourceColumn: 'position',
        type: 'dimension',
        isVisible: true,
        order: 3
      },
      {
        id: 'col-005',
        name: 'status',
        displayName: 'Status',
        sourceColumn: 'status',
        type: 'dimension',
        isVisible: true,
        order: 4
      },
      {
        id: 'col-006',
        name: 'joinDate',
        displayName: 'Join Date',
        sourceColumn: 'joinDate',
        type: 'dimension',
        format: 'YYYY-MM-DD',
        isVisible: true,
        order: 5
      },
      {
        id: 'col-007',
        name: 'location',
        displayName: 'Location',
        sourceColumn: 'location',
        type: 'dimension',
        isVisible: true,
        order: 6
      },
      {
        id: 'col-008',
        name: 'count',
        displayName: 'Count',
        sourceColumn: 'id',
        type: 'metric',
        formula: 'COUNT(id)',
        isVisible: true,
        order: 7
      }
    ]
  },
  {
    id: 'report-002',
    name: 'Visitor Analytics',
    description: 'Analysis of visitor patterns and trends',
    dataSourceId: 'ds-002',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    createdBy: 'admin',
    isCustomSQL: false,
    visualizations: [
      {
        id: 'viz-004',
        name: 'Visitors by Day',
        type: 'line',
        config: {
          title: 'Daily Visitor Count',
          xAxisLabel: 'Date',
          yAxisLabel: 'Visitors',
          showLegend: false,
          colors: ['#6366f1'],
          showGrid: true,
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['checkInDate'],
          metrics: ['visitorCount'],
          filters: [],
        },
        order: 0
      },
      {
        id: 'viz-005',
        name: 'Visitors by Purpose',
        type: 'pie',
        config: {
          title: 'Visit Purpose Distribution',
          showLegend: true,
          legendPosition: 'right',
          colors: ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'],
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['purpose'],
          metrics: ['visitorCount'],
          filters: [],
        },
        order: 1
      },
      {
        id: 'viz-006',
        name: 'Visitors Table',
        type: 'table',
        config: {
          title: 'Recent Visitors',
        },
        dataConfig: {
          dimensions: ['firstName', 'lastName', 'company', 'purpose', 'hostName', 'checkInTime', 'checkOutTime', 'status'],
          metrics: [],
          filters: [],
          sort: {
            column: 'checkInTime',
            direction: 'desc'
          },
          limit: 10
        },
        order: 2
      }
    ],
    filters: [
      {
        id: 'filter-003',
        column: 'checkInTime',
        operator: 'greater_than',
        value: '2024-01-01T00:00:00Z',
        isActive: true
      },
      {
        id: 'filter-004',
        column: 'status',
        operator: 'in',
        value: ['completed', 'in-progress'],
        isActive: true
      }
    ],
    columns: [
      {
        id: 'col-009',
        name: 'firstName',
        displayName: 'First Name',
        sourceColumn: 'firstName',
        type: 'dimension',
        isVisible: true,
        order: 0
      },
      {
        id: 'col-010',
        name: 'lastName',
        displayName: 'Last Name',
        sourceColumn: 'lastName',
        type: 'dimension',
        isVisible: true,
        order: 1
      },
      {
        id: 'col-011',
        name: 'company',
        displayName: 'Company',
        sourceColumn: 'company',
        type: 'dimension',
        isVisible: true,
        order: 2
      },
      {
        id: 'col-012',
        name: 'purpose',
        displayName: 'Purpose',
        sourceColumn: 'purpose',
        type: 'dimension',
        isVisible: true,
        order: 3
      },
      {
        id: 'col-013',
        name: 'hostName',
        displayName: 'Host',
        sourceColumn: 'hostName',
        type: 'dimension',
        isVisible: true,
        order: 4
      },
      {
        id: 'col-014',
        name: 'checkInTime',
        displayName: 'Check-in Time',
        sourceColumn: 'checkInTime',
        type: 'dimension',
        format: 'YYYY-MM-DD HH:mm',
        isVisible: true,
        order: 5
      },
      {
        id: 'col-015',
        name: 'checkOutTime',
        displayName: 'Check-out Time',
        sourceColumn: 'checkOutTime',
        type: 'dimension',
        format: 'YYYY-MM-DD HH:mm',
        isVisible: true,
        order: 6
      },
      {
        id: 'col-016',
        name: 'status',
        displayName: 'Status',
        sourceColumn: 'status',
        type: 'dimension',
        isVisible: true,
        order: 7
      },
      {
        id: 'col-017',
        name: 'checkInDate',
        displayName: 'Check-in Date',
        sourceColumn: 'checkInTime',
        type: 'dimension',
        formula: "DATE_TRUNC('day', checkInTime)",
        format: 'YYYY-MM-DD',
        isVisible: true,
        order: 8
      },
      {
        id: 'col-018',
        name: 'visitorCount',
        displayName: 'Visitor Count',
        sourceColumn: 'id',
        type: 'metric',
        formula: 'COUNT(id)',
        isVisible: true,
        order: 9
      }
    ]
  },
  {
    id: 'report-003',
    name: 'Meeting Analytics',
    description: 'Analysis of meeting patterns and room utilization',
    dataSourceId: 'ds-003',
    createdAt: '2024-01-14T10:45:00Z',
    updatedAt: '2024-01-15T15:20:00Z',
    createdBy: 'admin',
    isCustomSQL: false,
    visualizations: [
      {
        id: 'viz-007',
        name: 'Meetings by Type',
        type: 'bar',
        config: {
          title: 'Meeting Types',
          xAxisLabel: 'Type',
          yAxisLabel: 'Count',
          showLegend: false,
          colors: ['#6366f1'],
          stacked: false,
          horizontal: false,
          showValues: true,
          showGrid: true,
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['type'],
          metrics: ['meetingCount'],
          filters: [],
        },
        order: 0
      },
      {
        id: 'viz-008',
        name: 'Room Utilization',
        type: 'pie',
        config: {
          title: 'Room Utilization',
          showLegend: true,
          legendPosition: 'right',
          colors: ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899'],
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['room'],
          metrics: ['meetingCount'],
          filters: [],
        },
        order: 1
      },
      {
        id: 'viz-009',
        name: 'Average Attendees by Meeting Type',
        type: 'bar',
        config: {
          title: 'Average Attendees by Meeting Type',
          xAxisLabel: 'Type',
          yAxisLabel: 'Average Attendees',
          showLegend: false,
          colors: ['#8b5cf6'],
          stacked: false,
          horizontal: false,
          showValues: true,
          showGrid: true,
          showTooltip: true,
        },
        dataConfig: {
          dimensions: ['type'],
          metrics: ['avgAttendees'],
          filters: [],
        },
        order: 2
      },
      {
        id: 'viz-010',
        name: 'Meetings Table',
        type: 'table',
        config: {
          title: 'Recent Meetings',
        },
        dataConfig: {
          dimensions: ['title', 'organizerName', 'startTime', 'endTime', 'location', 'room', 'type', 'attendeeCount'],
          metrics: [],
          filters: [],
          sort: {
            column: 'startTime',
            direction: 'desc'
          },
          limit: 10
        },
        order: 3
      }
    ],
    filters: [
      {
        id: 'filter-005',
        column: 'startTime',
        operator: 'greater_than',
        value: '2024-01-01T00:00:00Z',
        isActive: true
      },
      {
        id: 'filter-006',
        column: 'status',
        operator: 'in',
        value: ['completed', 'scheduled'],
        isActive: true
      }
    ],
    columns: [
      {
        id: 'col-019',
        name: 'title',
        displayName: 'Title',
        sourceColumn: 'title',
        type: 'dimension',
        isVisible: true,
        order: 0
      },
      {
        id: 'col-020',
        name: 'organizerName',
        displayName: 'Organizer',
        sourceColumn: 'organizerName',
        type: 'dimension',
        isVisible: true,
        order: 1
      },
      {
        id: 'col-021',
        name: 'startTime',
        displayName: 'Start Time',
        sourceColumn: 'startTime',
        type: 'dimension',
        format: 'YYYY-MM-DD HH:mm',
        isVisible: true,
        order: 2
      },
      {
        id: 'col-022',
        name: 'endTime',
        displayName: 'End Time',
        sourceColumn: 'endTime',
        type: 'dimension',
        format: 'YYYY-MM-DD HH:mm',
        isVisible: true,
        order: 3
      },
      {
        id: 'col-023',
        name: 'location',
        displayName: 'Location',
        sourceColumn: 'location',
        type: 'dimension',
        isVisible: true,
        order: 4
      },
      {
        id: 'col-024',
        name: 'room',
        displayName: 'Room',
        sourceColumn: 'room',
        type: 'dimension',
        isVisible: true,
        order: 5
      },
      {
        id: 'col-025',
        name: 'type',
        displayName: 'Type',
        sourceColumn: 'type',
        type: 'dimension',
        isVisible: true,
        order: 6
      },
      {
        id: 'col-026',
        name: 'attendeeCount',
        displayName: 'Attendee Count',
        sourceColumn: 'attendeeCount',
        type: 'dimension',
        isVisible: true,
        order: 7
      },
      {
        id: 'col-027',
        name: 'meetingCount',
        displayName: 'Meeting Count',
        sourceColumn: 'id',
        type: 'metric',
        formula: 'COUNT(id)',
        isVisible: true,
        order: 8
      },
      {
        id: 'col-028',
        name: 'avgAttendees',
        displayName: 'Avg Attendees',
        sourceColumn: 'attendeeCount',
        type: 'metric',
        formula: 'AVG(attendeeCount)',
        isVisible: true,
        order: 9
      },
      {
        id: 'col-029',
        name: 'meetingDate',
        displayName: 'Meeting Date',
        sourceColumn: 'startTime',
        type: 'dimension',
        formula: "DATE_TRUNC('day', startTime)",
        format: 'YYYY-MM-DD',
        isVisible: true,
        order: 10
      }
    ]
  }
];

// Mock Dashboards
export const mockDashboards: Dashboard[] = [
  {
    id: 'dashboard-001',
    name: 'Identity Overview',
    description: 'Overview of identity management metrics and trends',
    layout: {
      widgets: [
        {
          id: 'widget-001',
          type: 'visualization',
          reportId: 'report-001',
          visualizationId: 'viz-001',
          position: { x: 0, y: 0, w: 6, h: 8 },
          title: 'Person Status Distribution'
        },
        {
          id: 'widget-002',
          type: 'visualization',
          reportId: 'report-001',
          visualizationId: 'viz-002',
          position: { x: 6, y: 0, w: 6, h: 8 },
          title: 'Persons by Department'
        },
        {
          id: 'widget-003',
          type: 'visualization',
          reportId: 'report-001',
          visualizationId: 'viz-003',
          position: { x: 0, y: 8, w: 12, h: 10 },
          title: 'Persons Data'
        },
        {
          id: 'widget-004',
          type: 'text',
          content: '# Identity Management Dashboard\n\nThis dashboard provides an overview of identity management metrics and trends. Use the filters above to customize the view.',
          position: { x: 0, y: 18, w: 12, h: 3 },
        }
      ]
    },
    filters: [
      {
        id: 'dashboard-filter-001',
        name: 'Status Filter',
        column: 'status',
        operator: 'in',
        value: ['active', 'pending', 'inactive'],
        isGlobal: true,
        affectedReports: ['report-001']
      },
      {
        id: 'dashboard-filter-002',
        name: 'Department Filter',
        column: 'department',
        operator: 'in',
        value: [],
        isGlobal: true,
        affectedReports: ['report-001']
      }
    ],
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z',
    createdBy: 'admin'
  },
  {
    id: 'dashboard-002',
    name: 'Visitor & Meeting Analytics',
    description: 'Combined analytics for visitors and meetings',
    layout: {
      widgets: [
        {
          id: 'widget-005',
          type: 'visualization',
          reportId: 'report-002',
          visualizationId: 'viz-004',
          position: { x: 0, y: 0, w: 6, h: 8 },
          title: 'Daily Visitor Count'
        },
        {
          id: 'widget-006',
          type: 'visualization',
          reportId: 'report-002',
          visualizationId: 'viz-005',
          position: { x: 6, y: 0, w: 6, h: 8 },
          title: 'Visit Purpose Distribution'
        },
        {
          id: 'widget-007',
          type: 'visualization',
          reportId: 'report-003',
          visualizationId: 'viz-007',
          position: { x: 0, y: 8, w: 6, h: 8 },
          title: 'Meeting Types'
        },
        {
          id: 'widget-008',
          type: 'visualization',
          reportId: 'report-003',
          visualizationId: 'viz-008',
          position: { x: 6, y: 8, w: 6, h: 8 },
          title: 'Room Utilization'
        },
        {
          id: 'widget-009',
          type: 'visualization',
          reportId: 'report-002',
          visualizationId: 'viz-006',
          position: { x: 0, y: 16, w: 12, h: 10 },
          title: 'Recent Visitors'
        }
      ]
    },
    filters: [
      {
        id: 'dashboard-filter-003',
        name: 'Date Range',
        column: 'checkInTime',
        operator: 'between',
        value: ['2024-01-01T00:00:00Z', '2024-01-31T23:59:59Z'],
        isGlobal: true,
        affectedReports: ['report-002', 'report-003']
      },
      {
        id: 'dashboard-filter-004',
        name: 'Location',
        column: 'location',
        operator: 'in',
        value: [],
        isGlobal: true,
        affectedReports: ['report-002', 'report-003']
      }
    ],
    createdAt: '2024-01-15T11:15:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    createdBy: 'admin'
  }
];

// Mock Calculated Columns
export const mockCalculatedColumns: CalculatedColumn[] = [
  {
    id: 'calc-001',
    name: 'full_name',
    displayName: 'Full Name',
    formula: 'CONCAT(first_name, \' \', last_name)',
    description: 'Combines first and last name into a full name',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-14T10:30:00Z',
    updatedAt: '2024-01-14T10:30:00Z'
  },
  {
    id: 'calc-002',
    name: 'days_since_join',
    displayName: 'Days Since Join',
    formula: 'DATEDIFF(\'day\', join_date, CURRENT_DATE)',
    description: 'Calculates the number of days since the person joined',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-14T11:15:00Z',
    updatedAt: '2024-01-14T11:15:00Z'
  },
  {
    id: 'calc-003',
    name: 'visit_duration_minutes',
    displayName: 'Visit Duration (Minutes)',
    formula: 'DATEDIFF(\'minute\', check_in_time, check_out_time)',
    description: 'Calculates the duration of a visit in minutes',
    dataSourceId: 'ds-002',
    createdAt: '2024-01-14T13:45:00Z',
    updatedAt: '2024-01-14T13:45:00Z'
  },
  {
    id: 'calc-004',
    name: 'meeting_duration_minutes',
    displayName: 'Meeting Duration (Minutes)',
    formula: 'DATEDIFF(\'minute\', start_time, end_time)',
    description: 'Calculates the duration of a meeting in minutes',
    dataSourceId: 'ds-003',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: 'calc-005',
    name: 'access_level_category',
    displayName: 'Access Level Category',
    formula: 'CASE WHEN access_level IN (\'super_admin\', \'admin\') THEN \'High\' WHEN access_level = \'standard\' THEN \'Medium\' ELSE \'Low\' END',
    description: 'Categorizes access levels into High, Medium, and Low',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-15T09:10:00Z',
    updatedAt: '2024-01-15T09:10:00Z'
  }
];

// Mock SQL Queries
export const mockSQLQueries: SQLQuery[] = [
  {
    id: 'sql-001',
    name: 'Active Users by Department',
    query: `SELECT 
  department, 
  COUNT(*) as user_count,
  AVG(DATEDIFF('day', join_date, CURRENT_DATE)) as avg_tenure_days
FROM 
  persons
WHERE 
  status = 'active'
GROUP BY 
  department
ORDER BY 
  user_count DESC`,
    description: 'Shows the count of active users by department along with their average tenure',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
    createdBy: 'admin'
  },
  {
    id: 'sql-002',
    name: 'Visitor Check-in Trends',
    query: `SELECT 
  DATE_TRUNC('day', check_in_time) as check_in_date,
  COUNT(*) as visitor_count,
  COUNT(DISTINCT company) as unique_companies
FROM 
  visitors
WHERE 
  check_in_time >= '2024-01-01'
GROUP BY 
  check_in_date
ORDER BY 
  check_in_date`,
    description: 'Shows daily visitor check-in counts and unique companies',
    dataSourceId: 'ds-002',
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    createdBy: 'admin'
  },
  {
    id: 'sql-003',
    name: 'Meeting Room Utilization',
    query: `SELECT 
  room,
  COUNT(*) as meeting_count,
  SUM(attendee_count) as total_attendees,
  AVG(DATEDIFF('minute', start_time, end_time)) as avg_duration_minutes
FROM 
  meetings
WHERE 
  start_time >= '2024-01-01'
GROUP BY 
  room
ORDER BY 
  meeting_count DESC`,
    description: 'Analyzes meeting room utilization with counts, attendees, and average duration',
    dataSourceId: 'ds-003',
    createdAt: '2024-01-15T13:15:00Z',
    updatedAt: '2024-01-15T13:15:00Z',
    createdBy: 'admin'
  },
  {
    id: 'sql-004',
    name: 'Cross-Source: Hosts and Their Visitors',
    query: `SELECT 
  p.first_name || ' ' || p.last_name as host_name,
  p.department,
  COUNT(v.id) as visitor_count,
  COUNT(DISTINCT v.company) as unique_companies
FROM 
  persons p
JOIN 
  visitors v ON p.id = v.host_id
WHERE 
  v.check_in_time >= '2024-01-01'
GROUP BY 
  host_name, p.department
ORDER BY 
  visitor_count DESC`,
    description: 'Cross-source query showing hosts and their visitor statistics',
    dataSourceId: 'ds-001',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    createdBy: 'admin'
  }
];

// Helper functions
export const getDataSourceById = (id: string): DataSource | undefined => {
  return mockDataSources.find(ds => ds.id === id);
};

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

export const getDashboardById = (id: string): Dashboard | undefined => {
  return mockDashboards.find(dashboard => dashboard.id === id);
};

export const getCalculatedColumnsByDataSource = (dataSourceId: string): CalculatedColumn[] => {
  return mockCalculatedColumns.filter(cc => cc.dataSourceId === dataSourceId);
};

export const getSQLQueriesByDataSource = (dataSourceId: string): SQLQuery[] => {
  return mockSQLQueries.filter(sql => sql.dataSourceId === dataSourceId);
};

// Function to generate a new unique ID
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Function to execute a report and get data
export const executeReport = (report: Report): any[] => {
  // In a real application, this would execute the report against the database
  // For our mock implementation, we'll return some sample data based on the report
  
  const dataSource = getDataSourceById(report.dataSourceId);
  if (!dataSource || !dataSource.schema.rows) {
    return [];
  }
  
  // Apply filters
  let filteredRows = [...dataSource.schema.rows];
  const activeFilters = report.filters.filter(f => f.isActive);
  
  if (activeFilters.length > 0) {
    // This is a simplified filter implementation
    filteredRows = filteredRows.filter(row => {
      return activeFilters.every(filter => {
        const columnIndex = dataSource.schema.columns.findIndex(col => col.name === filter.column);
        if (columnIndex === -1) return true;
        
        const value = row[columnIndex];
        
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'not_equals':
            return value !== filter.value;
          case 'in':
            return Array.isArray(filter.value) ? filter.value.includes(value) : false;
          case 'not_in':
            return Array.isArray(filter.value) ? !filter.value.includes(value) : true;
          case 'contains':
            return typeof value === 'string' && value.includes(filter.value);
          case 'greater_than':
            return value > filter.value;
          case 'less_than':
            return value < filter.value;
          default:
            return true;
        }
      });
    });
  }
  
  // Transform rows to objects with column names
  return filteredRows.map(row => {
    const obj: Record<string, any> = {};
    dataSource.schema.columns.forEach((col, index) => {
      obj[col.name] = row[index];
    });
    return obj;
  });
};

// Function to execute a SQL query
export const executeSQL = (query: string, dataSourceId: string): any[] => {
  // In a real application, this would execute the SQL against the database
  // For our mock implementation, we'll return some sample data
  
  // For simplicity, we'll just return the first 5 rows of the data source
  const dataSource = getDataSourceById(dataSourceId);
  if (!dataSource || !dataSource.schema.rows) {
    return [];
  }
  
  const sampleRows = dataSource.schema.rows.slice(0, 5);
  
  // Transform rows to objects with column names
  return sampleRows.map(row => {
    const obj: Record<string, any> = {};
    dataSource.schema.columns.forEach((col, index) => {
      obj[col.name] = row[index];
    });
    return obj;
  });
};