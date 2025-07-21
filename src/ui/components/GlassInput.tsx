import React, { useState } from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '..';

interface GlassInputProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  className = '',
  label,
}) => {
  const [focused, setFocused] = useState(false);
  const colors = useThemeColors();

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.lg} ${spacing.xl}`,
    background: colors.glass.primary,
    border: `2px solid ${focused ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    fontSize: '1rem',
    fontWeight: '500',
    color: colors.text.primary,
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: focused ? shadows.glassHover : shadows.glass,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  };

  return (
    <>
      <style>
        {`
          .glass-input::placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .glass-input::-webkit-input-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .glass-input::-moz-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .glass-input:-ms-input-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .glass-input:focus::placeholder {
            color: ${colors.text.tertiary} !important;
            opacity: 0.6 !important;
          }
          
          /* Enhanced focus styles */
          .glass-input:focus {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover}, 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
          }
          
          /* Ensure text is always visible */
          .glass-input {
            -webkit-text-fill-color: ${colors.text.primary} !important;
            -webkit-opacity: 1 !important;
          }
          
          .glass-input:disabled {
            -webkit-text-fill-color: ${colors.text.secondary} !important;
          }
        `}
      </style>
      
      <div style={containerStyles} className={className}>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          style={inputStyles}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="glass-input"
        />
        
        {/* Enhanced focus indicator */}
        {focused && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: spacing.lg,
              right: spacing.lg,
              height: '3px',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
              borderRadius: '2px',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)',
            }}
          />
        )}
      </div>
    </>
  );
};