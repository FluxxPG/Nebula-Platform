import React, { createContext, useContext, useState, useEffect } from 'react';

export type IconColorScheme = 'light' | 'dark' | 'tinted';
export type TileSize = 'medium' | 'large' | 'xlarge';
export type TextSize = 'medium' | 'large' | 'xlarge';
export type TitleSize = 'medium' | 'large' | 'xlarge';
export type IconSize = 'medium' | 'large' | 'xlarge';

interface PreferencesContextType {
  // Appearance
  iconColorScheme: IconColorScheme;
  tileSize: TileSize;
  textSize: TextSize;
  titleSize: TitleSize;
  iconSize: IconSize;
  
  // Actions
  setIconColorScheme: (scheme: IconColorScheme) => void;
  setTileSize: (size: TileSize) => void;
  setTextSize: (size: TextSize) => void;
  setTitleSize: (size: TitleSize) => void;
  setIconSize: (size: IconSize) => void;
  resetToDefaults: () => void;
  
  // Apply changes immediately
  applyChanges: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

interface PreferencesProviderProps {
  children: React.ReactNode;
}

const defaultPreferences = {
  iconColorScheme: 'tinted' as IconColorScheme,
  tileSize: 'medium' as TileSize,
  textSize: 'medium' as TextSize,
  titleSize: 'medium' as TitleSize,
  iconSize: 'medium' as IconSize,
};

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [iconColorScheme, setIconColorScheme] = useState<IconColorScheme>(() => {
    const saved = localStorage.getItem('nebula-icon-color-scheme');
    return (saved as IconColorScheme) || defaultPreferences.iconColorScheme;
  });

  const [tileSize, setTileSize] = useState<TileSize>(() => {
    const saved = localStorage.getItem('nebula-tile-size');
    return (saved as TileSize) || defaultPreferences.tileSize;
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    const saved = localStorage.getItem('nebula-text-size');
    return (saved as TextSize) || defaultPreferences.textSize;
  });

  const [titleSize, setTitleSize] = useState<TitleSize>(() => {
    const saved = localStorage.getItem('nebula-title-size');
    return (saved as TitleSize) || defaultPreferences.titleSize;
  });

  const [iconSize, setIconSize] = useState<IconSize>(() => {
    const saved = localStorage.getItem('nebula-icon-size');
    return (saved as IconSize) || defaultPreferences.iconSize;
  });

  // Apply changes immediately to DOM
  const applyChanges = () => {
    const root = document.documentElement;
    
    // Apply text sizes
    const textSizes = getTextSizes(textSize);
    root.style.setProperty('--text-heading1', textSizes.heading1);
    root.style.setProperty('--text-heading2', textSizes.heading2);
    root.style.setProperty('--text-heading3', textSizes.heading3);
    root.style.setProperty('--text-body', textSizes.body);
    root.style.setProperty('--text-small', textSizes.small);
    root.style.setProperty('--text-tiny', textSizes.tiny);
    
    // Apply title sizes
    const titleSizes = getTitleSizes(titleSize);
    root.style.setProperty('--title-main', titleSizes.main);
    root.style.setProperty('--title-section', titleSizes.section);
    root.style.setProperty('--title-card', titleSizes.card);
    
    // Apply icon colors
    const iconColors = getIconColors(iconColorScheme);
    root.style.setProperty('--icon-color-primary', iconColors.primary);
    root.style.setProperty('--icon-color-secondary', iconColors.secondary);
    root.style.setProperty('--icon-color-accent', iconColors.accent);
    
    // Apply icon sizes
    const iconSizes = getIconSizes(iconSize);
    root.style.setProperty('--icon-size-small', `${iconSizes.small}px`);
    root.style.setProperty('--icon-size-medium', `${iconSizes.medium}px`);
    root.style.setProperty('--icon-size-large', `${iconSizes.large}px`);
    root.style.setProperty('--icon-size-xlarge', `${iconSizes.xlarge}px`);
    
    // Apply tile sizes
    const tileSizes = getTileSizes(tileSize);
    root.style.setProperty('--tile-width', tileSizes.width);
    root.style.setProperty('--tile-height', tileSizes.height);
    root.style.setProperty('--tile-border-radius', tileSizes.borderRadius);
    root.style.setProperty('--tile-icon-size', `${tileSizes.iconSize}px`);
    root.style.setProperty('--tile-padding', tileSizes.padding);
  };

  // Helper functions
  const getIconColors = (scheme: IconColorScheme) => {
    switch (scheme) {
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

  const getTileSizes = (size: TileSize) => {
    switch (size) {
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

  const getTextSizes = (size: TextSize) => {
    switch (size) {
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

  const getTitleSizes = (size: TitleSize) => {
    switch (size) {
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

  const getIconSizes = (size: IconSize) => {
    switch (size) {
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

  // Save preferences to localStorage and apply immediately
  useEffect(() => {
    localStorage.setItem('nebula-icon-color-scheme', iconColorScheme);
    applyChanges();
  }, [iconColorScheme]);

  useEffect(() => {
    localStorage.setItem('nebula-tile-size', tileSize);
    applyChanges();
  }, [tileSize]);

  useEffect(() => {
    localStorage.setItem('nebula-text-size', textSize);
    applyChanges();
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('nebula-title-size', titleSize);
    applyChanges();
  }, [titleSize]);

  useEffect(() => {
    localStorage.setItem('nebula-icon-size', iconSize);
    applyChanges();
  }, [iconSize]);

  // Apply changes on mount
  useEffect(() => {
    applyChanges();
  }, []);

  const resetToDefaults = () => {
    setIconColorScheme(defaultPreferences.iconColorScheme);
    setTileSize(defaultPreferences.tileSize);
    setTextSize(defaultPreferences.textSize);
    setTitleSize(defaultPreferences.titleSize);
    setIconSize(defaultPreferences.iconSize);
  };

  return (
    <PreferencesContext.Provider
      value={{
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
        applyChanges,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};