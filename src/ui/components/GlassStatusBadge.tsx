import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '..';
import { solidColors } from '../tokens/colors';

interface GlassStatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'expired' | 'warning' | 'success' | 'error' | 'info' | 'lost';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'glass';
  className?: string;
  id?: string;
}

export const GlassStatusBadge: React.FC<GlassStatusBadgeProps> = ({
  status,
  label,
  id,
  size = 'md',
  variant = 'glass',
  className = '',
}) => {
  const colors = useThemeColors();

  const statusConfig = {
    active: {
      color: solidColors.success[500],
      background: colors.gradients.success,
      gradient: solidColors.success.gradient,
      label: 'Active',
      textColor: '#ffffff', // Pure white for maximum contrast
    },
    inactive: {
      color: '#6b7280',
      background: 'rgba(107, 114, 128, 0.2)',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
      label: 'Inactive',
      textColor: '#ffffff', // Pure white
    },
    pending: {
      color: solidColors.warning[500],
      background: colors.gradients.warning,
      gradient: solidColors.warning.gradient,
      label: 'Pending',
      textColor: '#ffffff', // Pure white
    },
    expired: {
      color: solidColors.error[500],
      background: colors.gradients.error,
      gradient: solidColors.error.gradient,
      label: 'Expired',
      textColor: '#ffffff', // Pure white
    },
    warning: {
      color: solidColors.warning[500],
      background: colors.gradients.warning,
      gradient: solidColors.warning.gradient,
      label: 'Warning',
      textColor: '#ffffff', // Pure white
    },
    success: {
      color: solidColors.success[500],
      background: colors.gradients.success,
      gradient: solidColors.success.gradient,
      label: 'Success',
      textColor: '#ffffff', // Pure white
    },
    error: {
      color: solidColors.error[500],
      background: colors.gradients.error,
      gradient: solidColors.error.gradient,
      label: 'Error',
      textColor: '#ffffff', // Pure white
    },
    info: {
      color: solidColors.info[500], // Using Nebula brand color
      background: colors.gradients.info, // Using Nebula brand gradient
      gradient: solidColors.info.gradient, // Using Nebula brand gradient
      label: 'Info',
      textColor: '#ffffff', // Pure white
    },
    lost: {
      color: '#dc2626',
      background: 'rgba(220, 38, 38, 0.2)',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      label: 'Lost',
      textColor: '#ffffff', // Pure white
    },
  };

  const sizes = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '0.75rem',
      dotSize: '6px',
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '0.875rem',
      dotSize: '8px',
    },
    lg: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '1rem',
      dotSize: '10px',
    },
  };

  const config = statusConfig[status];
  const sizeConfig = sizes[size];

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: sizeConfig.padding,
    borderRadius: borderRadius.full,
    fontSize: sizeConfig.fontSize,
    fontWeight: '800', // Increased font weight for better visibility
    whiteSpace: 'nowrap',
    letterSpacing: '0.025em', // Slight letter spacing for clarity
  };

  const variantStyles = {
    solid: {
      background: config.gradient,
      color: config.textColor, // Always white for solid badges
      border: 'none',
      boxShadow: `0 4px 20px ${config.color}40, 0 0 0 1px rgba(255, 255, 255, 0.1)`,
    },
    outline: {
      background: 'transparent',
      color: config.textColor, // White text for outline badges too
      border: `2px solid ${config.color}`,
      boxShadow: `0 0 20px ${config.color}30`,
    },
    glass: {
      background: config.gradient, // Use gradient instead of transparent background
      color: config.textColor, // White text for glass badges
      border: `1px solid ${config.color}80`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: `${shadows.soft}, 0 0 30px ${config.color}25, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    },
  };

  const badgeStyles = {
    ...baseStyles,
    ...variantStyles[variant],
  };

  const dotStyles: React.CSSProperties = {
    width: sizeConfig.dotSize,
    height: sizeConfig.dotSize,
    borderRadius: '50%',
    background: variant === 'solid' || variant === 'glass'
      ? 'rgba(255, 255, 255, 0.9)' // White dot for solid and glass variants
      : config.gradient, // Gradient dot for outline variant
    flexShrink: 0,
    boxShadow: variant !== 'outline'
      ? '0 1px 3px rgba(0, 0, 0, 0.4)'
      : `0 0 12px ${config.color}60`,
    border: variant === 'solid' || variant === 'glass'
      ? '1px solid rgba(255, 255, 255, 0.3)'
      : 'none',
  };

  return (
    <>
      <style>
        {`
          .glass-status-badge {
            /* Ensure text is always visible and crisp */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          
          .glass-status-badge:hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: ${variantStyles[variant].boxShadow}, 0 6px 25px ${config.color}50 !important;
          }
          
          /* Ensure maximum contrast in all scenarios */
          .glass-status-badge .badge-text {
            color: ${config.textColor} !important;
            font-weight: 800 !important;
          }
          
          .glass-status-badge .badge-dot {
            box-shadow: ${variant !== 'outline'
            ? '0 1px 3px rgba(0, 0, 0, 0.4)'
            : `0 0 12px ${config.color}60`} !important;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .glass-status-badge {
              background: ${config.color} !important;
              color: white !important;
              border: 2px solid white !important;
              text-shadow: none !important;
            }
            
            .glass-status-badge .badge-text {
              color: white !important;
              text-shadow: none !important;
              font-weight: 900 !important;
            }
            
            .glass-status-badge .badge-dot {
              background: white !important;
              border: 1px solid ${config.color} !important;
            }
          }
          
          /* Ensure visibility on all backgrounds */
          .glass-status-badge {
            position: relative;
            z-index: 1;
          }
          
          .glass-status-badge::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            background: ${config.gradient};
            border-radius: inherit;
            z-index: -1;
            opacity: 0.9;
          }
          
          /* Enhanced visibility for small sizes */
          .glass-status-badge.size-sm .badge-text {
            font-weight: 900 !important;
          }
          
          /* Ensure proper contrast ratios */
          .glass-status-badge {
            min-contrast: 4.5;
          }
        `}
      </style>

      <span
        style={badgeStyles}
        id={id}
        className={`glass-status-badge size-${size} ${className}`}
      >
        <span style={dotStyles} className="badge-dot" />
        <span className="badge-text">{label || config.label}</span>
      </span>
    </>
  );
};
