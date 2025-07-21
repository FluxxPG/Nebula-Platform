import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  EyeOff, 
  Link, 
  AlertTriangle,
  Check,
  Calendar,
  Clock,
  Globe,
  MapPin,
  DollarSign,
  Hash,
  Percent,
  Search
} from 'lucide-react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { FormWidget, FormField, FieldValidation, FieldOption } from '../../types/designer';
import { GlassButton, GlassInput, GlassDropdown, GlassStatusBadge, GlassToggle } from '../../ui/components';

interface PropertyPanelProps {
  selectedWidget: FormWidget | null;
  selectedField: FormField | null;
  onWidgetUpdate: (widgetId: string, updates: Partial<FormWidget>) => void;
  onFieldUpdate: (widgetId: string, fieldId: string, updates: Partial<FormField>) => void;
  availableModels: Array<{ id: string; name: string; schema: Record<string, any> }>;
  className?: string;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedWidget,
  selectedField,
  onWidgetUpdate,
  onFieldUpdate,
  availableModels,
  className = '',
}) => {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<'general' | 'validation' | 'binding' | 'advanced'>('general');

  // Add validation rule
  const addValidationRule = () => {
    if (!selectedWidget || !selectedField) return;

    const newValidation: FieldValidation = {
      id: `validation-${Date.now()}`,
      type: 'required',
      message: 'This field is required',
      enabled: true,
    };

    const updatedValidations = [...(selectedField.validations || []), newValidation];
    onFieldUpdate(selectedWidget.id, selectedField.id, { validations: updatedValidations });
  };

  // Update validation rule
  const updateValidationRule = (validationId: string, updates: Partial<FieldValidation>) => {
    if (!selectedWidget || !selectedField) return;

    const updatedValidations = selectedField.validations?.map(validation =>
      validation.id === validationId ? { ...validation, ...updates } : validation
    ) || [];

    onFieldUpdate(selectedWidget.id, selectedField.id, { validations: updatedValidations });
  };

  // Remove validation rule
  const removeValidationRule = (validationId: string) => {
    if (!selectedWidget || !selectedField) return;

    const updatedValidations = selectedField.validations?.filter(v => v.id !== validationId) || [];
    onFieldUpdate(selectedWidget.id, selectedField.id, { validations: updatedValidations });
  };

  // Add option
  const addOption = () => {
    if (!selectedWidget || !selectedField) return;

    const newOption: FieldOption = {
      value: `option-${Date.now()}`,
      label: 'New Option',
    };

    const updatedOptions = [...(selectedField.options || []), newOption];
    onFieldUpdate(selectedWidget.id, selectedField.id, { options: updatedOptions });
  };

  // Update option
  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    if (!selectedWidget || !selectedField) return;

    const updatedOptions = selectedField.options?.map((option, i) =>
      i === index ? { ...option, ...updates } : option
    ) || [];

    onFieldUpdate(selectedWidget.id, selectedField.id, { options: updatedOptions });
  };

  // Remove option
  const removeOption = (index: number) => {
    if (!selectedWidget || !selectedField) return;

    const updatedOptions = selectedField.options?.filter((_, i) => i !== index) || [];
    onFieldUpdate(selectedWidget.id, selectedField.id, { options: updatedOptions });
  };

  const containerStyles: React.CSSProperties = {
    width: '350px',
    height: '100%',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.light}`,
    background: colors.glass.secondary,
  };

  const tabsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    marginTop: spacing.lg,
    background: colors.glass.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  };

  const tabButtonStyles = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${spacing.sm} ${spacing.md}`,
    background: isActive ? colors.gradients.primary : 'transparent',
    color: isActive ? 'white' : colors.text.secondary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  });

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.xl,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: spacing.xl,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const fieldGroupStyles: React.CSSProperties = {
    marginBottom: spacing.lg,
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const validationItemStyles: React.CSSProperties = {
    padding: spacing.md,
    background: colors.glass.secondary,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border.light}`,
    marginBottom: spacing.sm,
  };

  const renderGeneralTab = () => {
    if (selectedField) {
      return (
        <div>
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Field Properties</h3>
            
            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Field Label</label>
              <GlassInput
                value={selectedField.label}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { label: value })}
                placeholder="Enter field label"
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Field Type</label>
              <GlassDropdown
                options={[
                  { value: 'text', label: 'Text Input' },
                  { value: 'textarea', label: 'Text Area' },
                  { value: 'select', label: 'Dropdown' },
                  { value: 'searchable-dropdown', label: 'Searchable Dropdown' },
                  { value: 'checkbox', label: 'Checkbox' },
                  { value: 'radio', label: 'Radio Button' },
                  { value: 'number', label: 'Number' },
                  { value: 'email', label: 'Email' },
                  { value: 'password', label: 'Password' },
                  { value: 'date', label: 'Date' },
                  { value: 'time', label: 'Time' },
                  { value: 'datetime', label: 'Date & Time' },
                  { value: 'file', label: 'File Upload' },
                  { value: 'tel', label: 'Phone Number' },
                  { value: 'url', label: 'URL' },
                  { value: 'color', label: 'Color Picker' },
                  { value: 'range', label: 'Range Slider' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'toggle', label: 'Toggle Switch' },
                  { value: 'currency', label: 'Currency' },
                  { value: 'mask', label: 'Masked Input' },
                  { value: 'multiselect', label: 'Multi-Select' },
                  { value: 'avatar', label: 'Avatar Upload' },
                  { value: 'photo', label: 'Photo Capture' },
                ]}
                value={selectedField.type}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { type: value as any })}
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Placeholder</label>
              <GlassInput
                value={selectedField.placeholder || ''}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { placeholder: value })}
                placeholder="Enter placeholder text"
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Help Text</label>
              <GlassInput
                value={selectedField.helpText || ''}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { helpText: value })}
                placeholder="Enter help text"
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Field Width</label>
              <GlassDropdown
                options={[
                  { value: 'full', label: 'Full Width' },
                  { value: 'half', label: 'Half Width' },
                  { value: 'third', label: 'One Third' },
                  { value: 'quarter', label: 'One Quarter' },
                ]}
                value={selectedField.width}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { width: value as any })}
              />
            </div>

            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedField.required}
                onChange={(checked) => onFieldUpdate(selectedWidget!.id, selectedField.id, { required: checked })}
                label="Required Field"
              />
            </div>
          </div>

          {/* Options for select/radio/multiselect/searchable-dropdown fields */}
          {(selectedField.type === 'select' || 
            selectedField.type === 'radio' || 
            selectedField.type === 'multiselect' || 
            selectedField.type === 'searchable-dropdown') && (
            <div style={sectionStyles}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <h3 style={sectionTitleStyles}>Options</h3>
                <GlassButton variant="primary" size="sm" onClick={addOption}>
                  <Plus size={14} style={{ marginRight: spacing.xs }} />
                  Add Option
                </GlassButton>
              </div>

              {selectedField.options?.map((option, index) => (
                <div key={index} style={{
                  ...validationItemStyles,
                  display: 'flex',
                  gap: spacing.md,
                  alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    <GlassInput
                      value={option.label}
                      onChange={(value) => updateOption(index, { label: value })}
                      placeholder="Option label"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <GlassInput
                      value={option.value}
                      onChange={(value) => updateOption(index, { value })}
                      placeholder="Option value"
                    />
                  </div>
                  <GlassButton
                    variant="error"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 size={14} />
                  </GlassButton>
                </div>
              ))}
            </div>
          )}

          {/* Multiple selection for searchable dropdown */}
          {selectedField.type === 'searchable-dropdown' && (
            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedField.multiple || false}
                onChange={(checked) => onFieldUpdate(selectedWidget!.id, selectedField.id, { multiple: checked })}
                label="Allow Multiple Selection"
              />
            </div>
          )}

          {/* Server-side search for searchable dropdown */}
          {selectedField.type === 'searchable-dropdown' && (
            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedField.serverSideSearch || false}
                onChange={(checked) => onFieldUpdate(selectedWidget!.id, selectedField.id, { serverSideSearch: checked })}
                label="Enable Server-side Search"
              />
              {selectedField.serverSideSearch && (
                <div style={{ 
                  marginTop: spacing.md,
                  padding: spacing.md,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                  fontSize: '0.75rem',
                  color: colors.text.secondary
                }}>
                  <p>Server-side search requires custom implementation in your application.</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (selectedWidget) {
      return (
        <div>
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Widget Properties</h3>
            
            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Widget Title</label>
              <GlassInput
                value={selectedWidget.title}
                onChange={(value) => onWidgetUpdate(selectedWidget.id, { title: value })}
                placeholder="Enter widget title"
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Columns</label>
              <GlassDropdown
                options={[
                  { value: '1', label: '1 Column' },
                  { value: '2', label: '2 Columns' },
                  { value: '3', label: '3 Columns' },
                  { value: '4', label: '4 Columns' },
                ]}
                value={selectedWidget.settings.columns.toString()}
                onChange={(value) => onWidgetUpdate(selectedWidget.id, {
                  settings: { ...selectedWidget.settings, columns: parseInt(value) }
                })}
              />
            </div>

            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Spacing</label>
              <GlassDropdown
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' },
                ]}
                value={selectedWidget.settings.spacing}
                onChange={(value) => onWidgetUpdate(selectedWidget.id, {
                  settings: { ...selectedWidget.settings, spacing: value as any }
                })}
              />
            </div>

            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedWidget.settings.showBorder}
                onChange={(checked) => onWidgetUpdate(selectedWidget.id, {
                  settings: { ...selectedWidget.settings, showBorder: checked }
                })}
                label="Show Border"
              />
            </div>

            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedWidget.settings.showShadow}
                onChange={(checked) => onWidgetUpdate(selectedWidget.id, {
                  settings: { ...selectedWidget.settings, showShadow: checked }
                })}
                label="Show Shadow"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        textAlign: 'center',
        padding: spacing['3xl'],
        color: colors.text.secondary,
      }}>
        <Settings size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: colors.text.primary, 
          marginBottom: spacing.md 
        }}>
          No Selection
        </h3>
        <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
          Select a widget or field to configure its properties.
        </p>
      </div>
    );
  };

  const renderValidationTab = () => {
    if (!selectedField) {
      return (
        <div style={{
          textAlign: 'center',
          padding: spacing['3xl'],
          color: colors.text.secondary,
        }}>
          <AlertTriangle size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Select a Field
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Select a field to configure validation rules.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div style={sectionStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <h3 style={sectionTitleStyles}>Validation Rules</h3>
            <GlassButton variant="primary" size="sm" onClick={addValidationRule}>
              <Plus size={14} style={{ marginRight: spacing.xs }} />
              Add Rule
            </GlassButton>
          </div>

          {selectedField.validations?.map((validation) => (
            <div key={validation.id} style={validationItemStyles}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <GlassStatusBadge
                  status={validation.enabled ? 'success' : 'inactive'}
                  label={validation.type}
                  size="sm"
                />
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => updateValidationRule(validation.id, { enabled: !validation.enabled })}
                  >
                    {validation.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </GlassButton>
                  <GlassButton
                    variant="error"
                    size="sm"
                    onClick={() => removeValidationRule(validation.id)}
                  >
                    <Trash2 size={14} />
                  </GlassButton>
                </div>
              </div>

              <div style={{ marginBottom: spacing.md }}>
                <label style={labelStyles}>Validation Type</label>
                <GlassDropdown
                  options={[
                    { value: 'required', label: 'Required' },
                    { value: 'minLength', label: 'Minimum Length' },
                    { value: 'maxLength', label: 'Maximum Length' },
                    { value: 'pattern', label: 'Pattern (Regex)' },
                    { value: 'email', label: 'Email Format' },
                    { value: 'number', label: 'Number Only' },
                    { value: 'custom', label: 'Custom Rule' },
                  ]}
                  value={validation.type}
                  onChange={(value) => updateValidationRule(validation.id, { type: value as any })}
                />
              </div>

              {(validation.type === 'minLength' || validation.type === 'maxLength' || validation.type === 'pattern') && (
                <div style={{ marginBottom: spacing.md }}>
                  <label style={labelStyles}>
                    {validation.type === 'minLength' ? 'Minimum Length' :
                     validation.type === 'maxLength' ? 'Maximum Length' : 'Pattern'}
                  </label>
                  <GlassInput
                    value={validation.value?.toString() || ''}
                    onChange={(value) => updateValidationRule(validation.id, { value })}
                    placeholder={validation.type === 'pattern' ? 'Enter regex pattern' : 'Enter number'}
                  />
                </div>
              )}

              <div>
                <label style={labelStyles}>Error Message</label>
                <GlassInput
                  value={validation.message}
                  onChange={(value) => updateValidationRule(validation.id, { message: value })}
                  placeholder="Enter error message"
                />
              </div>
            </div>
          ))}

          {(!selectedField.validations || selectedField.validations.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: spacing.xl,
              color: colors.text.secondary,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `2px dashed ${colors.border.light}`,
            }}>
              <Check size={32} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>
                No validation rules added yet.
                <br />Click "Add Rule" to create validation.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBindingTab = () => {
    if (!selectedField) {
      return (
        <div style={{
          textAlign: 'center',
          padding: spacing['3xl'],
          color: colors.text.secondary,
        }}>
          <Link size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Select a Field
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Select a field to configure data binding.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Data Binding</h3>
          
          <div style={fieldGroupStyles}>
            <label style={labelStyles}>JSON Model</label>
            <GlassDropdown
              options={[
                { value: '', label: 'No binding' },
                ...availableModels.map(model => ({ value: model.id, label: model.name }))
              ]}
              value={selectedWidget?.modelBinding || ''}
              onChange={(value) => onWidgetUpdate(selectedWidget!.id, { modelBinding: value })}
              placeholder="Select a model"
            />
          </div>

          {selectedWidget?.modelBinding && (
            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Model Field</label>
              <GlassDropdown
                options={(() => {
                  const model = availableModels.find(m => m.id === selectedWidget.modelBinding);
                  if (!model) return [];
                  
                  return Object.keys(model.schema).map(key => ({
                    value: key,
                    label: key
                  }));
                })()}
                value={selectedField.modelBinding || ''}
                onChange={(value) => onFieldUpdate(selectedWidget.id, selectedField.id, { modelBinding: value })}
                placeholder="Select a field"
              />
            </div>
          )}

          <div style={fieldGroupStyles}>
            <label style={labelStyles}>Default Value</label>
            <GlassInput
              value={selectedField.defaultValue?.toString() || ''}
              onChange={(value) => onFieldUpdate(selectedWidget.id, selectedField.id, { defaultValue: value })}
              placeholder="Enter default value"
            />
          </div>
        </div>

        {selectedWidget?.modelBinding && (
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Model Schema</h3>
            <div style={{
              padding: spacing.md,
              background: colors.glass.secondary,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.border.light}`,
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: colors.text.secondary,
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              <pre>
                {JSON.stringify(
                  availableModels.find(m => m.id === selectedWidget.modelBinding)?.schema || {},
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdvancedTab = () => {
    if (!selectedField) {
      return (
        <div style={{
          textAlign: 'center',
          padding: spacing['3xl'],
          color: colors.text.secondary,
        }}>
          <Settings size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Select a Field
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Select a field to configure advanced properties.
          </p>
        </div>
      );
    }

    // Render different advanced properties based on field type
    return (
      <div>
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Advanced Properties</h3>
          
          {/* Number, Range, Rating specific properties */}
          {(selectedField.type === 'number' || selectedField.type === 'range') && (
            <>
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Minimum Value</label>
                <GlassInput
                  type="number"
                  value={selectedField.min?.toString() || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { min: Number(value) })}
                  placeholder="Enter minimum value"
                />
              </div>
              
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Maximum Value</label>
                <GlassInput
                  type="number"
                  value={selectedField.max?.toString() || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { max: Number(value) })}
                  placeholder="Enter maximum value"
                />
              </div>
              
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Step</label>
                <GlassInput
                  type="number"
                  value={selectedField.step?.toString() || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { step: Number(value) })}
                  placeholder="Enter step value"
                />
              </div>
            </>
          )}
          
          {/* Rating specific properties */}
          {selectedField.type === 'rating' && (
            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Maximum Rating</label>
              <GlassInput
                type="number"
                value={selectedField.maxRating?.toString() || '5'}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { maxRating: Number(value) })}
                placeholder="Enter maximum rating"
              />
            </div>
          )}
          
          {/* Range specific properties */}
          {selectedField.type === 'range' && (
            <div style={fieldGroupStyles}>
              <GlassToggle
                checked={selectedField.showValue || false}
                onChange={(checked) => onFieldUpdate(selectedWidget!.id, selectedField.id, { showValue: checked })}
                label="Show Value"
              />
            </div>
          )}
          
          {/* Currency specific properties */}
          {selectedField.type === 'currency' && (
            <>
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Currency Symbol</label>
                <GlassInput
                  value={selectedField.currencySymbol || '$'}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { currencySymbol: value })}
                  placeholder="Enter currency symbol"
                />
              </div>
              
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Currency Code</label>
                <GlassDropdown
                  options={[
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'JPY', label: 'JPY - Japanese Yen' },
                    { value: 'CAD', label: 'CAD - Canadian Dollar' },
                    { value: 'AUD', label: 'AUD - Australian Dollar' },
                    { value: 'INR', label: 'INR - Indian Rupee' },
                    { value: 'CNY', label: 'CNY - Chinese Yuan' },
                  ]}
                  value={selectedField.currencyCode || 'USD'}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { currencyCode: value })}
                  placeholder="Select currency code"
                />
              </div>
            </>
          )}
          
          {/* Mask specific properties */}
          {selectedField.type === 'mask' && (
            <div style={fieldGroupStyles}>
              <label style={labelStyles}>Input Mask</label>
              <GlassInput
                value={selectedField.mask || ''}
                onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { mask: value })}
                placeholder="e.g., 999-99-9999"
              />
              <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
                Use 9 for digits, a for letters, * for any character
              </div>
            </div>
          )}
          
          {/* Prefix/Suffix for inputs */}
          {(selectedField.type === 'text' || selectedField.type === 'number') && (
            <>
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Prefix</label>
                <GlassInput
                  value={selectedField.prefix || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { prefix: value })}
                  placeholder="Enter prefix"
                />
              </div>
              
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Suffix</label>
                <GlassInput
                  value={selectedField.suffix || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { suffix: value })}
                  placeholder="Enter suffix"
                />
              </div>
            </>
          )}
          
          {/* Cascading dropdown properties */}
          {selectedField.type === 'select' && (
            <>
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Cascade Source Field</label>
                <GlassDropdown
                  options={[
                    { value: '', label: 'None' },
                    ...(selectedWidget?.fields
                      .filter(f => f.id !== selectedField.id && f.type === 'select')
                      .map(f => ({ value: f.id, label: f.label })) || [])
                  ]}
                  value={selectedField.cascadeSource || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { cascadeSource: value })}
                  placeholder="Select source field"
                />
              </div>
              
              <div style={fieldGroupStyles}>
                <label style={labelStyles}>Cascade Target Field</label>
                <GlassDropdown
                  options={[
                    { value: '', label: 'None' },
                    ...(selectedWidget?.fields
                      .filter(f => f.id !== selectedField.id && f.type === 'select')
                      .map(f => ({ value: f.id, label: f.label })) || [])
                  ]}
                  value={selectedField.cascadeTarget || ''}
                  onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { cascadeTarget: value })}
                  placeholder="Select target field"
                />
              </div>
            </>
          )}
          
          {/* Field description */}
          <div style={fieldGroupStyles}>
            <label style={labelStyles}>Field Description</label>
            <GlassInput
              value={selectedField.description || ''}
              onChange={(value) => onFieldUpdate(selectedWidget!.id, selectedField.id, { description: value })}
              placeholder="Enter field description"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .property-panel-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .property-panel-content::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      
      <div style={containerStyles} className={className}>
        <div style={headerStyles}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.sm,
          }}>
            Properties
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            margin: 0,
          }}>
            {selectedField ? `Field: ${selectedField.label}` : 
             selectedWidget ? `Widget: ${selectedWidget.title}` : 
             'No selection'}
          </p>

          <div style={tabsStyles}>
            <button
              style={tabButtonStyles(activeTab === 'general')}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              style={tabButtonStyles(activeTab === 'validation')}
              onClick={() => setActiveTab('validation')}
            >
              Validation
            </button>
            <button
              style={tabButtonStyles(activeTab === 'binding')}
              onClick={() => setActiveTab('binding')}
            >
              Binding
            </button>
            <button
              style={tabButtonStyles(activeTab === 'advanced')}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </button>
          </div>
        </div>

        <div style={contentStyles} className="property-panel-content">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'validation' && renderValidationTab()}
          {activeTab === 'binding' && renderBindingTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
      </div>
    </>
  );
};