import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface BentoGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 12,
  gap = 'md',
  className = '',
}) => {
  const gaps = {
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gaps[gap],
    width: '100%',
  };

  return (
    <>
      <style>
        {`
          .bento-grid {
            display: grid;
            gap: ${gaps[gap]};
            width: 100%;
          }
          
          /* Responsive grid columns */
          @media (min-width: 1280px) {
            .bento-grid {
              grid-template-columns: repeat(${columns}, 1fr);
            }
          }
          
          @media (max-width: 1279px) and (min-width: 1024px) {
            .bento-grid {
              grid-template-columns: repeat(${Math.min(columns, 8)}, 1fr);
            }
          }
          
          @media (max-width: 1023px) and (min-width: 768px) {
            .bento-grid {
              grid-template-columns: repeat(${Math.min(columns, 6)}, 1fr);
            }
          }
          
          @media (max-width: 767px) and (min-width: 640px) {
            .bento-grid {
              grid-template-columns: repeat(${Math.min(columns, 4)}, 1fr);
            }
          }
          
          @media (max-width: 639px) {
            .bento-grid {
              grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
            }
          }
          
          @media (max-width: 480px) {
            .bento-grid {
              grid-template-columns: 1fr;
              gap: ${spacing.md};
            }
          }
        `}
      </style>
      <div className={`bento-grid ${className}`}>
        {children}
      </div>
    </>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  span?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  span = 1,
  variant = 'primary',
  padding = 'lg',
  hoverable = true,
  animated = true,
  className = '',
  onClick,
}) => {
  const colors = useThemeColors();

  const baseStyles: React.CSSProperties = {
    gridColumn: `span ${span}`,
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
    accent: {
      background: colors.gradients.accent,
      boxShadow: shadows.glass,
    },
    elevated: {
      background: colors.gradients.neutral,
      boxShadow: shadows.glassHover,
    },
  };

  const paddings = {
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
    xl: spacing['2xl'],
  };

  const cardStyles = {
    ...baseStyles,
    ...variants[variant],
    padding: paddings[padding],
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
        {`
          .bento-card {
            /* Responsive span adjustments */
            grid-column: span ${span};
          }
          
          @media (max-width: 1023px) {
            .bento-card {
              grid-column: span ${Math.min(span, 6)};
            }
          }
          
          @media (max-width: 767px) {
            .bento-card {
              grid-column: span ${Math.min(span, 4)};
            }
          }
          
          @media (max-width: 639px) {
            .bento-card {
              grid-column: span ${Math.min(span, 2)};
            }
          }
          
          @media (max-width: 480px) {
            .bento-card {
              grid-column: span 1;
              padding: ${spacing.lg} !important;
            }
          }
        `}
      </style>
      <div
        style={cardStyles}
        className={`bento-card ${className}`}
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
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
};