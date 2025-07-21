import React, { useState } from 'react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface GlassToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const GlassToggle: React.FC<GlassToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const sizes = {
    sm: { width: '36px', height: '20px', thumbSize: '16px' },
    md: { width: '44px', height: '24px', thumbSize: '20px' },
    lg: { width: '52px', height: '28px', thumbSize: '24px' },
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const toggleStyles: React.CSSProperties = {
    position: 'relative',
    width: sizes[size].width,
    height: sizes[size].height,
    background: isChecked ? colors.gradients.primary : colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.full,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    boxShadow: isChecked ? shadows.glassHover : shadows.glass,
  };

  const thumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: isChecked ? `calc(100% - ${sizes[size].thumbSize} - 2px)` : '2px',
    width: sizes[size].thumbSize,
    height: sizes[size].thumbSize,
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.full,
    transition: `all ${animations.duration.normal} ${animations.easing.bounce}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: size === 'sm' ? '0.875rem' : '1rem',
    fontWeight: '500',
    color: colors.text.primary,
  };

  const handleToggle = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onChange?.(newChecked);
    }
  };

  return (
    <div style={containerStyles} className={className} onClick={handleToggle}>
      <div style={toggleStyles}>
        <div style={thumbStyles} />
      </div>
      {label && <span style={labelStyles}>{label}</span>}
    </div>
  );
};