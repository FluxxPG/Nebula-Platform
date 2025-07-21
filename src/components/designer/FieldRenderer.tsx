import React, { useState, useEffect } from 'react';
import { 
  Star, Calendar, Clock, Globe, MapPin, DollarSign, Fingerprint, QrCode, 
  Scan, X, CreditCard, Phone, Percent, Link2, Eye, EyeOff, Check, 
  ChevronDown, ChevronUp, Plus, Search, CalendarClock, Hash, User, Camera
} from 'lucide-react';
import { GlassAvatarUpload, GlassPhotoCapture, GlassSearchableDropdown } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { FormField } from '../../types/designer';

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  preview?: boolean;
  readOnly?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  preview = false,
  readOnly = false,
}) => {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dateTimeValue, setDateTimeValue] = useState<{date?: string, time?: string}>({});
  const [cascadeOptions, setCascadeOptions] = useState<{value: string, label: string}[]>([]);
  
  // Handle cascading dropdown options
  useEffect(() => {
    if (field.cascadeSource && field.cascadeMapping && value) {
      const sourceValue = value[field.cascadeSource];
      if (sourceValue && field.cascadeMapping[sourceValue]) {
        setCascadeOptions(field.cascadeMapping[sourceValue]);
      }
    }
  }, [field.cascadeSource, field.cascadeMapping, value]);

  // Handle datetime combined value
  useEffect(() => {
    if (field.type === 'datetime' && typeof value === 'object' && value !== null) {
      setDateTimeValue(value);
    } else if (field.type === 'datetime' && typeof value === 'string' && value) {
      // Parse ISO string to date and time parts
      try {
        const date = new Date(value);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
        setDateTimeValue({ date: dateStr, time: timeStr });
      } catch (e) {
        setDateTimeValue({});
      }
    }
  }, [field.type, value]);

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  };

  const inputBaseStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.glass.primary,
    border: `2px solid ${error ? '#ef4444' : focused ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    fontSize: '0.875rem',
    color: colors.text.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: focused ? shadows.glassHover : shadows.glass,
    cursor: readOnly ? 'not-allowed' : 'text',
    opacity: readOnly ? 0.8 : 1,
  };

  const textareaStyles: React.CSSProperties = {
    ...inputBaseStyles,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const selectStyles: React.CSSProperties = {
    ...inputBaseStyles,
    cursor: readOnly ? 'not-allowed' : 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
  };

  const checkboxStyles: React.CSSProperties = {
    width: '18px',
    height: '18px',
    marginRight: spacing.sm,
    accentColor: colors.text.primary,
    cursor: readOnly ? 'not-allowed' : 'pointer',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: spacing.xs,
    fontWeight: '500',
  };

  const helpTextStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  };

  const requiredIndicatorStyles: React.CSSProperties = {
    color: '#ef4444',
    marginLeft: spacing.xs,
  };

  // Styles for advanced input types
  const ratingStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    marginTop: spacing.sm,
  };

  const starStyles = (filled: boolean): React.CSSProperties => ({
    color: filled ? '#f59e0b' : colors.text.secondary,
    cursor: readOnly ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
  });

  const toggleStyles: React.CSSProperties = {
    position: 'relative',
    width: '44px',
    height: '24px',
    background: value ? colors.gradients.primary : colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '12px',
    cursor: readOnly ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
  };

  const toggleThumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: value ? 'calc(100% - 20px - 2px)' : '2px',
    width: '20px',
    height: '20px',
    background: 'white',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  };

  const colorPickerStyles: React.CSSProperties = {
    width: '100%',
    height: '40px',
    padding: '0',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: readOnly ? 'not-allowed' : 'pointer',
  };

  const rangeSliderStyles: React.CSSProperties = {
    width: '100%',
    height: '8px',
    borderRadius: borderRadius.full,
    background: colors.glass.secondary,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: readOnly ? 'not-allowed' : 'pointer',
  };

  const rangeValueStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  };

  const currencyContainerStyles: React.CSSProperties = {
    position: 'relative',
  };

  const currencySymbolStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.secondary,
    fontSize: '0.875rem',
    pointerEvents: 'none',
  };

  const currencyInputStyles: React.CSSProperties = {
    ...inputBaseStyles,
    paddingLeft: '2rem',
  };

  const specialButtonStyles: React.CSSProperties = {
    ...inputBaseStyles,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    cursor: readOnly ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    fontWeight: '600',
  };

  const multiselectContainerStyles: React.CSSProperties = {
    ...inputBaseStyles,
    padding: spacing.sm,
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    minHeight: '80px',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  };

  const multiselectItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.glass.secondary,
    borderRadius: borderRadius.md,
    fontSize: '0.75rem',
    fontWeight: '600',
  };

  const multiselectRemoveStyles: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    borderRadius: '50%',
  };

  const passwordContainerStyles: React.CSSProperties = {
    position: 'relative',
  };

  const passwordToggleStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dateTimeContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
  };

  const dateTimeInputStyles: React.CSSProperties = {
    ...inputBaseStyles,
    flex: 1,
  };

  const cascadingDropdownStyles: React.CSSProperties = {
    ...selectStyles,
  };

  // Helper function for rating component
  const renderRating = () => {
    const maxRating = field.maxRating || 5;
    const currentRating = typeof value === 'number' ? value : 0;
    
    return (
      <div style={ratingStyles}>
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            size={24}
            style={starStyles(index < currentRating)}
            onClick={() => {
              if (!readOnly) {
                onChange(index + 1);
              }
            }}
            onMouseEnter={(e) => {
              if (!readOnly) {
                e.currentTarget.style.transform = 'scale(1.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!readOnly) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        ))}
      </div>
    );
  };

  // Helper function for multiselect component
  const renderMultiselect = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    const options = field.options || [];
    
    const handleRemoveItem = (itemValue: string) => {
      const newValues = selectedValues.filter(v => v !== itemValue);
      onChange(newValues);
    };
    
    return (
      <div style={multiselectContainerStyles}>
        {selectedValues.map(val => {
          const option = options.find(opt => opt.value === val);
          return (
            <div key={val} style={multiselectItemStyles}>
              {option?.label || val}
              {!readOnly && (
                <button
                  style={multiselectRemoveStyles}
                  onClick={() => handleRemoveItem(val)}
                  disabled={readOnly}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
        {!readOnly && (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value && !selectedValues.includes(e.target.value)) {
                onChange([...selectedValues, e.target.value]);
                e.target.value = '';
              }
            }}
            style={{
              ...selectStyles,
              border: 'none',
              background: 'transparent',
              boxShadow: 'none',
              padding: spacing.xs,
              margin: 0,
              minWidth: '120px',
              flex: 1,
            }}
            disabled={readOnly}
          >
            <option value="">Add item...</option>
            {options
              .filter(opt => !selectedValues.includes(opt.value))
              .map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        )}
      </div>
    );
  };

  // Helper function for cascading dropdown
  const renderCascadingDropdown = () => {
    return (
      <select
        style={cascadingDropdownStyles}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        disabled={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="">{field.placeholder || 'Select an option...'}</option>
        {(field.cascadeSource ? cascadeOptions : field.options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const renderInput = () => {
    if (preview) {
      // In preview mode, show placeholder or default styling
      switch (field.type) {
        case 'avatar':
          return (
            <GlassAvatarUpload
              size="md"
              disabled={true}
            />
          );
        case 'photo':
          return (
            <GlassPhotoCapture
              size="md"
              disabled={true}
            />
          );
        case 'searchable-dropdown':
          return (
            <GlassSearchableDropdown
              options={field.options || []}
              placeholder={field.placeholder || 'Search and select...'}
              disabled={true}
              multiple={field.multiple}
            />
          );
        case 'textarea':
          return (
            <textarea
              style={textareaStyles}
              placeholder={field.placeholder}
              disabled
              value=""
            />
          );
        case 'select':
          return (
            <select style={selectStyles} disabled value="">
              <option value="">{field.placeholder || 'Select an option...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case 'checkbox':
          return (
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={checkboxStyles}
                disabled
                checked={false}
              />
              <span style={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                {field.label}
              </span>
            </label>
          );
        case 'radio':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {field.options?.map((option) => (
                <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    style={checkboxStyles}
                    disabled
                  />
                  <span style={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          );
        case 'file':
          return (
            <div style={{
              ...inputBaseStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px',
              borderStyle: 'dashed',
              cursor: 'pointer',
            }}>
              <span style={{ color: colors.text.secondary }}>
                Click to upload or drag and drop
              </span>
            </div>
          );
        case 'datetime':
          return (
            <div style={dateTimeContainerStyles}>
              <input
                type="date"
                style={dateTimeInputStyles}
                disabled
                value=""
              />
              <input
                type="time"
                style={dateTimeInputStyles}
                disabled
                value=""
              />
            </div>
          );
        case 'time':
          return (
            <input
              type="time"
              style={inputBaseStyles}
              disabled
              value=""
            />
          );
        case 'rating':
          return (
            <div style={ratingStyles}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={24} style={starStyles(false)} />
              ))}
            </div>
          );
        case 'toggle':
          return (
            <div style={toggleStyles}>
              <div style={toggleThumbStyles} />
            </div>
          );
        case 'color':
          return (
            <input
              type="color"
              style={colorPickerStyles}
              disabled
              value="#4A2D85"
            />
          );
        case 'range':
          return (
            <div>
              <input
                type="range"
                style={rangeSliderStyles}
                disabled
                value="50"
              />
              <div style={rangeValueStyles}>50</div>
            </div>
          );
        case 'currency':
          return (
            <div style={currencyContainerStyles}>
              <div style={currencySymbolStyles}>$</div>
              <input
                type="text"
                style={currencyInputStyles}
                placeholder="0.00"
                disabled
                value=""
              />
            </div>
          );
        case 'mask':
          return (
            <input
              type="text"
              style={inputBaseStyles}
              placeholder={field.mask || '___-__-____'}
              disabled
              value=""
            />
          );
        case 'biometric':
          return (
            <button
              style={specialButtonStyles}
              disabled
            >
              <Fingerprint size={20} />
              <span>Authenticate with Biometrics</span>
            </button>
          );
        case 'qrcode':
          return (
            <button
              style={specialButtonStyles}
              disabled
            >
              <QrCode size={20} />
              <span>Scan QR Code</span>
            </button>
          );
        case 'barcode':
          return (
            <button
              style={specialButtonStyles}
              disabled
            >
              <Scan size={20} />
              <span>Scan Barcode</span>
            </button>
          );
        case 'multiselect':
          return (
            <div style={multiselectContainerStyles}>
              <div style={multiselectItemStyles}>
                Sample Item
                <button style={multiselectRemoveStyles} disabled>
                  <X size={12} />
                </button>
              </div>
              <select
                style={{
                  ...selectStyles,
                  border: 'none',
                  background: 'transparent',
                  boxShadow: 'none',
                  padding: spacing.xs,
                  margin: 0,
                  minWidth: '120px',
                  flex: 1,
                }}
                disabled
                value=""
              >
                <option value="">Add item...</option>
              </select>
            </div>
          );
        case 'tel':
          return (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: spacing.lg, top: '50%', transform: 'translateY(-50%)' }}>
                <Phone size={16} style={{ color: colors.text.secondary }} />
              </div>
              <input
                type="tel"
                style={{ ...inputBaseStyles, paddingLeft: '2.5rem' }}
                placeholder={field.placeholder || 'Enter phone number...'}
                disabled
                value=""
              />
            </div>
          );
        case 'url':
          return (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: spacing.lg, top: '50%', transform: 'translateY(-50%)' }}>
                <Link2 size={16} style={{ color: colors.text.secondary }} />
              </div>
              <input
                type="url"
                style={{ ...inputBaseStyles, paddingLeft: '2.5rem' }}
                placeholder={field.placeholder || 'https://example.com'}
                disabled
                value=""
              />
            </div>
          );
        case 'password':
          return (
            <div style={passwordContainerStyles}>
              <input
                type="password"
                style={inputBaseStyles}
                placeholder={field.placeholder || 'Enter password...'}
                disabled
                value=""
              />
              <button
                style={passwordToggleStyles}
                disabled
              >
                <Eye size={16} />
              </button>
            </div>
          );
        default:
          return (
            <input
              type={field.type}
              style={inputBaseStyles}
              placeholder={field.placeholder}
              disabled
              value=""
            />
          );
      }
    }

    // Functional mode for actual form usage
    switch (field.type) {
      case 'avatar':
        return (
          <GlassAvatarUpload
            value={value}
            onChange={onChange}
            size="md"
            disabled={readOnly}
            error={error}
          />
        );
      case 'photo':
        return (
          <GlassPhotoCapture
            value={value}
            onChange={onChange}
            size="md"
            disabled={readOnly}
            error={error}
          />
        );
      case 'searchable-dropdown':
        return (
          <GlassSearchableDropdown
            options={field.options || []}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder || 'Search and select...'}
            disabled={readOnly}
            multiple={field.multiple}
            error={error}
            serverSideSearch={field.serverSideSearch}
          />
        );
      case 'textarea':
        return (
          <textarea
            style={textareaStyles}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={readOnly}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        );
      case 'select':
        if (field.cascadeSource || field.cascadeTarget) {
          return renderCascadingDropdown();
        }
        return (
          <select
            style={selectStyles}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <option value="">{field.placeholder || 'Select an option...'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', cursor: readOnly ? 'not-allowed' : 'pointer' }}>
            <input
              type="checkbox"
              style={checkboxStyles}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              required={field.required}
              disabled={readOnly}
            />
            <span style={{ color: colors.text.primary, fontSize: '0.875rem' }}>
              {field.label}
            </span>
          </label>
        );
      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {field.options?.map((option) => (
              <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: readOnly ? 'not-allowed' : 'pointer' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  style={checkboxStyles}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  required={field.required}
                  disabled={readOnly}
                />
                <span style={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );
      case 'file':
        return (
          <input
            type="file"
            style={inputBaseStyles}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            required={field.required}
            disabled={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        );
      case 'datetime':
        return (
          <div style={dateTimeContainerStyles}>
            <input
              type="date"
              style={dateTimeInputStyles}
              value={dateTimeValue.date || ''}
              onChange={(e) => {
                const newValue = { ...dateTimeValue, date: e.target.value };
                setDateTimeValue(newValue);
                onChange(newValue);
              }}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <input
              type="time"
              style={dateTimeInputStyles}
              value={dateTimeValue.time || ''}
              onChange={(e) => {
                const newValue = { ...dateTimeValue, time: e.target.value };
                setDateTimeValue(newValue);
                onChange(newValue);
              }}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );
      case 'time':
        return (
          <input
            type="time"
            style={inputBaseStyles}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        );
      case 'rating':
        return renderRating();
      case 'toggle':
        return (
          <div 
            style={toggleStyles}
            onClick={() => !readOnly && onChange(!value)}
          >
            <div style={toggleThumbStyles} />
          </div>
        );
      case 'color':
        return (
          <input
            type="color"
            style={colorPickerStyles}
            value={value || '#4A2D85'}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={readOnly}
          />
        );
      case 'range':
        return (
          <div>
            <input
              type="range"
              style={rangeSliderStyles}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={value || 50}
              onChange={(e) => onChange(Number(e.target.value))}
              required={field.required}
              disabled={readOnly}
            />
            {field.showValue && (
              <div style={rangeValueStyles}>{value || 50}</div>
            )}
          </div>
        );
      case 'currency':
        return (
          <div style={currencyContainerStyles}>
            <div style={currencySymbolStyles}>{field.currencySymbol || '$'}</div>
            <input
              type="text"
              style={currencyInputStyles}
              placeholder="0.00"
              value={value || ''}
              onChange={(e) => {
                // Allow only numbers and decimal point
                const val = e.target.value.replace(/[^0-9.]/g, '');
                onChange(val);
              }}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );
      case 'mask':
        return (
          <input
            type="text"
            style={inputBaseStyles}
            placeholder={field.mask || '___-__-____'}
            value={value || ''}
            onChange={(e) => {
              // Basic mask implementation
              const mask = field.mask || '___-__-____';
              const val = e.target.value;
              
              // Simple implementation - in a real app, use a library like react-input-mask
              let maskedValue = '';
              let valueIndex = 0;
              
              for (let i = 0; i < mask.length && valueIndex < val.length; i++) {
                if (mask[i] === '9') {
                  // Only digits
                  if (/\d/.test(val[valueIndex])) {
                    maskedValue += val[valueIndex];
                    valueIndex++;
                  } else {
                    valueIndex++;
                    i--;
                  }
                } else if (mask[i] === 'a') {
                  // Only letters
                  if (/[a-zA-Z]/.test(val[valueIndex])) {
                    maskedValue += val[valueIndex];
                    valueIndex++;
                  } else {
                    valueIndex++;
                    i--;
                  }
                } else if (mask[i] === '*') {
                  // Any character
                  maskedValue += val[valueIndex];
                  valueIndex++;
                } else {
                  // Static character from mask
                  maskedValue += mask[i];
                }
              }
              
              onChange(maskedValue);
            }}
            required={field.required}
            disabled={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        );
      case 'biometric':
        return (
          <button
            style={specialButtonStyles}
            onClick={() => !readOnly && onChange(true)}
            disabled={readOnly}
          >
            <Fingerprint size={20} />
            <span>Authenticate with Biometrics</span>
          </button>
        );
      case 'qrcode':
        return (
          <button
            style={specialButtonStyles}
            onClick={() => !readOnly && onChange('QR scan triggered')}
            disabled={readOnly}
          >
            <QrCode size={20} />
            <span>Scan QR Code</span>
          </button>
        );
      case 'barcode':
        return (
          <button
            style={specialButtonStyles}
            onClick={() => !readOnly && onChange('Barcode scan triggered')}
            disabled={readOnly}
          >
            <Scan size={20} />
            <span>Scan Barcode</span>
          </button>
        );
      case 'multiselect':
        return renderMultiselect();
      case 'tel':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: spacing.lg, top: '50%', transform: 'translateY(-50%)' }}>
              <Phone size={16} style={{ color: colors.text.secondary }} />
            </div>
            <input
              type="tel"
              style={{ ...inputBaseStyles, paddingLeft: '2.5rem' }}
              placeholder={field.placeholder || 'Enter phone number...'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );
      case 'url':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: spacing.lg, top: '50%', transform: 'translateY(-50%)' }}>
              <Link2 size={16} style={{ color: colors.text.secondary }} />
            </div>
            <input
              type="url"
              style={{ ...inputBaseStyles, paddingLeft: '2.5rem' }}
              placeholder={field.placeholder || 'https://example.com'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );
      case 'password':
        return (
          <div style={passwordContainerStyles}>
            <input
              type={showPassword ? 'text' : 'password'}
              style={inputBaseStyles}
              placeholder={field.placeholder || 'Enter password...'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              disabled={readOnly}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {!readOnly && (
              <button
                type="button"
                style={passwordToggleStyles}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            style={inputBaseStyles}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={readOnly}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {field.type !== 'checkbox' && (
        <label style={labelStyles}>
          {field.label}
          {field.required && <span style={requiredIndicatorStyles}>*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && <div style={errorStyles}>{error}</div>}
      
      {field.helpText && <div style={helpTextStyles}>{field.helpText}</div>}
    </div>
  );
};