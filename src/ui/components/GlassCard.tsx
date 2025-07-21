import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  animated?: boolean;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'primary',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
  animated = true,
  style = {},
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
    transition: animated ? `all ${animations.duration.normal} ${animations.easing.smooth}` : 'none',
    cursor: onClick ? 'pointer' : 'default',
  };

  const variants = {
    primary: {
      background: colors.glass.primary,
      boxShadow: shadows.glass,
    },
    secondary: {
      background: colors.glass.secondary,
      boxShadow: shadows.soft,
    },
    elevated: {
      background: colors.gradients.neutral,
      boxShadow: shadows.glassHover,
    },
  };

  const paddings = {
    sm: spacing.lg,
    md: spacing.xl,
    lg: spacing.xl,
    xl: spacing['2xl'],
  };

  const cardStyles = {
    ...baseStyles,
    ...variants[variant],
    padding: paddings[padding],
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((hoverable || onClick) && animated) {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
      e.currentTarget.style.boxShadow = shadows.glassHover;
      e.currentTarget.style.borderColor = colors.border.medium;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((hoverable || onClick) && animated) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = variants[variant].boxShadow;
      e.currentTarget.style.borderColor = colors.border.light;
    }
  };

  return (
    <>
      <style>
        {animations.keyframes.float}
        {`
          @keyframes cardGlow {
            0%, 100% { box-shadow: ${shadows.glass}; }
            50% { box-shadow: ${shadows.glassHover}; }
          }
          
          .glass-card-floating {
            animation: float 6s ease-in-out infinite;
          }
          
          .glass-card-glowing {
            animation: cardGlow 3s ease-in-out infinite;
          }
          
          /* Theme-aware styles */
          .glass-card {
            background: ${colors.glass.primary};
            border-color: ${colors.border.light};
            color: ${colors.text.primary};
          }
          
          .glass-card.secondary {
            background: ${colors.glass.secondary};
          }
          
          .glass-card.elevated {
            background: ${colors.gradients.neutral};
          }
          
          .glass-card:hover {
            border-color: ${colors.border.medium};
          }
        `}
      </style>
      
      <div
        style={cardStyles}
        className={`glass-card ${variant} ${className}`}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced inner glow effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            borderRadius: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
          }}
        />
        
        {/* Side glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            borderRadius: `${borderRadius.xl} 0 0 ${borderRadius.xl}`,
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
};