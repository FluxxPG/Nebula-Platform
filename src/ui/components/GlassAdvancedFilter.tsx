import React, { useState } from 'react';
import { Filter, Plus, X, Search } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { GlassButton } from './GlassButton';
import { GlassDrawer } from './GlassDrawer';
import { GlassInput } from './GlassInput';
import { GlassDropdown } from './GlassDropdown';
import { GlassStatusBadge } from './GlassStatusBadge';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date' | 'boolean';
  options?: { value: string; label: string }[];
}

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string | string[];
}

interface GlassAdvancedFilterProps {
  fields: FilterField[];
  activeFilters: FilterRule[];
  onFiltersChange: (filters: FilterRule[]) => void;
  className?: string;
}

export const GlassAdvancedFilter: React.FC<GlassAdvancedFilterProps> = ({
  fields,
  activeFilters,
  onFiltersChange,
  className = '',
}) => {
  const colors = useThemeColors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterRule[]>(activeFilters);

  const operators = {
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
      { value: 'notContains', label: 'Does not contain' },
    ],
    select: [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not equals' },
      { value: 'in', label: 'In' },
      { value: 'notIn', label: 'Not in' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
      { value: 'lessThanOrEqual', label: 'Less than or equal' },
    ],
    date: [
      { value: 'equals', label: 'On' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' },
    ],
    boolean: [
      { value: 'equals', label: 'Is' },
    ],
  };

  const buttonStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 1, // Low z-index for the trigger button
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: colors.gradients.primary,
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: borderRadius.full,
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.soft,
    zIndex: 2,
  };

  const filterRowStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.lg,
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    position: 'relative',
  };

  const filterRowHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  };

  const filterFieldsStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.md,
  };

  // Sync local filters with active filters when drawer opens
  React.useEffect(() => {
    if (isDrawerOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isDrawerOpen, activeFilters]);

  const addFilterRule = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: fields[0]?.key || '',
      operator: 'contains',
      value: '',
    };
    setLocalFilters([...localFilters, newFilter]);
  };

  const removeFilterRule = (id: string) => {
    setLocalFilters(localFilters.filter(filter => filter.id !== id));
  };

  const updateFilterRule = (id: string, updates: Partial<FilterRule>) => {
    setLocalFilters(localFilters.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const applyFilters = () => {
    const validFilters = localFilters.filter(filter => 
      filter.field && filter.operator && filter.value
    );
    onFiltersChange(validFilters);
    setIsDrawerOpen(false);
  };

  const clearAllFilters = () => {
    setLocalFilters([]);
    onFiltersChange([]);
  };

  const resetToActive = () => {
    setLocalFilters(activeFilters);
  };

  const getFieldType = (fieldKey: string): FilterField['type'] => {
    const field = fields.find(f => f.key === fieldKey);
    return field?.type || 'text';
  };

  const getFieldOptions = (fieldKey: string) => {
    const field = fields.find(f => f.key === fieldKey);
    return field?.options || [];
  };

  const renderValueInput = (filter: FilterRule) => {
    const fieldType = getFieldType(filter.field);
    const fieldOptions = getFieldOptions(filter.field);

    switch (fieldType) {
      case 'select':
        if (filter.operator === 'in' || filter.operator === 'notIn') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <GlassDropdown
                options={fieldOptions}
                placeholder="Select values..."
                searchable
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                {Array.isArray(filter.value) && filter.value.map((val, idx) => (
                  <GlassStatusBadge
                    key={idx}
                    status="info"
                    label={val}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <GlassDropdown
              options={fieldOptions}
              value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
              onChange={(value) => updateFilterRule(filter.id, { value })}
              placeholder="Select value..."
            />
          );
        }

      case 'boolean':
        return (
          <GlassDropdown
            options={[
              { value: 'true', label: 'True' },
              { value: 'false', label: 'False' },
            ]}
            value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
            onChange={(value) => updateFilterRule(filter.id, { value })}
            placeholder="Select..."
          />
        );

      case 'date':
        if (filter.operator === 'between') {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: spacing.sm, alignItems: 'center' }}>
              <GlassInput
                type="date"
                value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
                onChange={(value) => {
                  const currentValue = Array.isArray(filter.value) ? filter.value : ['', ''];
                  updateFilterRule(filter.id, { value: [value, currentValue[1] || ''] });
                }}
              />
              <span style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>to</span>
              <GlassInput
                type="date"
                value={Array.isArray(filter.value) ? filter.value[1] : ''}
                onChange={(value) => {
                  const currentValue = Array.isArray(filter.value) ? filter.value : ['', ''];
                  updateFilterRule(filter.id, { value: [currentValue[0] || '', value] });
                }}
              />
            </div>
          );
        } else {
          return (
            <GlassInput
              type="date"
              value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
              onChange={(value) => updateFilterRule(filter.id, { value })}
            />
          );
        }

      case 'number':
        return (
          <GlassInput
            type="number"
            placeholder="Enter number..."
            value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
            onChange={(value) => updateFilterRule(filter.id, { value })}
          />
        );

      default: // text
        return (
          <GlassInput
            placeholder="Enter value..."
            value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
            onChange={(value) => updateFilterRule(filter.id, { value })}
          />
        );
    }
  };

  return (
    <>
      <style>
        {`
          .filter-row {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
          }
          
          .filter-row:hover {
            background: ${colors.glass.primary} !important;
            transform: translateY(-1px);
          }
          
          .remove-filter-btn {
            opacity: 0.8;
            transition: opacity ${animations.duration.fast} ${animations.easing.smooth};
          }
          
          .remove-filter-btn:hover {
            opacity: 1;
          }
          
          .filter-section {
            margin-bottom: ${spacing.xl};
          }
          
          .filter-section:last-child {
            margin-bottom: 0;
          }
          
          @media (max-width: 768px) {
            .filter-fields {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={buttonStyles} className={className}>
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          title="Advanced filters"
        >
          <Filter size={16} />
        </GlassButton>
        {activeFilters.length > 0 && (
          <div style={badgeStyles}>
            {activeFilters.length}
          </div>
        )}
      </div>

      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          resetToActive();
          setIsDrawerOpen(false);
        }}
        title="Advanced Filters"
        width="500px"
        position="right"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, height: '100%' }}>
          {/* Description */}
          <div style={{
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`,
          }}>
            <p style={{ 
              color: colors.text.secondary, 
              fontSize: '0.875rem',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Create complex filters by selecting fields, operators, and values. Multiple filters will be combined with AND logic.
            </p>
          </div>

          {/* Filter Rules */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="filter-section">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '700',
                color: colors.text.primary,
              }}>
                Filter Rules ({localFilters.length})
              </h3>
              
              <GlassButton
                variant="primary"
                size="sm"
                onClick={addFilterRule}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Rule
              </GlassButton>
            </div>

            {localFilters.length === 0 ? (
              <div style={{
                padding: spacing.xl,
                textAlign: 'center',
                color: colors.text.secondary,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                border: `2px dashed ${colors.border.light}`,
              }}>
                <Filter size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
                <h4 style={{ 
                  margin: `0 0 ${spacing.sm} 0`, 
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}>
                  No filters added yet
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  Click "Add Rule" to create your first filter condition.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                {localFilters.map((filter, index) => (
                  <div key={filter.id} style={filterRowStyles} className="filter-row">
                    {/* Filter Header */}
                    <div style={filterRowHeaderStyles}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: colors.text.primary,
                      }}>
                        Filter Rule {index + 1}
                      </h4>
                      
                      <GlassButton
                        variant="error"
                        size="sm"
                        onClick={() => removeFilterRule(filter.id)}
                        className="remove-filter-btn"
                        title="Remove filter"
                      >
                        <X size={14} />
                      </GlassButton>
                    </div>

                    {/* Field and Operator Row */}
                    <div style={filterFieldsStyles} className="filter-fields">
                      {/* Field Selection */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: spacing.sm, 
                          fontSize: '0.75rem', 
                          color: colors.text.secondary,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Field
                        </label>
                        <GlassDropdown
                          options={fields.map(field => ({ value: field.key, label: field.label }))}
                          value={filter.field}
                          onChange={(value) => {
                            const fieldType = getFieldType(value);
                            const defaultOperator = operators[fieldType]?.[0]?.value || 'contains';
                            updateFilterRule(filter.id, { 
                              field: value, 
                              operator: defaultOperator,
                              value: '' 
                            });
                          }}
                          placeholder="Select field..."
                        />
                      </div>

                      {/* Operator Selection */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: spacing.sm, 
                          fontSize: '0.75rem', 
                          color: colors.text.secondary,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Operator
                        </label>
                        <GlassDropdown
                          options={operators[getFieldType(filter.field)] || operators.text}
                          value={filter.operator}
                          onChange={(value) => updateFilterRule(filter.id, { operator: value, value: '' })}
                          placeholder="Select operator..."
                        />
                      </div>
                    </div>

                    {/* Value Input */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: spacing.sm, 
                        fontSize: '0.75rem', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Value
                      </label>
                      {renderValueInput(filter)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {localFilters.length > 0 && (
            <div style={{
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.border.light}`,
            }} className="filter-section">
              <h4 style={{ 
                margin: `0 0 ${spacing.md} 0`, 
                color: colors.text.primary,
                fontSize: '0.875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Filter Preview
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                {localFilters.map((filter) => {
                  const field = fields.find(f => f.key === filter.field);
                  const operator = operators[getFieldType(filter.field)]?.find(op => op.value === filter.operator);
                  const value = Array.isArray(filter.value) ? filter.value.join(', ') : filter.value;
                  
                  return (
                    <GlassStatusBadge
                      key={filter.id}
                      status="info"
                      label={`${field?.label || filter.field} ${operator?.label || filter.operator} ${value || '...'}`}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            padding: spacing.lg,
            borderTop: `1px solid ${colors.border.light}`,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            marginTop: 'auto',
          }} className="filter-section">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing.md,
              marginBottom: spacing.md,
            }}>
              <GlassButton
                variant="ghost"
                size="md"
                onClick={clearAllFilters}
                disabled={localFilters.length === 0}
              >
                Clear All
              </GlassButton>
              
              <GlassButton
                variant="ghost"
                size="md"
                onClick={resetToActive}
              >
                Reset
              </GlassButton>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: spacing.md,
            }}>
              <GlassButton
                variant="secondary"
                size="md"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </GlassButton>
              
              <GlassButton
                variant="primary"
                size="md"
                onClick={applyFilters}
              >
                Apply {localFilters.filter(f => f.field && f.operator && f.value).length} Filter{localFilters.filter(f => f.field && f.operator && f.value).length !== 1 ? 's' : ''}
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassDrawer>
    </>
  );
};