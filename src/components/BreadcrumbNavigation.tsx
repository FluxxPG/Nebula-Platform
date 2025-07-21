import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows, animations } from '../ui';
import { GlassButton } from '../ui/components';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  showBackButton = false,
  onBackClick,
  className = '',
}) => {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // SMART TEXT COLOR HELPER
  const getSmartTextColor = (type: 'primary' | 'secondary' | 'violet' = 'primary') => {
    if (theme === 'light') {
      switch (type) {
        case 'primary':
          return 'rgba(30, 30, 30, 0.95)';
        case 'secondary':
          return 'rgba(60, 60, 60, 0.85)';
        case 'violet':
          return 'rgba(94, 57, 164, 0.95)';
        default:
          return 'rgba(30, 30, 30, 0.95)';
      }
    } else {
      switch (type) {
        case 'primary':
          return 'rgba(255, 255, 255, 0.98)';
        case 'secondary':
          return 'rgba(255, 255, 255, 0.8)';
        case 'violet':
          return 'rgba(168, 85, 247, 0.95)';
        default:
          return 'rgba(255, 255, 255, 0.98)';
      }
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.lg} ${spacing.xl}`,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    marginTop: spacing.xl, // Added top margin for spacing from header
    marginBottom: spacing.xl,
    marginLeft: "-80px",
    flexWrap: 'wrap',
    minHeight: '64px',
    width: '112%', // Ensure full width
  };

  const backButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    color: getSmartTextColor('secondary'),
    flexShrink: 0,
  };

  const breadcrumbListStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0, // Allow flex items to shrink
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingBottom: '2px', // Prevent scrollbar cutoff
  };

  const breadcrumbItemStyles = (item: BreadcrumbItem, isLast: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    cursor: item.onClick && !isLast ? 'pointer' : 'default',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    background: isLast ? colors.glass.secondary : 'transparent',
    border: isLast ? `1px solid ${colors.border.light}` : '1px solid transparent',
    color: isLast ? 'white' : getSmartTextColor('secondary'), // Always white for active items
    fontWeight: isLast ? '700' : '500',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  });

  const separatorStyles: React.CSSProperties = {
    color: getSmartTextColor('secondary'),
    opacity: 0.6,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
  };

  const iconStyles: React.CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick && !item.isActive) {
      item.onClick();
    }
  };

  return (
    <>
      <style>
        {`
          .breadcrumb-container {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
          }
          
          .breadcrumb-container:hover {
            background: ${colors.glass.secondary} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .breadcrumb-item:hover:not(.active) {
            background: ${colors.glass.primary} !important;
            color: ${getSmartTextColor('primary')} !important;
            transform: translateY(-1px) !important;
          }
          
          .breadcrumb-item.active {
            background: ${colors.gradients.primary} !important;
            box-shadow: ${shadows.soft} !important;
            color: white !important;
          }
          
          .breadcrumb-item.active * {
            color: white !important;
          }
          
          .breadcrumb-item.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 1px;
          }
          
          .breadcrumb-back-btn:hover {
            background: ${colors.glass.primary} !important;
            color: ${getSmartTextColor('primary')} !important;
            transform: translateX(-2px) scale(1.05) !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .breadcrumb-list {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .breadcrumb-list::-webkit-scrollbar {
            display: none !important;
          }
          
          /* Enhanced hover effects for clickable items */
          .breadcrumb-item.clickable:hover {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.medium} !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          
          .breadcrumb-item.clickable:active {
            transform: translateY(0) !important;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .breadcrumb-container {
              padding: ${spacing.md} ${spacing.lg} !important;
              gap: ${spacing.sm} !important;
              min-height: 56px !important;
            }
            
            .breadcrumb-item {
              padding: ${spacing.xs} ${spacing.sm} !important;
              font-size: 0.8rem !important;
            }
            
            .breadcrumb-back-btn {
              width: 36px !important;
              height: 36px !important;
            }
          }
          
          @media (max-width: 480px) {
            .breadcrumb-container {
              padding: ${spacing.sm} ${spacing.md} !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: ${spacing.md} !important;
              min-height: auto !important;
            }
            
            .breadcrumb-list {
              width: 100% !important;
              justify-content: flex-start !important;
            }
            
            .breadcrumb-item {
              font-size: 0.75rem !important;
            }
          }
          
          /* Animation for new breadcrumb items */
          @keyframes breadcrumbSlideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .breadcrumb-item {
            animation: breadcrumbSlideIn 0.3s ease-out;
          }
          
          /* Enhanced visual feedback */
          .breadcrumb-separator {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
          }
          
          .breadcrumb-container:hover .breadcrumb-separator {
            color: ${getSmartTextColor('primary')} !important;
            opacity: 0.8 !important;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .breadcrumb-item {
              border: 2px solid ${colors.border.medium} !important;
              font-weight: 700 !important;
            }
            
            .breadcrumb-item.active {
              border: 2px solid white !important;
            }
          }
          
          /* Focus management for accessibility */
          .breadcrumb-item:focus-visible,
          .breadcrumb-back-btn:focus-visible {
            outline: 2px solid rgba(74, 45, 133, 0.5);
            outline-offset: 2px;
          }
          
          /* Smooth transitions for theme changes */
          .breadcrumb-container,
          .breadcrumb-item,
          .breadcrumb-back-btn {
            transition: all ${animations.duration.normal} ${animations.easing.smooth}, 
                        background 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease !important;
          }
        `}
      </style>

      <div
        style={containerStyles}
        className={`breadcrumb-container ${className}`}
        aria-label="Breadcrumb navigation"
      >
        {/* Back Button */}
        {showBackButton && onBackClick && (
          <button
            style={backButtonStyles}
            onClick={onBackClick}
            className="breadcrumb-back-btn"
            title={t('common.back')}
            aria-label={t('common.back')}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Breadcrumb List */}
        <div style={breadcrumbListStyles} className="breadcrumb-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isClickable = item.onClick && !isLast;

            return (
              <React.Fragment key={item.id}>
                {/* Breadcrumb Item */}
                <div
                  style={breadcrumbItemStyles(item, isLast)}
                  onClick={() => handleItemClick(item)}
                  className={`breadcrumb-item ${isLast ? 'active ' : ''} ${isClickable ? 'clickable ' : ''}`}
                  role={isClickable ? 'button' : 'text'}
                  tabIndex={isClickable ? 0 : -1}
                  aria-current={isLast ? 'page' : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                  title={isClickable ? `${t('nav.backTo', { destination: item.label })}` : item.label}
                >
                  {/* Icon */}
                  {item.icon && (
                    <span style={iconStyles}>
                      {React.cloneElement(item.icon as React.ReactElement, {
                        size: 16,
                        style: {
                          color: 'currentColor',
                          flexShrink: 0,
                        }
                      })}
                    </span>
                  )}

                  {/* Label */}
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px',

                  }}>

                    {item.label}
                  </span>

                  {/* Active indicator glow */}
                  {isLast && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(74, 45, 133, 0.1) 0%, rgba(106, 64, 152, 0.1) 100%)',
                      borderRadius: 'inherit',
                      pointerEvents: 'none',

                      zIndex: -1,
                    }} />
                  )}

                </div>

                {/* Separator */}
                {!isLast && (
                  <div style={separatorStyles} className="breadcrumb-separator" aria-hidden="true">
                    <ChevronRight size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};
