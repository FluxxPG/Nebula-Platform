import React from 'react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string | number;
}

interface GlassNavigationProps {
  items: NavItem[];
  onItemClick?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'primary' | 'minimal';
  className?: string;
}

export const GlassNavigation: React.FC<GlassNavigationProps> = ({
  items,
  onItemClick,
  orientation = 'horizontal',
  variant = 'primary',
  className = '',
}) => {
  const navStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: spacing.xs,
    padding: variant === 'primary' ? spacing.sm : 0,
    background: variant === 'primary' ? colors.glass.primary : 'transparent',
    border: variant === 'primary' ? `1px solid ${colors.border.light}` : 'none',
    borderRadius: variant === 'primary' ? borderRadius.xl : 0,
    backdropFilter: variant === 'primary' ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: variant === 'primary' ? 'blur(20px)' : 'none',
    boxShadow: variant === 'primary' ? shadows.glass : 'none',
    width: orientation === 'horizontal' ? 'fit-content' : '100%',
  };

  const itemBaseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: colors.text.secondary,
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  };

  const activeItemStyles: React.CSSProperties = {
    background: colors.gradients.primary,
    color: colors.text.primary,
    boxShadow: shadows.soft,
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: colors.gradients.accent,
    color: colors.text.primary,
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: borderRadius.full,
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.soft,
  };

  return (
    <>
      <style>
        {animations.keyframes.pulse}
      </style>
      
      <nav style={navStyles} className={`glass-navigation ${className}`}>
        {items.map((item) => (
          <button
            key={item.id}
            style={{
              ...itemBaseStyles,
              ...(item.active ? activeItemStyles : {}),
            }}
            onClick={() => onItemClick?.(item.id)}
            onMouseEnter={(e) => {
              if (!item.active) {
                e.currentTarget.style.background = colors.glass.secondary;
                e.currentTarget.style.color = colors.text.primary;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = colors.text.secondary;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {item.icon && (
              <span style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            
            {/* Badge */}
            {item.badge && (
              <div style={badgeStyles}>
                {item.badge}
              </div>
            )}
            
            {/* Active indicator */}
            {item.active && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};