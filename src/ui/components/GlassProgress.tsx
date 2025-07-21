import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { solidColors } from '../tokens/colors';

interface GlassProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  animated?: boolean;
  showValue?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'linear',
  animated = true,
  showValue = false,
  label,
  color = 'primary',
  className = '',
}) => {
  const colors = useThemeColors();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorConfig = {
    primary: {
      gradient: colors.gradients.primary,
      solid: solidColors.primary[500],
    },
    success: {
      gradient: solidColors.success.gradient,
      solid: solidColors.success[500],
    },
    warning: {
      gradient: solidColors.warning.gradient,
      solid: solidColors.warning[500],
    },
    error: {
      gradient: solidColors.error.gradient,
      solid: solidColors.error[500],
    },
    info: {
      gradient: solidColors.info.gradient,
      solid: solidColors.info[500],
    },
  };

  if (variant === 'circular') {
    const sizes = {
      sm: { size: 80, strokeWidth: 6 },
      md: { size: 100, strokeWidth: 8 },
      lg: { size: 120, strokeWidth: 10 },
    };

    const { size: circleSize, strokeWidth } = sizes[size];
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.lg,
    };

    const circleContainerStyles: React.CSSProperties = {
      position: 'relative',
      width: `${circleSize}px`,
      height: `${circleSize}px`,
    };

    const svgStyles: React.CSSProperties = {
      transform: 'rotate(-90deg)',
      filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.2))',
    };

    const backgroundCircleStyles = {
      fill: 'none',
      stroke: colors.glass.secondary,
      strokeWidth,
      backdropFilter: 'blur(10px)',
    };

    const progressCircleStyles = {
      fill: 'none',
      stroke: `url(#progressGradient-${color})`,
      strokeWidth,
      strokeLinecap: 'round' as const,
      strokeDasharray: circumference,
      strokeDashoffset,
      transition: animated ? `stroke-dashoffset ${animations.duration.slow} ${animations.easing.smooth}` : 'none',
      filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))',
    };

    const centerTextStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : '1.5rem',
      fontWeight: '800',
      color: colors.text.primary,
      textAlign: 'center',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    };

    return (
      <div style={containerStyles} className={className}>
        {label && (
          <span style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: colors.text.primary,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}>
            {label}
          </span>
        )}
        
        <div style={circleContainerStyles}>
          <svg width={circleSize} height={circleSize} style={svgStyles}>
            <defs>
              <linearGradient id={`progressGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorConfig[color].solid} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorConfig[color].solid} stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              style={backgroundCircleStyles}
            />
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              style={progressCircleStyles}
            />
          </svg>
          
          {showValue && (
            <div style={centerTextStyles}>
              {Math.round(percentage)}%
            </div>
          )}
        </div>
      </div>
    );
  }

  // Linear progress
  const heights = {
    sm: '8px',
    md: '12px',
    lg: '16px',
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '700',
    color: colors.text.primary,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  };

  const valueStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '800',
    color: colors.text.primary,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  };

  const trackStyles: React.CSSProperties = {
    position: 'relative',
    height: heights[size],
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.full,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const fillStyles: React.CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    background: colorConfig[color].gradient,
    borderRadius: borderRadius.full,
    transition: animated ? `width ${animations.duration.slow} ${animations.easing.smooth}` : 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 0 20px ${colorConfig[color].solid}40`,
  };

  const shimmerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    animation: animated ? `shimmer 2s infinite ${animations.easing.smooth}` : 'none',
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      
      <div style={containerStyles} className={className}>
        {(label || showValue) && (
          <div style={headerStyles}>
            {label && <span style={labelStyles}>{label}</span>}
            {showValue && <span style={valueStyles}>{Math.round(percentage)}%</span>}
          </div>
        )}
        
        <div style={trackStyles}>
          <div style={fillStyles}>
            <div style={shimmerStyles} />
          </div>
        </div>
      </div>
    </>
  );
};