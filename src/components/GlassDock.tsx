import React, { useState } from 'react';
import { GripVertical, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Sliders } from 'lucide-react';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows, animations, GlassButton, GlassModal, GlassStatusBadge } from '../ui';
import { useTranslation } from 'react-i18next';

interface DockItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string | number;
}

export type DockPosition = 'left' | 'right' | 'bottom';
export type DockSize = 'small' | 'medium' | 'large';
export type IconSize = 'small' | 'medium' | 'large';

interface DockSettings {
  position: DockPosition;
  dockSize: DockSize;
  iconSize: IconSize;
  autoHide: boolean;
  showLabels: boolean;
}

interface GlassDockProps {
  items: DockItem[];
  onItemClick?: (id: string) => void;
  position?: DockPosition;
  dockSize?: DockSize;
  iconSize?: IconSize;
  autoHide?: boolean;
  showLabels?: boolean;
  onSettingsChange?: (settings: DockSettings) => void;
  className?: string;
}

export const GlassDock: React.FC<GlassDockProps> = ({
  items,
  onItemClick,
  position = 'bottom',
  dockSize = 'medium',
  iconSize = 'medium',
  autoHide = false,
  showLabels = true,
  onSettingsChange,
  className = '',
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // SMART TEXT COLOR HELPER
  const getSmartTextColor = (type: 'primary' | 'secondary' = 'primary') => {
    if (theme === 'light') {
      return type === 'primary' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(60, 60, 60, 0.85)';
    } else {
      return type === 'primary' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.8)';
    }
  };

  // Size configurations - ENHANCED FOR PROFESSIONAL LOOK
  const sizeConfigs = {
    small: {
      dock: { padding: spacing.lg, gap: spacing.md, borderRadius: '20px' },
      item: { width: '48px', height: '48px', borderRadius: '14px', margin: '4px' },
      icon: { small: 16, medium: 18, large: 20 },
      badge: { size: '18px', fontSize: '0.65rem', offset: '-6px' },
      tooltip: { fontSize: '0.75rem', padding: `${spacing.xs} ${spacing.sm}` },
      separator: { width: '2px', height: '28px', margin: '0 8px' },
    },
    medium: {
      dock: { padding: spacing.xl, gap: spacing.lg, borderRadius: '24px' },
      item: { width: '64px', height: '64px', borderRadius: '18px', margin: '6px' },
      icon: { small: 20, medium: 24, large: 28 },
      badge: { size: '22px', fontSize: '0.75rem', offset: '-8px' },
      tooltip: { fontSize: '0.875rem', padding: `${spacing.sm} ${spacing.md}` },
      separator: { width: '3px', height: '36px', margin: '0 12px' },
    },
    large: {
      dock: { padding: spacing['2xl'], gap: spacing.xl, borderRadius: '28px' },
      item: { width: '80px', height: '80px', borderRadius: '22px', margin: '8px' },
      icon: { small: 24, medium: 28, large: 32 },
      badge: { size: '26px', fontSize: '0.875rem', offset: '-10px' },
      tooltip: { fontSize: '1rem', padding: `${spacing.md} ${spacing.lg}` },
      separator: { width: '4px', height: '44px', margin: '0 16px' },
    },
  };

  const config = sizeConfigs[dockSize];
  const iconSizeValue = config.icon[iconSize];

  // Position-based styles with ENHANCED PROFESSIONAL DESIGN
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      padding: config.dock.padding,
      background: colors.glass.primary,
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: `2px solid ${colors.border.medium}`,
      borderRadius: config.dock.borderRadius,
      boxShadow: `${shadows.glassHover}, inset 0 1px 0 ${colors.border.light}, 0 0 60px rgba(0, 0, 0, 0.15)`,
      zIndex: 1000,
      transition: `all ${animations.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`, // SMOOTH PROFESSIONAL EASING
      overflow: 'visible',
    };

    switch (position) {
      case 'left':
        return {
          ...baseStyles,
          left: autoHide && !isHovered && !isVisible ? '-100px' : '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          gap: config.dock.gap,
          maxHeight: 'calc(100vh - 40px)',
        };
      case 'right':
        return {
          ...baseStyles,
          right: autoHide && !isHovered && !isVisible ? '-100px' : '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          gap: config.dock.gap,
          maxHeight: 'calc(100vh - 40px)',
        };
      case 'bottom':
      default:
        return {
          ...baseStyles,
          bottom: autoHide && !isHovered && !isVisible ? '-100px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          flexDirection: 'row',
          gap: config.dock.gap,
          maxWidth: 'calc(100vw - 40px)',
        };
    }
  };

  const itemBaseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: config.item.width,
    height: config.item.height,
    borderRadius: config.item.borderRadius,
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`, // PROFESSIONAL EASING
    transformOrigin: 'center',
    background: 'transparent',
    border: 'none',
    color: getSmartTextColor('secondary'),
    flexShrink: 0,
    overflow: 'visible',
    margin: config.item.margin,
  };

  const getItemStyles = (item: DockItem, isHovered: boolean) => {
    // PROFESSIONAL HOVER EFFECT - NO BOUNCE, SUBTLE SCALE
    const hoverScale = isHovered ? '1.1' : '1'; // REDUCED SCALE FOR PROFESSIONALISM
    const hoverTransform = position === 'bottom'
      ? `translateY(-4px) scale(${hoverScale})` // SUBTLE LIFT
      : position === 'left'
        ? `translateX(-4px) scale(${hoverScale})`
        : `translateX(4px) scale(${hoverScale})`;

    const baseTransform = isHovered ? hoverTransform : `scale(1)`;

    if (item.active) {
      return {
        ...itemBaseStyles,
        background: colors.gradients.primary, // Using Nebula brand gradient
        color: 'rgba(255, 255, 255, 0.95)', // ALWAYS WHITE FOR ACTIVE ITEMS
        boxShadow: isHovered
          ? `${shadows.glassHover}, 0 0 40px rgba(74, 45, 133, 0.6), 0 12px 32px rgba(74, 45, 133, 0.4)` // Using Nebula brand color
          : `${shadows.glass}, 0 0 30px rgba(74, 45, 133, 0.5)`, // Using Nebula brand color
        border: `2px solid ${colors.border.light}`,
        transform: baseTransform,
        zIndex: isHovered ? 100 : 10,
      };
    }

    return {
      ...itemBaseStyles,
      background: isHovered ? colors.glass.secondary : 'transparent',
      color: isHovered ? getSmartTextColor('primary') : getSmartTextColor('secondary'),
      boxShadow: isHovered
        ? `${shadows.glass}, 0 0 20px ${colors.border.light}`
        : 'none',
      border: isHovered ? `2px solid ${colors.border.light}` : '2px solid transparent',
      transform: baseTransform,
      zIndex: isHovered ? 100 : 1,
    };
  };

  const iconStyles: React.CSSProperties = {
    fontSize: `${iconSizeValue}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${animations.duration.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: config.badge.offset,
    right: config.badge.offset,
    background: colors.gradients.primary, // Using Nebula brand gradient
    color: 'white',
    fontSize: config.badge.fontSize,
    fontWeight: '800',
    padding: '4px 8px',
    borderRadius: borderRadius.full,
    minWidth: config.badge.size,
    height: config.badge.size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(74, 45, 133, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.2)', // Using Nebula brand color
    border: `2px solid ${colors.border.light}`,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    zIndex: 10,
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    [position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right']:
      position === 'bottom' ? '100%' : '100%',
    [position === 'bottom' ? 'left' : 'top']: position === 'bottom' ? '50%' : '50%',
    transform: position === 'bottom'
      ? 'translateX(-50%) translateY(-12px)'
      : position === 'left'
        ? 'translateY(-50%) translateX(-12px)'
        : 'translateY(-50%) translateX(12px)',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    padding: config.tooltip.padding,
    fontSize: config.tooltip.fontSize,
    fontWeight: '700',
    color: getSmartTextColor('primary'), // SMART COLOR SWITCHING
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `${shadows.glass}, 0 0 20px rgba(0, 0, 0, 0.3)`,
    opacity: 0,
    visibility: 'hidden',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    zIndex: 1001,
    textShadow: theme === 'light' ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none',
  };

  const activeIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    [position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right']: '-20px',
    [position === 'bottom' ? 'left' : 'top']: '50%',
    transform: position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
    width: '12px',
    height: '12px',
    background: colors.gradients.primary, // Using Nebula brand gradient
    borderRadius: borderRadius.full,
    boxShadow: '0 0 16px rgba(74, 45, 133, 0.8), 0 0 32px rgba(74, 45, 133, 0.4)', // Using Nebula brand color
    border: `2px solid ${colors.border.light}`,
  };

  // PROFESSIONAL SEPARATOR STYLES
  const separatorStyles: React.CSSProperties = {
    width: position === 'bottom' ? config.separator.width : config.separator.height,
    height: position === 'bottom' ? config.separator.height : config.separator.width,
    background: `linear-gradient(${position === 'bottom' ? '0deg' : '90deg'}, transparent, ${colors.border.medium}, transparent)`,
    borderRadius: borderRadius.full,
    margin: config.separator.margin,
    flexShrink: 0,
    opacity: 0.7,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  // ENHANCED SETTINGS ICON STYLES - USING SLIDERS ICON
  const getSettingsStyles = (): React.CSSProperties => {
    return {
      ...itemBaseStyles,
      background: hoveredItem === 'settings' ? colors.glass.secondary : 'transparent',
      color: hoveredItem === 'settings' ? getSmartTextColor('primary') : getSmartTextColor('secondary'),
      boxShadow: hoveredItem === 'settings'
        ? `${shadows.glass}, 0 0 20px ${colors.border.light}`
        : 'none',
      border: hoveredItem === 'settings' ? `2px solid ${colors.border.light}` : '2px solid transparent',
      transform: hoveredItem === 'settings'
        ? (position === 'bottom'
          ? 'translateY(-4px) scale(1.1)'
          : position === 'left'
            ? 'translateX(-4px) scale(1.1)'
            : 'translateX(4px) scale(1.1)')
        : 'scale(1)',
      zIndex: hoveredItem === 'settings' ? 100 : 1,
      position: 'relative',
      overflow: 'hidden',
    };
  };

  // Settings handlers
  const handleSettingsChange = (newSettings: Partial<DockSettings>) => {
    const updatedSettings: DockSettings = {
      position,
      dockSize,
      iconSize,
      autoHide,
      showLabels,
      ...newSettings,
    };
    onSettingsChange?.(updatedSettings);
  };

  // Auto-hide logic
  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [autoHide, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (autoHide) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredItem(null);
  };

  return (
    <>
      <style>
        {`
          
          /* PROFESSIONAL DOCK ANIMATIONS - NO BOUNCE */
          @keyframes professionalGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(74, 45, 133, 0.5); }
            50% { box-shadow: 0 0 40px rgba(74, 45, 133, 0.7); }
          }
          
          @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes settingsGlow {
            0%, 100% { 
              box-shadow: 0 0 15px rgba(74, 45, 133, 0.3);
              background: ${colors.glass.secondary};
            }
            50% { 
              box-shadow: 0 0 25px rgba(74, 45, 133, 0.5);
              background: ${colors.glass.primary};
            }
          }
          
          /* PROFESSIONAL HOVER EFFECTS */
          .dock-item:hover .dock-tooltip {
            opacity: 1;
            visibility: visible;
            transform: ${position === 'bottom'
            ? 'translateX(-50%) translateY(-16px)'
            : position === 'left'
              ? 'translateY(-50%) translateX(-16px)'
              : 'translateY(-50%) translateX(16px)'
          };
          }
         
          .dock-item.active {
            animation: professionalGlow 4s ease-in-out infinite;
          }
          
          .dock-item:hover {
            z-index: 100 !important;
          }
          
          .dock-item:hover .dock-badge {
            transform: scale(1.1);
            animation: badgePulse 2s ease-in-out infinite;
          }
          
          /* ENHANCED DOCK CONTAINER */
          .glass-dock:hover {
            background: ${colors.glass.secondary};
            box-shadow: ${shadows.modal}, inset 0 2px 0 ${colors.border.medium}, 0 0 80px rgba(0, 0, 0, 0.2);
            transform: ${position === 'bottom'
            ? 'translateX(-50%) translateY(-2px)'
            : position === 'left'
              ? 'translateY(-50%) translateX(-2px)'
              : 'translateY(-50%) translateX(2px)'
          };
          }
          
          .glass-dock {
            overflow: visible !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .glass-dock::-webkit-scrollbar {
            display: none;
          }
          
          /* ENHANCED SETTINGS BUTTON */
          .dock-settings:hover {
            animation: settingsGlow 2s ease-in-out infinite !important;
            border-color: ${colors.border.medium} !important;
          }
          
          .dock-settings:active {
            transform: scale(0.95) !important;
            animation: none !important;
          }
          
          /* PROFESSIONAL SEPARATOR STYLING */
          .dock-separator {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
          }
          
          .glass-dock:hover .dock-separator {
            opacity: 0.9;
            background: linear-gradient(${position === 'bottom' ? '0deg' : '90deg'}, 
              transparent, 
              ${colors.border.medium}, 
              rgba(74, 45, 133, 0.3), 
              ${colors.border.medium}, 
              transparent
            );
          }
          
          /* RESPONSIVE ADJUSTMENTS */
          @media (max-width: 768px) {
            .glass-dock.position-bottom {
              bottom: 16px !important;
              left: 16px !important;
              right: 16px !important;
              transform: none !important;
              max-width: none !important;
              justify-content: center !important;
            }
            
            .glass-dock.position-left,
            .glass-dock.position-right {
              top: 50% !important;
              transform: translateY(-50%) !important;
            }
          }
          
          @media (max-width: 480px) {
            .glass-dock.position-bottom {
              bottom: 12px !important;
              left: 12px !important;
              right: 12px !important;
            }
            
            .glass-dock.position-left {
              left: 8px !important;
            }
            
            .glass-dock.position-right {
              right: 8px !important;
            }
          }
          
          /* AUTO-HIDE TRIGGER AREA */
          .dock-trigger-area {
            position: fixed;
            z-index: 999;
          }
          
          .dock-trigger-area.position-left {
            left: 0;
            top: 0;
            bottom: 0;
            width: 10px;
          }
          
          .dock-trigger-area.position-right {
            right: 0;
            top: 0;
            bottom: 0;
            width: 10px;
          }
          
          .dock-trigger-area.position-bottom {
            bottom: 0;
            left: 0;
            right: 0;
            height: 10px;
          }
          
          /* PROFESSIONAL HOVER EFFECTS FOR DIFFERENT POSITIONS */
          .glass-dock.position-left .dock-item:hover {
            transform: translateX(-4px) scale(1.1) !important;
          }
          
          .glass-dock.position-right .dock-item:hover {
            transform: translateX(4px) scale(1.1) !important;
          }
          
          .glass-dock.position-bottom .dock-item:hover {
            transform: translateY(-4px) scale(1.1) !important;
          }
          
          /* SETTINGS BUTTON POSITION-SPECIFIC TRANSFORMS */
          .glass-dock.position-left .dock-settings:hover {
            transform: translateX(-4px) scale(1.1) !important;
          }
          
          .glass-dock.position-right .dock-settings:hover {
            transform: translateX(4px) scale(1.1) !important;
          }
          
          .glass-dock.position-bottom .dock-settings:hover {
            transform: translateY(-4px) scale(1.1) !important;
          }
          
          /* TOUCH DEVICE OPTIMIZATIONS */
          @media (hover: none) and (pointer: coarse) {
            .dock-item {
              transform: scale(1) !important;
            }
            
            .dock-item:hover {
              transform: scale(1) !important;
              background: transparent !important;
              box-shadow: none !important;
            }
            
            .dock-item.active:hover {
              background: ${colors.gradients.primary} !important;
            }
            
            .dock-settings {
              transform: scale(1) !important;
            }
            
            .dock-settings:hover {
              transform: scale(1) !important;
              animation: none !important;
            }
            
            .dock-badge {
              animation: none !important;
            }
            
            .dock-tooltip {
              display: none !important;
            }
          }
          
          /* ACCESSIBILITY IMPROVEMENTS */
          .dock-settings:focus {
            outline: 2px solid rgba(74, 45, 133, 0.5);
            outline-offset: 2px;
          }
          
          .dock-settings:focus-visible {
            outline: 2px solid rgba(74, 45, 133, 0.8);
            outline-offset: 2px;
          }
           
        `}
      </style>

      {/* Auto-hide trigger area */}
      {autoHide && (
        <div
          className={`dock-trigger-area position-${position}`}
          onMouseEnter={handleMouseEnter}
        />
      )}

      <div
        style={getPositionStyles()}
        className={`glass-dock position-${position} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* REGULAR DOCK ITEMS */}
        {items.map((item, index) => {
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              style={getItemStyles(item, isHovered)}
              className={`dock-item ${item.active ? 'active' : ''}`}
              onClick={() => onItemClick?.(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              title={item.label}
            >

              {/* Icon */}
              {item.icon && (
                <span style={iconStyles} className="dock-icon">
                  {React.cloneElement(item.icon as React.ReactElement, { size: iconSizeValue, filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) !important' })}
                </span>
              )}

              {/* Badge */}
              {item.badge && (
                <div style={badgeStyles} className="dock-badge">
                  {item.badge}
                </div>
              )}

              {/* Active Indicator */}
              {item.active && (
                <div style={activeIndicatorStyles} className="dock-active-indicator" />
              )}

              {/* Tooltip */}
              {showLabels && (
                <div style={tooltipStyles} className="dock-tooltip">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        {/* PROFESSIONAL SEPARATOR */}
        <div style={separatorStyles} className="dock-separator" />

        {/* ENHANCED SETTINGS BUTTON - USING SLIDERS ICON */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={getSettingsStyles()}
          className="dock-settings"
          title={t('nav.dockPreferences')}
          aria-label={t('nav.dockPreferences')}
          onMouseEnter={() => setHoveredItem('settings')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Sliders
            size={iconSizeValue}
            style={{
              transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
            }}
          />

          {/* Settings tooltip */}
          {showLabels && (
            <div style={tooltipStyles} className="dock-tooltip">
              {t('nav.dockPreferences')}
            </div>
          )}
        </button>
      </div>

      {/* Settings Modal */}
      <GlassModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={t('nav.dockPreferences')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
          {/* Position Settings */}
          <div>
            <h3 style={{
              margin: `0 0 ${spacing.lg} 0`,
              color: getSmartTextColor('primary'),
              fontSize: '1.125rem',
              fontWeight: '700',
            }}>
              Position
            </h3>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {(['left', 'right', 'bottom'] as DockPosition[]).map((pos) => (
                <GlassButton
                  key={pos}
                  variant={position === pos ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => handleSettingsChange({ position: pos })}
                >
                  {pos === 'left' && <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />}
                  {pos === 'right' && <ChevronRight size={16} style={{ marginRight: spacing.sm }} />}
                  {pos === 'bottom' && <ChevronDown size={16} style={{ marginRight: spacing.sm }} />}
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </GlassButton>
              ))}
            </div>
          </div>

          {/* Dock Size Settings */}
          <div>
            <h3 style={{
              margin: `0 0 ${spacing.lg} 0`,
              color: getSmartTextColor('primary'),
              fontSize: '1.125rem',
              fontWeight: '700',
            }}>
              Dock Size
            </h3>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {(['small', 'medium', 'large'] as DockSize[]).map((size) => (
                <GlassButton
                  key={size}
                  variant={dockSize === size ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => handleSettingsChange({ dockSize: size })}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </GlassButton>
              ))}
            </div>
            <div style={{ marginTop: spacing.md }}>
              <GlassStatusBadge
                status="info"
                label={`Current: ${config.item.width} × ${config.item.height}`}
                size="sm"
              />
            </div>
          </div>

          {/* Icon Size Settings */}
          <div>
            <h3 style={{
              margin: `0 0 ${spacing.lg} 0`,
              color: getSmartTextColor('primary'),
              fontSize: '1.125rem',
              fontWeight: '700',
            }}>
              Icon Size
            </h3>
            <div style={{ display: 'flex', gap: spacing.md }}>
              {(['small', 'medium', 'large'] as IconSize[]).map((size) => (
                <GlassButton
                  key={size}
                  variant={iconSize === size ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => handleSettingsChange({ iconSize: size })}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </GlassButton>
              ))}
            </div>
            <div style={{ marginTop: spacing.md }}>
              <GlassStatusBadge
                status="info"
                label={`Current: ${iconSizeValue}px`}
                size="sm"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 style={{
              margin: `0 0 ${spacing.lg} 0`,
              color: getSmartTextColor('primary'),
              fontSize: '1.125rem',
              fontWeight: '700',
            }}>
              {t('preferences.options.title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                border: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={autoHide}
                  onChange={(e) => handleSettingsChange({ autoHide: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: colors.text.primary,
                  }}
                />
                <span style={{ color: getSmartTextColor('primary'), fontWeight: '500' }}>
                  {t('preferences.options.autoHideDock')}
                </span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                border: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => handleSettingsChange({ showLabels: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: colors.text.primary,
                  }}
                />
                <span style={{ color: getSmartTextColor('primary'), fontWeight: '500' }}>
                  {t('preferences.options.showTooltips')}
                </span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div style={{
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: 'none',
          }}>
            <h4 style={{
              margin: `0 0 ${spacing.md} 0`,
              color: getSmartTextColor('primary'),
              fontSize: '0.875rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {t('preferences.currentSettings')}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
              <GlassStatusBadge status="info" label={`Position: ${position}`} size="sm" />
              <GlassStatusBadge status="info" label={`Dock: ${dockSize}`} size="sm" />
              <GlassStatusBadge status="info" label={`Icons: ${iconSize}`} size="sm" />
              <GlassStatusBadge status="success" label="Professional Style" size="sm" />
              <GlassStatusBadge status="success" label="Sliders Icon" size="sm" />
              {autoHide && <GlassStatusBadge status="warning" label="Auto-hide" size="sm" />}
              {showLabels && <GlassStatusBadge status="success" label="Tooltips" size="sm" />}
            </div>
          </div>
        </div>
      </GlassModal>
    </>
  );
};
