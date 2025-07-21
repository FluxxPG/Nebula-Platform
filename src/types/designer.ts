export interface FieldValidation {
  id: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'number' | 'custom';
  value?: string | number;
  message: string;
  enabled: boolean;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'email' | 'password' | 'date' | 'file' | 
        'datetime' | 'time' | 'rating' | 'toggle' | 'color' | 'url' | 'range' | 'currency' | 'mask' | 
        'biometric' | 'qrcode' | 'barcode' | 'multiselect' | 'tel' | 'avatar' | 'photo' | 'searchable-dropdown';
  label: string;
  placeholder?: string;
  required: boolean;
  validations: FieldValidation[];
  options?: FieldOption[]; // For select, radio, checkbox, multiselect
  defaultValue?: string | boolean | number | string[];
  width: 'full' | 'half' | 'third' | 'quarter';
  order: number;
  modelBinding?: string; // Binds to JSON model field
  description?: string;
  helpText?: string;
  
  // Advanced field properties
  min?: number; // For number, range inputs
  max?: number; // For number, range inputs
  step?: number; // For number, range inputs
  maxRating?: number; // For rating component
  showValue?: boolean; // For range slider
  currencySymbol?: string; // For currency input
  currencyCode?: string; // For currency input
  mask?: string; // For masked input
  suffix?: string; // For inputs with suffix (like percentage)
  prefix?: string; // For inputs with prefix
  multiple?: boolean; // For searchable-dropdown
  serverSideSearch?: boolean; // For searchable-dropdown
  
  // Cascading dropdown properties
  cascadeSource?: string; // ID of the field that controls this field's options
  cascadeTarget?: string; // ID of the field that this field controls
  cascadeMapping?: Record<string, FieldOption[]>; // Map of source values to target options
}

export interface FormWidget {
  id: string;
  type: 'form' | 'list' | 'card' | 'text' | 'image' | 'divider' | 'spacer';
  title: string;
  fields: FormField[];
  settings: {
    columns: number;
    spacing: 'compact' | 'normal' | 'relaxed';
    showBorder: boolean;
    showShadow: boolean;
    backgroundColor?: string;
  };
  order: number;
  modelBinding?: string; // Binds to JSON model
}

export interface PageDesign {
  id: string;
  name: string;
  description: string;
  type: 'view' | 'edit' | 'create';
  widgets: FormWidget[];
  modelId?: string; // References JSON model
  settings: {
    layout: 'single' | 'two-column' | 'three-column';
    maxWidth: string;
    padding: string;
    backgroundColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JsonModel {
  id: string;
  name: string;
  description: string;
  version: string;
  schema: Record<string, any>; // JSON Schema
  sampleData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}