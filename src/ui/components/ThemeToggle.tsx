import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  const buttonStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '12px', // Changed from borderRadius.xl to match logout button
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', // Match logout button shadow
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    color: colors.text.primary,
    overflow: 'hidden',
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sunStyles: React.CSSProperties = {
    ...iconStyles,
    transform: theme === 'light' ? 'translateY(0) rotate(0deg)' : 'translateY(-40px) rotate(180deg)',
    opacity: theme === 'light' ? 1 : 0,
    color: theme === 'light' ? '#f59e0b' : colors.text.primary, // Gold color for sun in light mode
  };

  const moonStyles: React.CSSProperties = {
    ...iconStyles,
    transform: theme === 'dark' ? 'translateY(0) rotate(0deg)' : 'translateY(40px) rotate(-180deg)',
    opacity: theme === 'dark' ? 1 : 0,
    color: theme === 'dark' ? colors.text.violet : colors.text.primary, // Nebula violet for moon in dark mode
  };

  return (
    <button
      style={buttonStyles}
      onClick={toggleTheme}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.background = colors.glass.secondary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.background = colors.glass.primary;
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div style={sunStyles}>
        <Sun size={20} />
      </div>
      <div style={moonStyles}>
        <Moon size={20} />
      </div>
    </button>
  );
};