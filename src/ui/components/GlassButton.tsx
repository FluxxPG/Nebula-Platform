import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { solidColors } from '../tokens/colors';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  id,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) => {
  const colors = useThemeColors();

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: colors.border.light,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.glass,
  };

  const variants = {
    primary: {
      background: colors.gradients.primary, // Using Nebula brand gradient
      color: 'white', // Always white text on primary
      boxShadow: `${shadows.glass}, 0 0 30px rgba(74, 45, 133, 0.3)`, // Using Nebula brand color
    },
    secondary: {
      background: colors.gradients.secondary, // Using Nebula brand gradient
      color: 'white', // Always white text on secondary
      boxShadow: `${shadows.glass}, 0 0 30px rgba(106, 64, 152, 0.3)`, // Using Nebula brand color
    },
    accent: {
      background: colors.gradients.accent, // Using Nebula brand gradient
      color: 'white', // Always white text on accent
      boxShadow: `${shadows.glass}, 0 0 30px rgba(74, 45, 133, 0.3)`, // Using Nebula brand color
    },
    ghost: {
      background: colors.glass.secondary,
      color: colors.text.secondary,
    },
    success: {
      background: solidColors.success.gradient,
      color: 'white',
      boxShadow: `${shadows.glass}, 0 0 30px rgba(34, 197, 94, 0.4)`,
    },
    warning: {
      background: solidColors.warning.gradient,
      color: 'white',
      boxShadow: `${shadows.glass}, 0 0 30px rgba(255, 152, 0, 0.4)`,
    },
    error: {
      background: solidColors.error.gradient,
      color: 'white',
      boxShadow: `${shadows.glass}, 0 0 30px rgba(244, 67, 54, 0.4)`,
    },
  };

  const sizes = {
    sm: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '0.875rem',
      height: '2.75rem',
    },
    md: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: '1rem',
      height: '3.25rem',
    },
    lg: {
      padding: `${spacing.xl} ${spacing['2xl']}`,
      fontSize: '1.125rem',
      height: '3.75rem',
    },
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.5 : 1,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  const spinnerStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: `2px solid ${colors.text.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: spacing.sm,
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      <button
        id={id}
        style={buttonStyles}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`glass-button ${className}`}
        type={type}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = `${shadows.glassHover}, 0 0 40px ${variant === 'primary' ? 'rgba(74, 45, 133, 0.5)' : variant === 'success' ? 'rgba(34, 197, 94, 0.5)' : variant === 'warning' ? 'rgba(255, 152, 0, 0.5)' : variant === 'error' ? 'rgba(244, 67, 54, 0.5)' : 'rgba(74, 45, 133, 0.3)'}`;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = variants[variant].boxShadow || shadows.glass;
          }
        }}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
          }
        }}
        onMouseUp={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          }
        }}
      >
        <span style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
        }}>
          {loading && <div style={spinnerStyles} />}
          {children}
        </span>

        {/* Enhanced glass reflection effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transition: `left ${animations.duration.slow} ${animations.easing.smooth}`,
            zIndex: 0,
          }}
          className="glass-shine"
        />

        {/* Pulse effect for loading state */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'pulse 1.5s infinite',
              zIndex: 0,
            }}
          />
        )}
      </button>
    </>
  );
};
