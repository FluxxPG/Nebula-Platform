import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { FormWidget, FormField, FormData, ValidationError } from '../../types/designer';
import { FieldRenderer } from './FieldRenderer';
import { GlassButton } from '../../ui/components';

interface FormRendererProps {
  widgets: FormWidget[];
  formData?: FormData;
  onFieldChange?: (fieldId: string, value: any) => void;
  onSubmit?: (data: FormData) => void;
  validationErrors?: ValidationError[];
  readOnly?: boolean;
  className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  widgets,
  formData = {},
  onFieldChange,
  onSubmit,
  validationErrors = [],
  readOnly = false,
  className = '',
}) => {
  const colors = useThemeColors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState<FormData>(formData);

  // Update local form data when prop changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const containerStyles: React.CSSProperties = {
    width: '100%',
  };

  const widgetContainerStyles = (widget: FormWidget): React.CSSProperties => ({
    marginBottom: spacing.xl,
    padding: spacing.xl,
    background: colors.glass.primary,
    border: widget.settings.showBorder ? `1px solid ${colors.border.light}` : 'none',
    borderRadius: borderRadius.xl,
    boxShadow: widget.settings.showShadow ? shadows.glass : 'none',
  });

  const widgetTitleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${colors.border.light}`,
  };

  const fieldGridStyles = (columns: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: spacing.lg,
  });

  const getFieldWidth = (width: string) => {
    switch (width) {
      case 'full': return '1';
      case 'half': return '1 / span 6';
      case 'third': return '1 / span 4';
      case 'quarter': return '1 / span 3';
      default: return '1';
    }
  };

  const getFieldError = (fieldId: string) => {
    return validationErrors.find(error => error.fieldId === fieldId)?.message || '';
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    // Update local form data
    const newFormData = { ...localFormData, [fieldId]: value };
    setLocalFormData(newFormData);
    
    // Propagate change to parent
    onFieldChange?.(fieldId, value);
    
    // Handle cascading dropdown updates
    widgets.forEach(widget => {
      widget.fields.forEach(field => {
        if (field.cascadeSource === fieldId) {
          // This field depends on the changed field
          // Reset its value
          const newValue = field.multiple ? [] : '';
          onFieldChange?.(field.id, newValue);
        }
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        onSubmit(localFormData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyles} className={className}>
      {widgets.map((widget) => (
        <div key={widget.id} style={widgetContainerStyles(widget)}>
          {widget.title && (
            <div style={widgetTitleStyles}>
              {widget.title}
            </div>
          )}

          <div style={fieldGridStyles(widget.settings.columns)}>
            {widget.fields.map((field) => (
              <div
                key={field.id}
                style={{
                  gridColumn: getFieldWidth(field.width),
                }}
              >
                <FieldRenderer
                  field={field}
                  value={localFormData[field.id] || field.defaultValue || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={getFieldError(field.id)}
                  preview={false}
                  readOnly={readOnly}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {!readOnly && onSubmit && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginTop: spacing.xl,
          gap: spacing.md,
        }}>
          <GlassButton
            variant="primary"
            type="submit"
            loading={isSubmitting}
          >
            Submit
          </GlassButton>
        </div>
      )}
    </form>
  );
};