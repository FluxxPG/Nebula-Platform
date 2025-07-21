import React, { useState, useRef } from 'react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface GlassSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const GlassSlider: React.FC<GlassSliderProps> = ({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  className = '',
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((sliderValue - min) / (max - min)) * 100;

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
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.text.primary,
  };

  const valueStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.secondary,
    background: colors.glass.primary,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.border.light}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const trackStyles: React.CSSProperties = {
    position: 'relative',
    height: '8px',
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.full,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const fillStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${percentage}%`,
    background: colors.gradients.primary,
    borderRadius: borderRadius.full,
    transition: isDragging ? 'none' : `width ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const thumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: `${percentage}%`,
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: `2px solid ${colors.border.medium}`,
    borderRadius: borderRadius.full,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: isDragging ? shadows.glassHover : shadows.glass,
    cursor: disabled ? 'not-allowed' : 'grab',
    transition: isDragging ? 'none' : `all ${animations.duration.normal} ${animations.easing.smooth}`,
    scale: isDragging ? '1.2' : '1',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round(((percentage / 100) * (max - min) + min) / step) * step;
    
    setSliderValue(newValue);
    onChange?.(newValue);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div style={containerStyles} className={className}>
      {(label || showValue) && (
        <div style={headerStyles}>
          {label && <span style={labelStyles}>{label}</span>}
          {showValue && <span style={valueStyles}>{sliderValue}</span>}
        </div>
      )}
      
      <div
        ref={sliderRef}
        style={trackStyles}
        onMouseDown={handleMouseDown}
      >
        <div style={fillStyles} />
        <div style={thumbStyles} />
      </div>
    </div>
  );
};