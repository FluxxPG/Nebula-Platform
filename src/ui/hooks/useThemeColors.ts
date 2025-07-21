import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../tokens/colors';

export const useThemeColors = () => {
  const { theme } = useTheme();
  
  // Return the appropriate theme colors with smart text color switching
  const colors = theme === 'light' ? lightTheme : darkTheme;
  
  // Add smart text color helpers
  return {
    ...colors,
    // Smart text colors that automatically switch based on theme
    smartText: {
      primary: theme === 'light' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
      secondary: theme === 'light' ? 'rgba(60, 60, 60, 0.85)' : 'rgba(255, 255, 255, 0.8)',
      tertiary: theme === 'light' ? 'rgba(90, 90, 90, 0.75)' : 'rgba(255, 255, 255, 0.6)',
      violet: theme === 'light' ? colors.text.violet : colors.text.violet,
      violetSecondary: theme === 'light' ? colors.text.violetSecondary : colors.text.violetSecondary,
    }
  };
};