import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface GlassTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const GlassTooltip: React.FC<GlassTooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 500,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, position]);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    left: `${tooltipPosition.x}px`,
    top: `${tooltipPosition.y}px`,
    padding: `${spacing.sm} ${spacing.md}`,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.md,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glassHover,
    fontSize: '0.875rem',
    color: colors.text.primary,
    whiteSpace: 'nowrap',
    zIndex: 1000,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    pointerEvents: 'none',
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    transform: 'rotate(45deg)',
    ...(position === 'top' && {
      bottom: '-5px',
      left: '50%',
      marginLeft: '-4px',
      borderTop: 'none',
      borderLeft: 'none',
    }),
    ...(position === 'bottom' && {
      top: '-5px',
      left: '50%',
      marginLeft: '-4px',
      borderBottom: 'none',
      borderRight: 'none',
    }),
    ...(position === 'left' && {
      right: '-5px',
      top: '50%',
      marginTop: '-4px',
      borderTop: 'none',
      borderLeft: 'none',
    }),
    ...(position === 'right' && {
      left: '-5px',
      top: '50%',
      marginTop: '-4px',
      borderBottom: 'none',
      borderRight: 'none',
    }),
  };

  return (
    <>
      <style>
        {animations.keyframes.fadeIn}
        {animations.keyframes.scaleIn}
      </style>
      
      <div
        ref={triggerRef}
        style={containerStyles}
        className={className}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>

      <div ref={tooltipRef} style={tooltipStyles}>
        {content}
        <div style={arrowStyles} />
      </div>
    </>
  );
};