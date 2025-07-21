import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, UserPlus, Users, Shield, Clock, RotateCcw, Grid, List, Edit, Save, Trash2 } from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassDataTable, GlassStatusBadge, GlassAvatar, GlassAdvancedFilter, GlassPaginationControl, GlassModal, GlassInput, GlassListControl } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../ui';
import { mockIdentities } from '../data/mockData';
import { Identity } from '../types/identity';
import { FormWidget, FormData, ValidationError } from '../types/designer';
import { WidgetSelector } from '../components/designer/WidgetSelector';
import { FormRenderer } from '../components/designer/FormRenderer';
import type { FilterField, FilterRule } from '../ui/components/GlassAdvancedFilter';
import type { ViewMode, SortOrder } from '../ui/components/GlassListControl';

interface IdentityListPageProps {
  onIdentityClick: (identity: Identity) => void;
}

export const IdentityListPage: React.FC<IdentityListPageProps> = ({ onIdentityClick }) => {
  const themeColors = useThemeColors();
  const [selectedIdentities, setSelectedIdentities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(false);
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);
  const [isAddIdentityOpen, setIsAddIdentityOpen] = useState(false);
  const [formWidgets, setFormWidgets] = useState<FormWidget[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination state for list view
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Load any saved form widgets for the add identity form
  useEffect(() => {
    const savedWidgets = localStorage.getItem('add-identity-form-widgets');
    if (savedWidgets) {
      try {
        setFormWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.error('Failed to load saved widgets:', error);
      }
    }
  }, []);

  // Define filter fields for the advanced filter
  const filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'expired', label: 'Expired' },
      ],
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Security', label: 'Security' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Executive', label: 'Executive' },
      ],
    },
    {
      key: 'accessLevel',
      label: 'Access Level',
      type: 'select',
      options: [
        { value: 'basic', label: 'Basic' },
        { value: 'standard', label: 'Standard' },
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Super Admin' },
      ],
    },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: [
        { value: 'San Francisco, CA', label: 'San Francisco, CA' },
        { value: 'New York, NY', label: 'New York, NY' },
        { value: 'Chicago, IL', label: 'Chicago, IL' },
      ],
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      key: 'employeeId',
      label: 'Employee ID',
      type: 'text',
    },
    {
      key: 'position',
      label: 'Position',
      type: 'text',
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      type: 'date',
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      type: 'date',
    },
  ];

  // Apply filters to data
  const applyFilters = (data: Identity[], filters: FilterRule[]) => {
    return data.filter(identity => {
      return filters.every(filter => {
        const fieldValue = identity[filter.field as keyof Identity];
        const filterValue = filter.value;

        if (!fieldValue || !filterValue) return true;

        switch (filter.operator) {
          case 'equals':
            return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
          case 'notEquals':
            return String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase();
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'notContains':
            return !String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith':
            return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'in':
            return Array.isArray(filterValue) 
              ? filterValue.some(val => String(fieldValue).toLowerCase() === val.toLowerCase())
              : String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
          case 'notIn':
            return Array.isArray(filterValue) 
              ? !filterValue.some(val => String(fieldValue).toLowerCase() === val.toLowerCase())
              : String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase();
          case 'greaterThan':
            return Number(fieldValue) > Number(filterValue);
          case 'lessThan':
            return Number(fieldValue) < Number(filterValue);
          case 'greaterThanOrEqual':
            return Number(fieldValue) >= Number(filterValue);
          case 'lessThanOrEqual':
            return Number(fieldValue) <= Number(filterValue);
          case 'before':
            return new Date(String(fieldValue)) < new Date(String(filterValue));
          case 'after':
            return new Date(String(fieldValue)) > new Date(String(filterValue));
          case 'between':
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const date = new Date(String(fieldValue));
              return date >= new Date(filterValue[0]) && date <= new Date(filterValue[1]);
            }
            return true;
          default:
            return true;
        }
      });
    });
  };

  // Filter and sort data based on controls
  const filteredData = applyFilters(mockIdentities, activeFilters).filter(identity => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      `${identity.firstname} ${identity.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: string | Date | number | undefined = undefined, bVal: string | Date | number | undefined = undefined;
    
    switch (sortBy) {
      case 'name':
        aVal = `${a.firstname} ${a.lastname}`;
        bVal = `${b.firstname} ${b.lastname}`;
        break;
      case 'department':
        aVal = a.company;
        bVal = b.company;
        break;
      case 'joinDate':
        aVal = new Date(a.joinDate);
        bVal = new Date(b.joinDate);
        break;
      case 'lastLogin':
        aVal = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
        bVal = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
        break;
      case 'accessCards':
        aVal = ((a as any).accessCards?.length) || 0;
        bVal = ((b as any).accessCards?.length) || 0;
        break;
      case 'permissions':
        aVal = ((a as any).permissions?.length) || 0;
        bVal = ((b as any).permissions?.length) || 0;
        break;
      default:
        if (typeof a[sortBy as keyof Identity] === 'string' || typeof a[sortBy as keyof Identity] === 'number') {
          aVal = a[sortBy as keyof Identity] as string | number;
          bVal = b[sortBy as keyof Identity] as string | number;
        }
    }

    if (!aVal || !bVal) return 0;
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations for list view
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedData.length);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const columns = [
    {
      key: 'avatar',
      label: '',
      width: '60px',
      render: (value: string, row: Identity) => (
        <GlassAvatar
          src={row.avatar}
          name={`${row.firstname} ${row.lastname}`}
          size="sm"
          status="online"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: any, row: Identity) => (
        <div>
          <div style={{ fontWeight: '700', color: themeColors.text.primary, fontSize: '0.875rem' }}>
            {row.firstname} {row.lastname}
          </div>
          <div style={{ color: themeColors.text.secondary, fontSize: '0.75rem', fontWeight: '500' }}>
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      label: 'Employee ID',
      sortable: true,
      width: '120px',
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      width: '120px',
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      width: '150px',
    },
    {
      key: 'accessLevel',
      label: 'Access Level',
      width: '120px',
      render: (value: string) => (
        <GlassStatusBadge
          status={value === 'super_admin' ? 'error' : value === 'admin' ? 'warning' : 'success'}
          label={value.replace('_', ' ').toUpperCase()}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value: string) => (
        <GlassStatusBadge
          status={value as any}
          size="sm"
        />
      ),
    },
    {
      key: 'location',
      label: 'Location',
      width: '150px',
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      width: '120px',
      sortable: true,
      render: (value: string) => (
        value ? new Date(value).toLocaleDateString() : 'Never'
      ),
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Export filtered data
    const dataToExport = sortedData.map(identity => ({
      Name: `${identity.firstname} ${identity.lastname}`,
      Email: identity.email,
      'Employee ID': identity.employeeid,
      Department: identity.company,
      Position: identity.position,
      'Access Level': identity.accessLevel,
      Status: identity.status,
      Location: identity.location,
      'Join Date': identity.joinDate,
      'Last Login': identity.lastLogin || 'Never',
    }));
    
    console.log('Exporting data:', dataToExport);
    // Here you would implement actual export functionality
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleAddWidget = (widget: FormWidget) => {
    const updatedWidgets = [...formWidgets, widget];
    setFormWidgets(updatedWidgets);
    
    // Save widgets to localStorage
    localStorage.setItem('add-identity-form-widgets', JSON.stringify(updatedWidgets));
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (confirm('Are you sure you want to remove this widget?')) {
      const updatedWidgets = formWidgets.filter(widget => widget.id !== widgetId);
      setFormWidgets(updatedWidgets);
      
      // Save widgets to localStorage
      localStorage.setItem('add-identity-form-widgets', JSON.stringify(updatedWidgets));
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Basic validation for required identity fields
    if (!formData.firstName) {
      errors.push({ fieldId: 'firstName', message: 'First name is required' });
    }
    
    if (!formData.lastName) {
      errors.push({ fieldId: 'lastName', message: 'Last name is required' });
    }
    
    if (!formData.email) {
      errors.push({ fieldId: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email as string)) {
      errors.push({ fieldId: 'email', message: 'Invalid email format' });
    }
    
    if (!formData.employeeId) {
      errors.push({ fieldId: 'employeeId', message: 'Employee ID is required' });
    }
    
    if (!formData.department) {
      errors.push({ fieldId: 'department', message: 'Department is required' });
    }
    
    if (!formData.position) {
      errors.push({ fieldId: 'position', message: 'Position is required' });
    }

    // Validate custom form widgets
    formWidgets.forEach(widget => {
      widget.fields.forEach(field => {
        const value = formData[field.id];
        
        if (field.validations && field.validations.length > 0) {
          field.validations.forEach(validation => {
            if (!validation.enabled) return;

            switch (validation.type) {
              case 'required':
                if (value === undefined || value === null || value === '') {
                  errors.push({ fieldId: field.id, message: validation.message || 'This field is required' });
                }
                break;
              case 'minLength':
                if (value && typeof value === 'string' && validation.value && value.length < Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Minimum length is ${validation.value} characters` });
                }
                break;
              case 'maxLength':
                if (value && typeof value === 'string' && validation.value && value.length > Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Maximum length is ${validation.value} characters` });
                }
                break;
              case 'email':
                if (value && typeof value === 'string') {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid email address' });
                  }
                }
                break;
              case 'number':
                if (value && isNaN(Number(value))) {
                  errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid number' });
                }
                break;
              case 'pattern':
                if (value && typeof value === 'string' && validation.value) {
                  try {
                    const regex = new RegExp(String(validation.value));
                    if (!regex.test(value)) {
                      errors.push({ fieldId: field.id, message: validation.message || 'Value does not match the required pattern' });
                    }
                  } catch (error) {
                    console.error('Invalid regex pattern:', validation.value);
                  }
                }
                break;
            }
          });
        }

        // Also check required flag even if no validations are defined
        if (field.required && (value === undefined || value === null || value === '')) {
          // Only add this error if there isn't already a required validation error for this field
          if (!errors.some(error => error.fieldId === field.id)) {
            errors.push({ fieldId: field.id, message: 'This field is required' });
          }
        }
      });
    });

    return errors;
  };

  const handleSubmit = (data: FormData) => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Save form data to localStorage
        const newIdentities = JSON.parse(localStorage.getItem('nebula-identities') || '[]');
        
        // Create a new identity
        const newIdentity: Identity = {
          id: `identity-${Date.now()}`,
          firstname: data.firstname as string,
          lastname: data.lastname as string,
          email: data.email as string,
          phone: data.phone as string || undefined,
          company: data.company as string,
          position: data.position as string,
          employeeid: data.employeeid as string,
          status: 'active',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          joinDate: new Date().toISOString(),
          accessLevel: data.accessLevel as any || 'basic',
          location: data.location as string || 'San Francisco, CA',
          manager: data.manager as string || undefined,
          cards: [],
          permissions: [],
        };
        
        newIdentities.push(newIdentity);
        localStorage.setItem('nebula-identities', JSON.stringify(newIdentities));
        
        // Close modal and reset form
        setIsAddIdentityOpen(false);
        setFormData({});
        setIsSubmitting(false);
        
        // Show success message
        alert('Identity created successfully!');
        
        // Refresh the list
        handleRefresh();
      }, 1000);
    }
  };

  // Sort options for the list control
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'department', label: 'Department' },
    { value: 'position', label: 'Position' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'lastLogin', label: 'Last Login' },
  ];

  // Filter options for the list control
  const filterOptions = [
    { value: 'active', label: 'Active', count: mockIdentities.filter(i => i.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: mockIdentities.filter(i => i.status === 'inactive').length },
    { value: 'pending', label: 'Pending', count: mockIdentities.filter(i => i.status === 'pending').length },
    { value: 'Engineering', label: 'Engineering', count: mockIdentities.filter(i => i.company === 'Engineering').length },
    { value: 'Security', label: 'Security', count: mockIdentities.filter(i => i.company === 'Security').length },
    { value: 'Marketing', label: 'Marketing', count: mockIdentities.filter(i => i.company === 'Marketing').length },
    { value: 'Finance', label: 'Finance', count: mockIdentities.filter(i => i.company === 'Finance').length },
    { value: 'Executive', label: 'Executive', count: mockIdentities.filter(i => i.company === 'Executive').length },
  ];

  // Handle list control events
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode === 'grid' ? 'grid' : 'list');
  };

  const handleSortChange = (newSortBy: string, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (filters: string[]) => {
    // Convert simple filter values to filter rules
    const filterRules: FilterRule[] = filters.map(filter => {
      // Check if it's a status filter
      if (['active', 'inactive', 'pending', 'expired'].includes(filter)) {
        return {
          id: `status-${filter}`,
          field: 'status',
          operator: 'equals',
          value: filter,
        };
      }
      
      // Check if it's a department filter
      if (['Engineering', 'Security', 'Marketing', 'Finance', 'Executive'].includes(filter)) {
        return {
          id: `department-${filter}`,
          field: 'department',
          operator: 'equals',
          value: filter,
        };
      }
      
      // Default case
      return {
        id: `filter-${filter}`,
        field: 'department',
        operator: 'equals',
        value: filter,
      };
    });
    
    setActiveFilters(filterRules);
  };

  // Render identity preview for the preview functionality
  const renderIdentityPreview = (identity: Identity) => {
    return (
      <div style={{
        padding: spacing.xl,
        background: themeColors.glass.secondary,
        borderRadius: borderRadius.xl,
      }}>
        <div style={{ display: 'flex', gap: spacing.xl, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: spacing.md,
            minWidth: '150px',
          }}>
            <GlassAvatar
              src={identity.avatar}
              name={`${identity.firstname} ${identity.lastname}`}
              size="xl"
              status="online"
            />
            <div style={{ textAlign: 'center' }}>
              <GlassStatusBadge
                status={identity.status as any}
                size="md"
              />
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: themeColors.text.primary,
              marginBottom: spacing.md,
            }}>
              {identity.firstname} {identity.lastname}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Email
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.email}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Phone
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.phone || 'Not provided'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Employee ID
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.employeeid}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Company
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.company}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Position
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.position}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Access Level
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  <GlassStatusBadge
                    status={identity.accessLevel === 'super_admin' ? 'error' : identity.accessLevel === 'admin' ? 'warning' : 'success'}
                    label={identity.accessLevel.replace('_', ' ').toUpperCase()}
                    size="sm"
                  />
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Location
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.location}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Join Date
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {new Date(identity.joinDate).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Last Login
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.lastLogin ? new Date(identity.lastLogin).toLocaleDateString() : 'Never'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                  Manager
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.manager || 'None'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: spacing.md }}>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => onIdentityClick(identity)}
              >
                View Full Details
              </GlassButton>
            </div>
          </div>
        </div>
        
        {/* Access Cards Summary */}
        {identity.cards.length > 0 && (
          <div style={{ marginTop: spacing.xl }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              color: themeColors.text.primary,
              marginBottom: spacing.lg,
            }}>
              Access Cards ({identity.cards.length})
            </h3>
            
            <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
              {identity.cards.map(card => (
                <div key={card.id} style={{
                  padding: spacing.md,
                  background: themeColors.glass.primary,
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${themeColors.border.light}`,
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text.primary, marginBottom: spacing.xs }}>
                    {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} Card
                  </div>
                  <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary }}>
                    {card.cardNumber}
                  </div>
                  <div style={{ marginTop: spacing.sm }}>
                    <GlassStatusBadge
                      status={card.status as any}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render list view with pagination
  const renderListView = () => (
    <div style={{
      background: themeColors.glass.primary,
      border: 'none',
      borderRadius: borderRadius.xl,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      overflow: 'hidden',
    }}>
      {/* List Content */}
      <div style={{ padding: spacing.xl }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing['3xl'],
          }}>
            <GlassStatusBadge status="info" label="Loading..." />
          </div>
        ) : paginatedData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing['3xl'],
            color: themeColors.text.secondary,
          }}>
            {activeFilters.length > 0 || searchTerm
              ? "No identities match your search criteria or filters"
              : "No identities found"
            }
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            {paginatedData.map((identity) => (
              <div
                key={identity.id}
                style={{
                  padding: spacing.xl,
                  background: themeColors.glass.secondary,
                  border: 'none',
                  borderRadius: borderRadius.lg,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.lg,
                }}
                onClick={() => onIdentityClick(identity)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
              >
                <GlassAvatar
                  src={identity.avatar}
                  name={`${identity.firstname} ${identity.lastname}`}
                  size="lg"
                  status="online"
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: themeColors.text.primary,
                        margin: 0,
                        marginBottom: spacing.xs,
                      }}>
                        {identity.firstname} {identity.lastname}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: themeColors.text.secondary,
                        margin: 0,
                        fontWeight: '500',
                      }}>
                        {identity.position} • {identity.company}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                      <GlassStatusBadge
                        status={identity.accessLevel === 'super_admin' ? 'error' : identity.accessLevel === 'admin' ? 'warning' : 'success'}
                        label={identity.accessLevel.replace('_', ' ').toUpperCase()}
                        size="sm"
                      />
                      <GlassStatusBadge
                        status={identity.status as any}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.md }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Email</span>
                      <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                        {identity.email}
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Employee ID</span>
                      <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                        {identity.employeeid}
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Location</span>
                      <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                        {identity.location}
                      </div>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Last Login</span>
                      <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                        {identity.lastLogin ? new Date(identity.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALWAYS SHOW Pagination for List View when there's data */}
      {!loading && sortedData.length > 0 && (
        <GlassPaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showPageSizeSelector={true}
          showColumnSelector={false}
          showRefresh={true}
          showExport={true}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      )}
    </div>
  );

  // KPI Card styles with theme awareness
  const kpiCardStyles = (color: string): React.CSSProperties => ({
    padding: spacing.xl,
    background: themeColors.glass.primary,
    border: 'none',
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
  });

  const kpiIconContainerStyles = (gradient: string): React.CSSProperties => ({
    width: '60px',
    height: '60px',
    background: gradient,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 32px ${gradient.split(' ')[0]}40`,
  });

  return (
    <PageLayout
      title="Identity Management"
      subtitle="Manage user identities, access levels, and permissions across your organization"
      actions={
        <div style={{ display: 'flex', gap: spacing.lg }}>
          <GlassButton variant="ghost" size="lg" onClick={handleExport}>
            <Download size={20} style={{ marginRight: spacing.sm }} />
            Export All
          </GlassButton>
          <GlassButton 
            variant="success" 
            size="lg"
            onClick={() => setIsAddIdentityOpen(true)}
          >
            <UserPlus size={20} style={{ marginRight: spacing.sm }} />
            Add Identity
          </GlassButton>
        </div>
      }
    >
      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing.xl,
        marginBottom: spacing['3xl'],
      }}>
        <div style={kpiCardStyles(themeColors.gradients.primary)}>
          <div style={kpiIconContainerStyles(themeColors.gradients.primary)}>
            <Users size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
              {mockIdentities.length}
            </div>
            <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
              Total Identities
            </div>
          </div>
        </div>
        
        <div style={kpiCardStyles(themeColors.gradients.success)}>
          <div style={kpiIconContainerStyles(themeColors.gradients.success)}>
            <Shield size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
              {mockIdentities.filter(i => i.status === 'active').length}
            </div>
            <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
              Active Users
            </div>
          </div>
        </div>
        
        <div style={kpiCardStyles(themeColors.gradients.warning)}>
          <div style={kpiIconContainerStyles(themeColors.gradients.warning)}>
            <Clock size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
              {mockIdentities.filter(i => i.status === 'pending').length}
            </div>
            <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
              Pending Approval
            </div>
          </div>
        </div>
        
        <div style={kpiCardStyles(themeColors.gradients.info)}>
          <div style={kpiIconContainerStyles(themeColors.gradients.info)}>
            <Shield size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
              {mockIdentities.reduce((acc, i) => acc + i.cards.length, 0)}
            </div>
            <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
              Active Cards
            </div>
          </div>
        </div>
      </div>

      {/* List Control Component */}
      <GlassListControl
        viewMode={viewMode === 'grid' ? 'grid' : 'list'}
        onViewModeChange={handleViewModeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search identities..."
        sortBy={sortBy}
        sortOrder={sortOrder as SortOrder}
        onSortChange={handleSortChange}
        sortOptions={sortOptions}
        activeFilters={activeFilters.map(f => f.value as string)}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        totalItems={mockIdentities.length}
        filteredItems={filteredData.length}
        onRefresh={handleRefresh}
        onExport={handleExport}
        loading={loading}
        className="mb-6"
        showPreview={true}
        onPreviewItem={(item) => console.log('Preview item:', item)}
      />

      {/* Data Display - Table or List */}
      {viewMode === 'grid' ? (
        <GlassDataTable
          data={sortedData}
          columns={columns}
          onRowClick={onIdentityClick}
          searchable={false} // We're using the list control for search
          filterable={false}
          pagination
          pageSize={15}
          showPageSizeSelector
          showColumnToggle
          showExport={false}
          showRefresh={false}
          onRefresh={handleRefresh}
          onExport={handleExport}
          loading={loading}
          emptyMessage={
            activeFilters.length > 0 || searchTerm
              ? "No identities match your search criteria or filters"
              : "No identities found"
          }
          // New preview functionality
          showPreview={true}
          renderPreview={renderIdentityPreview}
          previewTitle="Identity Preview"
        />
      ) : (
        renderListView()
      )}

      {/* Advanced Filter Controls - Moved Below Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        padding: spacing.lg,
        background: themeColors.glass.primary,
        border: 'none',
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        gap: spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
          <h3 style={{ 
            margin: 0, 
            color: themeColors.text.primary, 
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Advanced Filters
          </h3>
          
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <GlassStatusBadge
                status="info"
                label={`${activeFilters.length} active`}
                size="sm"
              />
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters([])}
              >
                Clear All
              </GlassButton>
            </div>
          )}
        </div>
        
        <GlassAdvancedFilter
          fields={filterFields}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />
      </div>

      {/* Add Identity Modal */}
      <GlassModal
        isOpen={isAddIdentityOpen}
        onClose={() => setIsAddIdentityOpen(false)}
        title="Add New Identity"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
          <div style={{
            padding: spacing.lg,
            background: themeColors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${themeColors.border.light}`,
          }}>
            <p style={{ 
              color: themeColors.text.primary, 
              fontSize: '0.875rem',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Create a new identity by filling out the form below. You can add custom form widgets to collect additional information.
            </p>
          </div>

          {/* Basic Identity Form */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing.lg,
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                First Name *
              </label>
              <GlassInput
                value={formData.firstName as string || ''}
                onChange={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter first name"
              />
              {validationErrors.find(e => e.fieldId === 'firstName') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'firstName')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Last Name *
              </label>
              <GlassInput
                value={formData.lastName as string || ''}
                onChange={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter last name"
              />
              {validationErrors.find(e => e.fieldId === 'lastName') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'lastName')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Email *
              </label>
              <GlassInput
                value={formData.email as string || ''}
                onChange={(value) => handleFieldChange('email', value)}
                placeholder="Enter email address"
              />
              {validationErrors.find(e => e.fieldId === 'email') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'email')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Phone
              </label>
              <GlassInput
                value={formData.phone as string || ''}
                onChange={(value) => handleFieldChange('phone', value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Employee ID *
              </label>
              <GlassInput
                value={formData.employeeId as string || ''}
                onChange={(value) => handleFieldChange('employeeId', value)}
                placeholder="Enter employee ID"
              />
              {validationErrors.find(e => e.fieldId === 'employeeId') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'employeeId')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Department *
              </label>
              <GlassInput
                value={formData.department as string || ''}
                onChange={(value) => handleFieldChange('department', value)}
                placeholder="Enter department"
              />
              {validationErrors.find(e => e.fieldId === 'department') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'department')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Position *
              </label>
              <GlassInput
                value={formData.position as string || ''}
                onChange={(value) => handleFieldChange('position', value)}
                placeholder="Enter position"
              />
              {validationErrors.find(e => e.fieldId === 'position') && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: spacing.xs }}>
                  {validationErrors.find(e => e.fieldId === 'position')?.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Location
              </label>
              <GlassInput
                value={formData.location as string || ''}
                onChange={(value) => handleFieldChange('location', value)}
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Custom Form Widgets */}
          {formWidgets.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: themeColors.text.primary,
                  margin: 0,
                }}>
                  Additional Information
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {formWidgets.map((widget, index) => (
                  <div key={widget.id} style={{
                    position: 'relative',
                    background: themeColors.glass.secondary,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: spacing.md,
                      right: spacing.md,
                      zIndex: 10,
                    }}>
                      <GlassButton
                        variant="error"
                        size="sm"
                        onClick={() => handleRemoveWidget(widget.id)}
                      >
                        <Trash2 size={16} />
                      </GlassButton>
                    </div>
                    
                    <FormRenderer
                      widgets={[widget]}
                      formData={formData}
                      onFieldChange={handleFieldChange}
                      validationErrors={validationErrors}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: spacing.md,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${themeColors.border.light}`,
          }}>
            <div>
              <GlassButton
                variant="ghost"
                onClick={() => setIsWidgetSelectorOpen(true)}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Form Widget
              </GlassButton>
            </div>
            
            <div style={{ display: 'flex', gap: spacing.md }}>
              <GlassButton
                variant="ghost"
                onClick={() => setIsAddIdentityOpen(false)}
              >
                Cancel
              </GlassButton>
              
              <GlassButton
                variant="primary"
                onClick={() => handleSubmit(formData)}
                loading={isSubmitting}
              >
                <Save size={16} style={{ marginRight: spacing.sm }} />
                Create Identity
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>

      {/* Widget Selector Modal */}
      <GlassModal
        isOpen={isWidgetSelectorOpen}
        onClose={() => setIsWidgetSelectorOpen(false)}
        title="Add Form Widget"
      >
        <WidgetSelector
          onWidgetSelect={handleAddWidget}
          onClose={() => setIsWidgetSelectorOpen(false)}
        />
      </GlassModal>
    </PageLayout>
  );
};