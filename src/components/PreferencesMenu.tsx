import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Type,
  Grid3X3,
  Sun,
  Moon,
  RotateCcw,
  Check,
  ChevronRight,
  X,
  Eye,
  Zap,
  Monitor,
  Smartphone,
  Hash,
  Maximize2
} from 'lucide-react';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { usePreferences, IconColorScheme, TileSize, TextSize, TitleSize, IconSize } from '../contexts/PreferencesContext';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows, animations } from '../ui';
import { GlassButton, GlassModal } from '../ui/components';
import { useTranslation } from 'react-i18next';

interface PreferencesMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesMenu: React.FC<PreferencesMenuProps> = ({ isOpen, onClose }) => {
  const colors = useThemeColors();
  const { theme, toggleTheme } = useTheme();
  const {
    iconColorScheme,
    tileSize,
    textSize,
    titleSize,
    iconSize,
    setIconColorScheme,
    setTileSize,
    setTextSize,
    setTitleSize,
    setIconSize,
    resetToDefaults,
  } = usePreferences();
  const { t } = useTranslation();

  const [activeSection, setActiveSection] = useState<string | null>(null);

  // SMART TEXT COLOR HELPER
  const getSmartTextColor = (type: 'primary' | 'secondary' = 'primary') => {
    if (theme === 'light') {
      return type === 'primary' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(60, 60, 60, 0.85)';
    } else {
      return type === 'primary' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.8)';
    }
  };

  // SIMPLE STATUS BADGE WITHOUT CSS ISSUES
  const SimpleStatusBadge: React.FC<{
    label: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg'
  }> = ({ label, color = '#6366f1', size = 'md' }) => {
    const sizeStyles = {
      sm: { padding: '4px 8px', fontSize: '0.75rem' },
      md: { padding: '6px 12px', fontSize: '0.875rem' },
      lg: { padding: '8px 16px', fontSize: '1rem' },
    };

    return (
      <span style={{
        ...sizeStyles[size],
        background: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        borderRadius: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          background: color,
          borderRadius: '50%',
        }} />
        {label}
      </span>
    );
  };

  // COMPLETE OPTION DEFINITIONS
  const iconColorOptions: { value: IconColorScheme; label: string; description: string; icon: React.ReactNode; preview: string }[] = [
    {
      value: 'light',
      label: t('preferences.appearance.iconColors'),
      description: 'Clean white icons for dark backgrounds',
      icon: <Sun size={20} style={{ color: '#ffffff' }} />,
      preview: '#ffffff',
    },
    {
      value: 'dark',
      label: 'Dark Icons',
      description: 'Bold dark icons for light backgrounds',
      icon: <Moon size={20} style={{ color: '#1f2937' }} />,
      preview: '#1f2937',
    },
    {
      value: 'tinted',
      label: 'Tinted Icons',
      description: 'Colorful purple brand icons',
      icon: <Palette size={20} style={{ color: '#8b5cf6' }} />,
      preview: '#8b5cf6',
    },
  ];

  const tileSizeOptions: { value: TileSize; label: string; description: string; preview: string; iconSize: number }[] = [
    {
      value: 'medium',
      label: 'Medium Tiles',
      description: 'Standard 64px tiles',
      preview: '64px',
      iconSize: 24,
    },
    {
      value: 'large',
      label: 'Large Tiles',
      description: 'Larger 80px tiles for better visibility',
      preview: '80px',
      iconSize: 32,
    },
    {
      value: 'xlarge',
      label: 'X-Large Tiles',
      description: 'Maximum 96px tiles for accessibility',
      preview: '96px',
      iconSize: 40,
    },
  ];

  const textSizeOptions: { value: TextSize; label: string; description: string; bodySize: string; headingSize: string }[] = [
    {
      value: 'medium',
      label: 'Medium Text',
      description: 'Standard 16px body text',
      bodySize: '1rem',
      headingSize: '2.5rem',
    },
    {
      value: 'large',
      label: 'Large Text',
      description: 'Larger 18px body text for better readability',
      bodySize: '1.125rem',
      headingSize: '3rem',
    },
    {
      value: 'xlarge',
      label: 'X-Large Text',
      description: 'Maximum 20px body text for accessibility',
      bodySize: '1.25rem',
      headingSize: '3.5rem',
    },
  ];

  const titleSizeOptions: { value: TitleSize; label: string; description: string; mainSize: string; sectionSize: string }[] = [
    {
      value: 'medium',
      label: 'Medium Titles',
      description: 'Standard title sizes',
      mainSize: '3rem',
      sectionSize: '2rem',
    },
    {
      value: 'large',
      label: 'Large Titles',
      description: 'Larger titles for better hierarchy',
      mainSize: '3.5rem',
      sectionSize: '2.5rem',
    },
    {
      value: 'xlarge',
      label: 'X-Large Titles',
      description: 'Maximum title sizes for impact',
      mainSize: '4rem',
      sectionSize: '3rem',
    },
  ];

  const iconSizeOptions: { value: IconSize; label: string; description: string; smallSize: number; mediumSize: number; largeSize: number }[] = [
    {
      value: 'medium',
      label: 'Medium Icons',
      description: 'Standard icon sizes',
      smallSize: 16,
      mediumSize: 20,
      largeSize: 24,
    },
    {
      value: 'large',
      label: 'Large Icons',
      description: 'Larger icons for better visibility',
      smallSize: 20,
      mediumSize: 24,
      largeSize: 28,
    },
    {
      value: 'xlarge',
      label: 'X-Large Icons',
      description: 'Maximum icon sizes for accessibility',
      smallSize: 24,
      mediumSize: 28,
      largeSize: 32,
    },
  ];

  // WORKING MENU SECTIONS
  const menuSections = [
    {
      id: 'appearance',
      title: t('preferences.appearance.title'),
      icon: <Palette size={20} style={{ color: getSmartTextColor('primary') }} />,
      items: [
        {
          id: 'theme',
          title: t('preferences.appearance.themeMode'),
          subtitle: theme === 'light' ? t('preferences.appearance.lightMode') : t('preferences.appearance.darkMode'),
          icon: theme === 'light' ? <Sun size={18} style={{ color: getSmartTextColor('primary') }} /> : <Moon size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => toggleTheme(),
          isToggle: true,
        },
        {
          id: 'icon-colors',
          title: t('preferences.appearance.iconColors'),
          subtitle: iconColorOptions.find(opt => opt.value === iconColorScheme)?.label || 'Tinted Icons',
          icon: <Palette size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => setActiveSection('icon-colors'),
        },
      ],
    },
    {
      id: 'typography',
      title: t('preferences.typography.title'),
      icon: <Type size={20} style={{ color: getSmartTextColor('primary') }} />,
      items: [
        {
          id: 'title-size',
          title: t('preferences.typography.titleSize'),
          subtitle: titleSizeOptions.find(opt => opt.value === titleSize)?.label || 'Medium Titles',
          icon: <Hash size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => setActiveSection('title-size'),
        },
        {
          id: 'text-size',
          title: t('preferences.typography.textSize'),
          subtitle: textSizeOptions.find(opt => opt.value === textSize)?.label || 'Medium Text',
          icon: <Type size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => setActiveSection('text-size'),
        },
      ],
    },
    {
      id: 'layout',
      title: t('preferences.layout.title'),
      icon: <Grid3X3 size={20} style={{ color: getSmartTextColor('primary') }} />,
      items: [
        {
          id: 'tile-size',
          title: t('preferences.layout.appTileSize'),
          subtitle: tileSizeOptions.find(opt => opt.value === tileSize)?.label || 'Medium Tiles',
          icon: <Grid3X3 size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => setActiveSection('tile-size'),
        },
        {
          id: 'icon-size',
          title: t('preferences.layout.iconSize'),
          subtitle: iconSizeOptions.find(opt => opt.value === iconSize)?.label || 'Medium Icons',
          icon: <Maximize2 size={18} style={{ color: getSmartTextColor('primary') }} />,
          action: () => setActiveSection('icon-size'),
        },
      ],
    },
  ];

  // RESPONSIVE CONTAINER STYLES
  const containerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    minWidth: '300px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    padding: spacing.lg,
  };

  const sectionStyles: React.CSSProperties = {
    background: colors.glass.secondary,
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.border.light}`,
  };

  const sectionHeaderStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    background: colors.glass.primary,
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '700',
    color: getSmartTextColor('primary'),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const menuItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.lg} ${spacing.xl}`,
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    borderBottom: `1px solid ${colors.border.light}`,
    minHeight: '80px',
  };

  const menuItemContentStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  };

  const menuItemTextStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  };

  const menuItemTitleStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '600',
    color: getSmartTextColor('primary'),
  };

  const menuItemSubtitleStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: getSmartTextColor('secondary'),
    fontWeight: '500',
  };

  // RESPONSIVE GRID
  const optionGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.xl,
    marginTop: spacing.xl,
  };

  const optionCardStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.xl,
    background: isSelected ? colors.gradients.primary : colors.glass.secondary,
    border: `2px solid ${isSelected ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.xl,
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  });

  const previewStyles = (size: string): React.CSSProperties => ({
    width: size,
    height: size,
    background: colors.gradients.primary,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${spacing.lg} auto`,
    border: `2px solid ${colors.border.light}`,
    boxShadow: shadows.glass,
  });

  const handleOptionSelect = (type: 'iconColor' | 'tileSize' | 'textSize' | 'titleSize' | 'iconSize', value: any) => {
    switch (type) {
      case 'iconColor':
        setIconColorScheme(value);
        break;
      case 'tileSize':
        setTileSize(value);
        break;
      case 'textSize':
        setTextSize(value);
        break;
      case 'titleSize':
        setTitleSize(value);
        break;
      case 'iconSize':
        setIconSize(value);
        break;
    }
  };

  // DETAIL VIEW RENDERER
  const renderDetailView = () => {
    if (!activeSection) return null;

    const detailHeaderStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      flexWrap: 'wrap',
      gap: spacing.md,
    };

    const livePreviewStyles: React.CSSProperties = {
      padding: spacing.xl,
      background: colors.glass.secondary,
      borderRadius: borderRadius.xl,
      marginBottom: spacing.xl,
      border: `1px solid ${colors.border.light}`,
    };

    switch (activeSection) {
      case 'icon-colors':
        return (
          <div>
            <div style={detailHeaderStyles}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0 }}>
                {t('preferences.appearance.iconColors')}
              </h3>
              <GlassButton variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <X size={16} />
              </GlassButton>
            </div>

            <div style={livePreviewStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                <Eye size={20} style={{ color: getSmartTextColor('primary') }} />
                <span style={{ fontSize: '1rem', fontWeight: '600', color: getSmartTextColor('primary') }}>
                  Live Preview Active
                </span>
                <SimpleStatusBadge label="Changes Apply Instantly" color="#22c55e" size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
                Icon colors change immediately throughout the application. Look at navigation icons and interface elements.
              </p>
            </div>

            <div style={optionGridStyles}>
              {iconColorOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionCardStyles(iconColorScheme === option.value)}
                  onClick={() => handleOptionSelect('iconColor', option.value)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        background: option.value === 'light' ? '#ffffff' : option.value === 'dark' ? '#1f2937' : colors.gradients.primary,
                        borderRadius: borderRadius.lg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${colors.border.light}`,
                        boxShadow: shadows.glass,
                        flexShrink: 0,
                      }}>
                        {option.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: iconColorScheme === option.value ? 'white' : getSmartTextColor('primary'), margin: 0, marginBottom: spacing.sm }}>
                          {option.label}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: iconColorScheme === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'), margin: 0, marginBottom: spacing.sm }}>
                          {option.description}
                        </p>
                        <SimpleStatusBadge label={`Color: ${option.preview}`} color="#6366f1" size="sm" />
                      </div>
                      {iconColorScheme === option.value && (
                        <div style={{
                          background: '#22c55e',
                          borderRadius: borderRadius.full,
                          padding: spacing.sm,
                          flexShrink: 0,
                        }}>
                          <Check size={20} style={{ color: 'white' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: spacing.lg,
                    padding: spacing.lg,
                    background: colors.glass.primary,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.border.light}`,
                    flexWrap: 'wrap',
                  }}>
                    <Settings size={28} style={{ color: option.preview }} />
                    <Zap size={28} style={{ color: option.preview }} />
                    <Grid3X3 size={28} style={{ color: option.preview }} />
                    <Palette size={28} style={{ color: option.preview }} />
                    <Type size={28} style={{ color: option.preview }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tile-size':
        return (
          <div>
            <div style={detailHeaderStyles}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0 }}>
                {t('preferences.layout.appTileSize')}
              </h3>
              <GlassButton variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <X size={16} />
              </GlassButton>
            </div>

            <div style={livePreviewStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                <Eye size={20} style={{ color: getSmartTextColor('primary') }} />
                <span style={{ fontSize: '1rem', fontWeight: '600', color: getSmartTextColor('primary') }}>
                  Live Preview Active
                </span>
                <SimpleStatusBadge label="Changes Apply Instantly" color="#22c55e" size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
                App tiles throughout the application will resize immediately. Check the App Library to see changes.
              </p>
            </div>

            <div style={optionGridStyles}>
              {tileSizeOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionCardStyles(tileSize === option.value)}
                  onClick={() => handleOptionSelect('tileSize', option.value)}
                >
                  <div>
                    <div style={previewStyles(option.preview)}>
                      <Grid3X3 size={option.iconSize} style={{ color: 'white' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: tileSize === option.value ? 'white' : getSmartTextColor('primary'), margin: `0 0 ${spacing.sm} 0` }}>
                        {option.label}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: tileSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'), margin: `0 0 ${spacing.md} 0` }}>
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <SimpleStatusBadge label={`Size: ${option.preview}`} color="#6366f1" size="sm" />
                    <SimpleStatusBadge label={`Icons: ${option.iconSize}px`} color="#22c55e" size="sm" />
                  </div>

                  {tileSize === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: spacing.md,
                      right: spacing.md,
                      background: '#22c55e',
                      borderRadius: borderRadius.full,
                      padding: spacing.sm,
                    }}>
                      <Check size={20} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'text-size':
        return (
          <div>
            <div style={detailHeaderStyles}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0 }}>
                {t('preferences.typography.textSize')}
              </h3>
              <GlassButton variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <X size={16} />
              </GlassButton>
            </div>

            <div style={livePreviewStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                <Eye size={20} style={{ color: getSmartTextColor('primary') }} />
                <span style={{ fontSize: '1rem', fontWeight: '600', color: getSmartTextColor('primary') }}>
                  Live Preview Active
                </span>
                <SimpleStatusBadge label="Changes Apply Instantly" color="#22c55e" size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
                All text throughout the application will resize immediately including headings, body text, and labels.
              </p>
            </div>

            <div style={optionGridStyles}>
              {textSizeOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionCardStyles(textSize === option.value)}
                  onClick={() => handleOptionSelect('textSize', option.value)}
                >
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                      <div style={{
                        fontSize: option.headingSize,
                        fontWeight: '800',
                        color: textSize === option.value ? 'white' : getSmartTextColor('primary'),
                        marginBottom: spacing.md,
                        lineHeight: '1.2',
                      }}>
                        Heading Sample
                      </div>
                      <div style={{
                        fontSize: option.bodySize,
                        color: textSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'),
                        fontWeight: '500',
                        lineHeight: '1.5',
                        marginBottom: spacing.md,
                      }}>
                        Body text sample for readability testing.
                      </div>
                      <div style={{
                        fontSize: `calc(${option.bodySize} * 0.875)`,
                        color: textSize === option.value ? 'rgba(255,255,255,0.7)' : getSmartTextColor('secondary'),
                        fontWeight: '500',
                        opacity: 0.8,
                      }}>
                        Small text scales proportionally
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: textSize === option.value ? 'white' : getSmartTextColor('primary'), margin: `0 0 ${spacing.sm} 0` }}>
                        {option.label}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: textSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'), margin: `0 0 ${spacing.md} 0` }}>
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <SimpleStatusBadge label={`Body: ${option.bodySize}`} color="#6366f1" size="sm" />
                    <SimpleStatusBadge label={`Heading: ${option.headingSize}`} color="#22c55e" size="sm" />
                  </div>

                  {textSize === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: spacing.md,
                      right: spacing.md,
                      background: '#22c55e',
                      borderRadius: borderRadius.full,
                      padding: spacing.sm,
                    }}>
                      <Check size={20} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'title-size':
        return (
          <div>
            <div style={detailHeaderStyles}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0 }}>
                {t('preferences.typography.titleSize')}
              </h3>
              <GlassButton variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <X size={16} />
              </GlassButton>
            </div>

            <div style={livePreviewStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                <Eye size={20} style={{ color: getSmartTextColor('primary') }} />
                <span style={{ fontSize: '1rem', fontWeight: '600', color: getSmartTextColor('primary') }}>
                  Live Preview Active
                </span>
                <SimpleStatusBadge label="Changes Apply Instantly" color="#22c55e" size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
                All titles throughout the application will resize immediately including page titles, section headers, and card titles.
              </p>
            </div>

            <div style={optionGridStyles}>
              {titleSizeOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionCardStyles(titleSize === option.value)}
                  onClick={() => handleOptionSelect('titleSize', option.value)}
                >
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                      <div style={{
                        fontSize: option.mainSize,
                        fontWeight: '900',
                        color: titleSize === option.value ? 'white' : getSmartTextColor('primary'),
                        marginBottom: spacing.lg,
                        lineHeight: '1.1',
                      }}>
                        Main Title
                      </div>
                      <div style={{
                        fontSize: option.sectionSize,
                        fontWeight: '700',
                        color: titleSize === option.value ? 'rgba(255,255,255,0.9)' : getSmartTextColor('primary'),
                        marginBottom: spacing.md,
                        lineHeight: '1.2',
                      }}>
                        Section Title
                      </div>
                      <div style={{
                        fontSize: `calc(${option.sectionSize} * 0.75)`,
                        fontWeight: '600',
                        color: titleSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'),
                        lineHeight: '1.3',
                      }}>
                        Card Title
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: titleSize === option.value ? 'white' : getSmartTextColor('primary'), margin: `0 0 ${spacing.sm} 0` }}>
                        {option.label}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: titleSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'), margin: `0 0 ${spacing.md} 0` }}>
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <SimpleStatusBadge label={`Main: ${option.mainSize}`} color="#6366f1" size="sm" />
                    <SimpleStatusBadge label={`Section: ${option.sectionSize}`} color="#22c55e" size="sm" />
                  </div>

                  {titleSize === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: spacing.md,
                      right: spacing.md,
                      background: '#22c55e',
                      borderRadius: borderRadius.full,
                      padding: spacing.sm,
                    }}>
                      <Check size={20} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'icon-size':
        return (
          <div>
            <div style={detailHeaderStyles}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0 }}>
                {t('preferences.layout.iconSize')}
              </h3>
              <GlassButton variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <X size={16} />
              </GlassButton>
            </div>

            <div style={livePreviewStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                <Eye size={20} style={{ color: getSmartTextColor('primary') }} />
                <span style={{ fontSize: '1rem', fontWeight: '600', color: getSmartTextColor('primary') }}>
                  Live Preview Active
                </span>
                <SimpleStatusBadge label="Changes Apply Instantly" color="#22c55e" size="sm" />
              </div>
              <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
                All icons throughout the application will resize immediately including navigation icons, buttons, and interface elements.
              </p>
            </div>

            <div style={optionGridStyles}>
              {iconSizeOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionCardStyles(iconSize === option.value)}
                  onClick={() => handleOptionSelect('iconSize', option.value)}
                >
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg }}>
                        <Settings size={option.smallSize} style={{ color: iconSize === option.value ? 'white' : getSmartTextColor('primary') }} />
                        <Zap size={option.mediumSize} style={{ color: iconSize === option.value ? 'white' : getSmartTextColor('primary') }} />
                        <Grid3X3 size={option.largeSize} style={{ color: iconSize === option.value ? 'white' : getSmartTextColor('primary') }} />
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: iconSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'),
                        fontWeight: '500',
                      }}>
                        Small • Medium • Large
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: iconSize === option.value ? 'white' : getSmartTextColor('primary'), margin: `0 0 ${spacing.sm} 0` }}>
                        {option.label}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: iconSize === option.value ? 'rgba(255,255,255,0.8)' : getSmartTextColor('secondary'), margin: `0 0 ${spacing.md} 0` }}>
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <SimpleStatusBadge label={`Small: ${option.smallSize}px`} color="#6366f1" size="sm" />
                    <SimpleStatusBadge label={`Medium: ${option.mediumSize}px`} color="#22c55e" size="sm" />
                    <SimpleStatusBadge label={`Large: ${option.largeSize}px`} color="#f59e0b" size="sm" />
                  </div>

                  {iconSize === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: spacing.md,
                      right: spacing.md,
                      background: '#22c55e',
                      borderRadius: borderRadius.full,
                      padding: spacing.sm,
                    }}>
                      <Check size={20} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // RENDER DETAIL VIEW WHEN SECTION IS SELECTED
  if (activeSection) {
    return (
      <GlassModal isOpen={isOpen} onClose={onClose} title={t('preferences.title')}>
        <div style={containerStyles}>
          {renderDetailView()}
        </div>
      </GlassModal>
    );
  }

  // MAIN PREFERENCES MENU WITH ALL OPTIONS VISIBLE
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={t('preferences.title')}>
      <div style={containerStyles}>
        {/* Header with Reset Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing.xl,
          background: colors.glass.secondary,
          borderRadius: borderRadius.xl,
          border: `1px solid ${colors.border.light}`,
          flexWrap: 'wrap',
          gap: spacing.md,
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: 0, marginBottom: spacing.sm }}>
              {t('preferences.title')}
            </h3>
            <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: 0 }}>
              {t('preferences.subtitle')}
            </p>
          </div>
          <GlassButton variant="ghost" size="sm" onClick={resetToDefaults}>
            <RotateCcw size={16} style={{ marginRight: spacing.sm }} />
            {t('preferences.resetAll')}
          </GlassButton>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div key={section.id} style={sectionStyles}>
            <div style={sectionHeaderStyles}>
              {section.icon}
              <span style={sectionTitleStyles}>{section.title}</span>
            </div>

            {section.items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...menuItemStyles,
                  borderBottom: index === section.items.length - 1 ? 'none' : `1px solid ${colors.border.light}`,
                }}
                onClick={item.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.glass.primary;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={menuItemContentStyles}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: colors.glass.primary,
                    borderRadius: borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getSmartTextColor('primary'),
                    border: `2px solid ${colors.border.light}`,
                    flexShrink: 0,
                    boxShadow: shadows.glass,
                  }}>
                    {item.icon}
                  </div>
                  <div style={menuItemTextStyles}>
                    <span style={menuItemTitleStyles}>{item.title}</span>
                    <span style={menuItemSubtitleStyles}>{item.subtitle}</span>
                  </div>
                </div>
                {!item.isToggle && <ChevronRight size={20} style={{ color: getSmartTextColor('secondary'), flexShrink: 0 }} />}
                {item.isToggle && (
                  <SimpleStatusBadge
                    label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    color={theme === 'dark' ? '#6366f1' : '#f59e0b'}
                    size="md"
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Current Settings Summary */}
        <div style={{
          padding: spacing.xl,
          background: colors.glass.secondary,
          borderRadius: borderRadius.xl,
          border: `1px solid ${colors.border.light}`,
        }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: getSmartTextColor('primary'), margin: `0 0 ${spacing.lg} 0` }}>
            {t('preferences.currentSettings')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
            <SimpleStatusBadge label={`Theme: ${theme === 'light' ? 'Light' : 'Dark'}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label={`Icons: ${iconColorOptions.find(opt => opt.value === iconColorScheme)?.label}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label={`Tiles: ${tileSizeOptions.find(opt => opt.value === tileSize)?.label}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label={`Text: ${textSizeOptions.find(opt => opt.value === textSize)?.label}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label={`Titles: ${titleSizeOptions.find(opt => opt.value === titleSize)?.label}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label={`Icon Size: ${iconSizeOptions.find(opt => opt.value === iconSize)?.label}`} color="#6366f1" size="md" />
            <SimpleStatusBadge label="Live Preview Active" color="#22c55e" size="md" />
            <SimpleStatusBadge label="Responsive Design" color="#f59e0b" size="md" />
          </div>
          <p style={{ fontSize: '0.875rem', color: getSmartTextColor('secondary'), margin: `${spacing.md} 0 0 0` }}>
            All changes apply immediately throughout the application. Navigate to different pages to see the effects.
          </p>
        </div>
      </div>
    </GlassModal>
  );
};
