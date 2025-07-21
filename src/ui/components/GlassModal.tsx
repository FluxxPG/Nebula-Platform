import React, { useEffect } from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '..';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  customPosition?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
    width?: string;
  };
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  customPosition,
}) => {
  const colors = useThemeColors(); // Now using theme colors!

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
    background: customPosition ? 'transparent' : 'rgba(0, 0, 0, 0.8)',
    backdropFilter: customPosition ? 'none' : 'blur(20px)',
    WebkitBackdropFilter: customPosition ? 'none' : 'blur(20px)',
    display: 'flex',
    alignItems: customPosition ? 'flex-start' : 'center',
    justifyContent: customPosition ? 'flex-start' : 'center',
    padding: customPosition ? 0 : spacing.xl,
    zIndex: 99999,
    animation: 'fadeIn 0.3s ease-out',
  };

  const modalStyles: React.CSSProperties = {
    width: customPosition ? 'auto' : '100%',
    maxWidth: customPosition ? (customPosition.width || 'none') : '600px',
    maxHeight: customPosition ? 'none' : '90vh',
    // THEME-AWARE BACKGROUND WITH ENHANCED VISIBILITY
    background: customPosition 
      ? colors.glass.primary // Use theme colors for positioned modals
      : colors.glass.primary,
    border: `2px solid ${colors.border.medium}`,
    borderRadius: borderRadius['2xl'],
    // ENHANCED BLUR FOR BETTER TEXT SEPARATION
    backdropFilter: customPosition ? 'blur(40px)' : 'blur(40px)',
    WebkitBackdropFilter: customPosition ? 'blur(40px)' : 'blur(40px)',
    boxShadow: customPosition 
      ? `${shadows.modal}, 0 0 0 1px ${colors.border.light}` 
      : shadows.modal,
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease-out',
    zIndex: 100000,
    ...(customPosition && {
      position: 'absolute',
      ...customPosition,
    }),
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: colors.glass.secondary, // Theme-aware header background
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: colors.text.primary, // Theme-aware text color
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    fontSize: '1.5rem',
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
    padding: customPosition ? 0 : spacing.xl,
    overflowY: 'auto',
    maxHeight: customPosition ? '70vh' : 'calc(90vh - 120px)',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    background: colors.glass.primary, // Theme-aware content background
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(-30px) scale(0.9);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .glass-modal-content {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .glass-modal-content::-webkit-scrollbar {
            display: none !important;
          }
          
          .glass-modal-overlay {
            z-index: 99999 !important;
          }
          
          .glass-modal-container {
            z-index: 100000 !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
          }
          
          .glass-modal-close:hover {
            background: ${colors.glass.primary} !important;
            transform: scale(1.1) !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          /* Theme-aware positioned modal styling */
          .glass-modal-positioned {
            background: ${colors.glass.primary} !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
            border: 2px solid ${colors.border.medium} !important;
          }
          
          /* Enhanced text visibility for all themes */
          .glass-modal-positioned * {
            color: ${colors.text.primary} !important;
          }
          
          /* Theme-aware search modal content */
          .glass-modal-positioned .search-modal-content {
            background: ${colors.glass.secondary} !important;
          }
          
          /* Enhanced visibility for search results with theme colors */
          .glass-modal-positioned .search-result-item {
            background: ${colors.glass.secondary} !important;
            border: 1px solid ${colors.border.light} !important;
            color: ${colors.text.primary} !important;
          }
          
          .glass-modal-positioned .search-result-item:hover {
            background: ${colors.glass.primary} !important;
            border-color: ${colors.border.medium} !important;
            transform: translateX(6px) !important;
          }
          
          .glass-modal-positioned .search-result-item.selected {
            background: rgba(74, 45, 133, 0.3) !important;
            border-color: rgba(74, 45, 133, 0.6) !important;
          }
          
          /* Theme-aware search info section */
          .glass-modal-positioned .search-info {
            background: ${colors.glass.primary} !important;
            border-bottom: 1px solid ${colors.border.light} !important;
            color: ${colors.text.primary} !important;
          }
          
          /* Enhanced category badges with theme awareness */
          .glass-modal-positioned .category-badge {
            color: white !important;
            font-weight: 800 !important;
          }
          
          /* Theme-aware result text */
          .glass-modal-positioned .result-title {
            color: ${colors.text.primary} !important;
          }
          
          .glass-modal-positioned .result-subtitle {
            color: ${colors.text.secondary} !important;
          }
          
          /* No results and loading states */
          .glass-modal-positioned .no-results,
          .glass-modal-positioned .loading-state {
            color: ${colors.text.primary} !important;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .glass-modal-positioned {
              background: ${colors.glass.primary} !important;
              border: 3px solid ${colors.border.medium} !important;
            }
            
            .glass-modal-positioned * {
              text-shadow: none !important;
              font-weight: 700 !important;
            }
            
            .glass-modal-positioned .search-result-item {
              border: 2px solid ${colors.border.medium} !important;
            }
          }
          
          /* Ensure proper contrast in both themes */
          .glass-modal-positioned .search-result-item {
            min-contrast: 4.5;
          }
          
          /* Responsive modal styles for smaller screens */
          @media (max-width: 768px) {
            .glass-modal-container {
              width: 90% !important;
              max-width: 90% !important;
              margin: 0 auto !important;
            }
            
            .glass-modal-content {
              padding: ${spacing.lg} !important;
              max-height: 70vh !important;
            }
            
            .glass-modal-header {
              padding: ${spacing.lg} !important;
            }
            
            .glass-modal-title {
              font-size: 1.25rem !important;
            }
          }
          
          /* Even smaller screens */
          @media (max-width: 480px) {
            .glass-modal-container {
              width: 95% !important;
              max-width: 95% !important;
              border-radius: ${borderRadius.lg} !important;
            }
            
            .glass-modal-content {
              padding: ${spacing.md} !important;
              max-height: 65vh !important;
            }
            
            .glass-modal-header {
              padding: ${spacing.md} !important;
            }
            
            .glass-modal-title {
              font-size: 1.125rem !important;
            }
            
            .glass-modal-close {
              width: 36px !important;
              height: 36px !important;
            }
          }
          
          /* Fix for preferences modal on small screens */
          @media (max-height: 800px) {
            .preferences-modal .glass-modal-content {
              max-height: 60vh !important;
            }
          }
          
          /* Fix for very small screens */
          @media (max-height: 600px) {
            .preferences-modal .glass-modal-content {
              max-height: 50vh !important;
            }
          }
        `}
      </style>
      
      <div
        style={overlayStyles}
        className="glass-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && !customPosition) {
            onClose();
          }
        }}
      >
        <div 
          style={modalStyles} 
          className={`glass-modal glass-modal-container ${customPosition ? 'glass-modal-positioned' : ''} ${title === 'Preferences' ? 'preferences-modal' : ''} ${className}`}
        >
          {title && (
            <div style={headerStyles} className="glass-modal-header">
              <h2 style={titleStyles} className="glass-modal-title">{title}</h2>
              <button
                style={closeButtonStyles}
                onClick={onClose}
                className="glass-modal-close"
              >
                ×
              </button>
            </div>
          )}
          
          <div style={contentStyles} className="glass-modal-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};