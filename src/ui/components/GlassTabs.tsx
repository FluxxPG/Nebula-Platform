import React, { useState } from 'react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface GlassTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'pills',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const containerStyles: React.CSSProperties = {
    width: '100%',
  };

  const tabListStyles: React.CSSProperties = {
    display: 'flex',
    gap: variant === 'pills' ? spacing.sm : 0,
    marginBottom: spacing.xl,
    ...(variant === 'pills' && {
      padding: spacing.sm,
      background: colors.glass.secondary,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.xl,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }),
    ...(variant === 'underline' && {
      borderBottom: `1px solid ${colors.border.light}`,
    }),
  };

  const getTabStyles = (tabId: string): React.CSSProperties => {
    const isActive = tabId === activeTab;
    
    const baseStyles: React.CSSProperties = {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
      border: 'none',
      background: 'transparent',
      position: 'relative',
    };

    if (variant === 'pills') {
      return {
        ...baseStyles,
        borderRadius: borderRadius.lg,
        color: isActive ? colors.text.primary : colors.text.secondary,
        background: isActive ? colors.gradients.primary : 'transparent',
        boxShadow: isActive ? shadows.soft : 'none',
      };
    }

    return {
      ...baseStyles,
      color: isActive ? colors.text.primary : colors.text.secondary,
      borderBottom: isActive ? `2px solid rgba(99, 102, 241, 0.8)` : '2px solid transparent',
    };
  };

  const contentStyles: React.CSSProperties = {
    animation: `slideUp ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <>
      <style>
        {animations.keyframes.slideUp}
      </style>
      
      <div style={containerStyles} className={className}>
        <div style={tabListStyles}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={getTabStyles(tab.id)}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={(e) => {
                if (tab.id !== activeTab) {
                  if (variant === 'pills') {
                    e.currentTarget.style.background = colors.glass.secondary;
                  }
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (tab.id !== activeTab) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.text.secondary;
                }
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={contentStyles} key={activeTab}>
          {activeTabContent}
        </div>
      </div>
    </>
  );
};