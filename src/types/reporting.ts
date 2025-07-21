// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  description: string;
  type: 'table' | 'view' | 'query';
  schema: DataSourceSchema;
  lastUpdated: string;
}

export interface DataSourceSchema {
  columns: DataSourceColumn[];
  rows?: any[][];
}

export interface DataSourceColumn {
  id: string;
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  isNumeric: boolean;
  isDate: boolean;
  isBoolean: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencedTable?: string;
  referencedColumn?: string;
}

// Report Types
export interface Report {
  id: string;
  name: string;
  description: string;
  dataSourceId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  visualizations: Visualization[];
  filters: Filter[];
  columns: ReportColumn[];
  sqlQuery?: string;
  isCustomSQL: boolean;
}

export interface ReportColumn {
  id: string;
  name: string;
  displayName: string;
  sourceColumn: string;
  type: 'dimension' | 'metric' | 'calculated';
  formula?: string;
  format?: string;
  isVisible: boolean;
  order: number;
}

export interface Filter {
  id: string;
  column: string;
  operator: FilterOperator;
  value: any;
  isActive: boolean;
}

export type FilterOperator = 
  'equals' | 'not_equals' | 
  'greater_than' | 'less_than' | 
  'greater_than_equals' | 'less_than_equals' |
  'in' | 'not_in' | 
  'contains' | 'not_contains' | 
  'starts_with' | 'ends_with' |
  'is_null' | 'is_not_null' |
  'between' | 'not_between';

// Visualization Types
export interface Visualization {
  id: string;
  name: string;
  type: VisualizationType;
  config: VisualizationConfig;
  dataConfig: VisualizationDataConfig;
  order: number;
}

export type VisualizationType = 
  'table' | 'bar' | 'line' | 'area' | 'pie' | 
  'scatter' | 'heatmap' | 'map' | 'pivot' | 
  'funnel' | 'gauge' | 'card' | 'treemap' | 'sankey';

export interface VisualizationConfig {
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  colors?: string[];
  stacked?: boolean;
  horizontal?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  [key: string]: any;
}

export interface VisualizationDataConfig {
  dimensions: string[];
  metrics: string[];
  filters?: Filter[];
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
}

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  filters: DashboardFilter[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: 'visualization' | 'text' | 'filter';
  reportId?: string;
  visualizationId?: string;
  content?: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  title?: string;
}

export interface DashboardFilter {
  id: string;
  name: string;
  column: string;
  operator: FilterOperator;
  value: any;
  isGlobal: boolean;
  affectedReports: string[];
}

// Calculated Column Types
export interface CalculatedColumn {
  id: string;
  name: string;
  displayName: string;
  formula: string;
  description?: string;
  dataSourceId: string;
  createdAt: string;
  updatedAt: string;
}

// SQL Query Types
export interface SQLQuery {
  id: string;
  name: string;
  query: string;
  description?: string;
  dataSourceId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}