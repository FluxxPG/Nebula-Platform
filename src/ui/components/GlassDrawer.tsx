import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right';
  width?: string;
  className?: string;
}

export const GlassDrawer: React.FC<GlassDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  width = '400px',
  className = '',
}) => {
  const colors = useThemeColors();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    backdropFilter: 'blur(12px)', // Increased blur
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 999999, // Extremely high z-index
    animation: 'fadeIn 0.3s ease-out',
  };

  const drawerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    [position]: 0,
    bottom: 0,
    width,
    maxWidth: '90vw',
    background: colors.glass.primary,
    border: `2px solid ${colors.border.medium}`,
    borderRadius: position === 'left' ? `0 ${borderRadius.xl} ${borderRadius.xl} 0` : `${borderRadius.xl} 0 0 ${borderRadius.xl}`,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    boxShadow: shadows.modal,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000000, // Highest z-index for drawer content
    transform: isOpen 
      ? 'translateX(0)' 
      : `translateX(${position === 'left' ? '-100%' : '100%'})`,
    transition: `transform ${animations.duration.normal} ${animations.easing.smooth}`,
    animation: `slideIn${position === 'left' ? 'Left' : 'Right'} 0.3s ease-out`,
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: colors.glass.secondary,
    flexShrink: 0,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.text.primary,
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const closeButtonStyles: React.CSSProperties = {
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    transition: 'all 0.2s ease',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.xl,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    background: colors.glass.primary,
  };

  // Render drawer using React Portal to ensure it's at the application level
  const drawerContent = (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { 
              opacity: 0;
              transform: translateX(100%);
            }
            to { 
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInLeft {
            from { 
              opacity: 0;
              transform: translateX(-100%);
            }
            to { 
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .glass-drawer-content {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .glass-drawer-content::-webkit-scrollbar {
            display: none !important;
          }
          
          .glass-drawer-overlay {
            z-index: 999999 !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
          }
          
          .glass-drawer-container {
            z-index: 1000000 !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
            position: fixed !important;
          }
          
          .glass-drawer-close:hover {
            background: ${colors.glass.primary} !important;
            transform: scale(1.1) !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          /* Ensure drawer is above everything including navigation */
          .glass-drawer-overlay,
          .glass-drawer-container {
            z-index: 999999 !important;
          }
          
          .glass-drawer-container {
            z-index: 1000000 !important;
          }
          
          /* Prevent any parent containers from affecting positioning */
          .glass-drawer-overlay * {
            position: relative;
          }
          
          .glass-drawer-container {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
          }
          
          @media (max-width: 768px) {
            .glass-drawer-container {
              width: 100vw !important;
              max-width: 100vw !important;
              border-radius: 0 !important;
              ${position}: 0 !important;
            }
          }
          
          /* Override any parent z-index constraints */
          body.drawer-open {
            overflow: hidden !important;
          }
          
          /* Ensure proper stacking context */
          .glass-drawer-overlay {
            isolation: isolate;
          }
        `}
      </style>
      
      <div
        style={overlayStyles}
        className="glass-drawer-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div style={drawerStyles} className={`glass-drawer glass-drawer-container ${className}`}>
          {title && (
            <div style={headerStyles}>
              <h2 style={titleStyles}>{title}</h2>
              <button
                style={closeButtonStyles}
                onClick={onClose}
                className="glass-drawer-close"
              >
                <X size={20} />
              </button>
            </div>
          )}
          
          <div style={contentStyles} className="glass-drawer-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Use createPortal to render at document.body level
  return createPortal(drawerContent, document.body);
};