import { usePreferences } from '../../contexts/PreferencesContext';

export const useAppearance = () => {
  const { iconColorScheme, tileSize, textSize, titleSize, iconSize } = usePreferences();

  // Icon color schemes
  const getIconColors = () => {
    switch (iconColorScheme) {
      case 'light':
        return {
          primary: '#ffffff',
          secondary: '#f8fafc',
          accent: '#e2e8f0',
        };
      case 'dark':
        return {
          primary: '#1f2937',
          secondary: '#374151',
          accent: '#4b5563',
        };
      case 'tinted':
      default:
        return {
          primary: '#8b5cf6',
          secondary: '#a78bfa',
          accent: '#c4b5fd',
        };
    }
  };

  // Tile size configurations
  const getTileSizes = () => {
    switch (tileSize) {
      case 'medium':
        return {
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          iconSize: 24,
          padding: '16px',
        };
      case 'large':
        return {
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          iconSize: 32,
          padding: '20px',
        };
      case 'xlarge':
        return {
          width: '96px',
          height: '96px',
          borderRadius: '24px',
          iconSize: 40,
          padding: '24px',
        };
      default:
        return {
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          iconSize: 24,
          padding: '16px',
        };
    }
  };

  // Text size configurations
  const getTextSizes = () => {
    switch (textSize) {
      case 'medium':
        return {
          heading1: '3rem',
          heading2: '2.5rem',
          heading3: '2rem',
          body: '1rem',
          small: '0.875rem',
          tiny: '0.75rem',
        };
      case 'large':
        return {
          heading1: '3.5rem',
          heading2: '3rem',
          heading3: '2.5rem',
          body: '1.125rem',
          small: '1rem',
          tiny: '0.875rem',
        };
      case 'xlarge':
        return {
          heading1: '4rem',
          heading2: '3.5rem',
          heading3: '3rem',
          body: '1.25rem',
          small: '1.125rem',
          tiny: '1rem',
        };
      default:
        return {
          heading1: '3rem',
          heading2: '2.5rem',
          heading3: '2rem',
          body: '1rem',
          small: '0.875rem',
          tiny: '0.75rem',
        };
    }
  };

  // Title size configurations
  const getTitleSizes = () => {
    switch (titleSize) {
      case 'medium':
        return {
          main: '3rem',
          section: '2rem',
          card: '1.5rem',
        };
      case 'large':
        return {
          main: '3.5rem',
          section: '2.5rem',
          card: '1.75rem',
        };
      case 'xlarge':
        return {
          main: '4rem',
          section: '3rem',
          card: '2rem',
        };
      default:
        return {
          main: '3rem',
          section: '2rem',
          card: '1.5rem',
        };
    }
  };

  // Icon size configurations
  const getIconSizes = () => {
    switch (iconSize) {
      case 'medium':
        return {
          small: 16,
          medium: 20,
          large: 24,
          xlarge: 28,
        };
      case 'large':
        return {
          small: 20,
          medium: 24,
          large: 28,
          xlarge: 32,
        };
      case 'xlarge':
        return {
          small: 24,
          medium: 28,
          large: 32,
          xlarge: 36,
        };
      default:
        return {
          small: 16,
          medium: 20,
          large: 24,
          xlarge: 28,
        };
    }
  };

  return {
    iconColors: getIconColors(),
    tileSizes: getTileSizes(),
    textSizes: getTextSizes(),
    titleSizes: getTitleSizes(),
    iconSizes: getIconSizes(),
    iconColorScheme,
    tileSize,
    textSize,
    titleSize,
    iconSize,
  };
};
