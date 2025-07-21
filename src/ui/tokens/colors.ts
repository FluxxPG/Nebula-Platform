export const lightTheme = {
  // Glass backgrounds - Subtle, professional opacity levels
  glass: {
    primary: 'rgba(255, 255, 255, 0.35)', 
    secondary: 'rgba(255, 255, 255, 0.25)', 
    tertiary: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.15)', 
    darkSecondary: 'rgba(0, 0, 0, 0.08)',
  },
  
  // Professional, subtle gradients
  gradients: {
    primary: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)', // Professional indigo/purple
    secondary: 'linear-gradient(135deg, #6A4098 0%, #8A53AB 100%)', // Lighter variant
    accent: 'linear-gradient(135deg, #4A2D85 0%, #34D399 100%)', // Indigo to teal
    neutral: 'linear-gradient(135deg, rgba(148, 163, 184, 0.4) 0%, rgba(203, 213, 225, 0.4) 100%)',
    // Subtle, professional background
    background: `
      radial-gradient(ellipse at top left, rgba(74, 45, 133, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at top right, rgba(106, 64, 152, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse at bottom left, rgba(138, 83, 171, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at bottom right, rgba(74, 45, 133, 0.1) 0%, transparent 60%),
      radial-gradient(ellipse at center, rgba(106, 64, 152, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse at center top, rgba(138, 83, 171, 0.1) 0%, transparent 65%),
      linear-gradient(135deg, 
        #f8f7fa 0%, 
        #f2f0f7 15%, 
        #ece9f4 30%, 
        #e6e2f1 45%, 
        #e0dbee 60%, 
        #dad4eb 75%, 
        #d4cde8 90%, 
        #cec6e5 100%
      )
    `,
    
    // Professional status gradients
    success: 'linear-gradient(135deg, rgba(16, 122, 92, 0.9) 0%, rgba(5, 102, 75, 0.9) 100%)',
    warning: 'linear-gradient(135deg, rgba(180, 83, 9, 0.9) 0%, rgba(146, 64, 0, 0.9) 100%)',
    error: 'linear-gradient(135deg, rgba(153, 27, 27, 0.9) 0%, rgba(127, 29, 29, 0.9) 100%)',
    // Professional info gradient
    info: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)',
    
    // Professional accent gradients
    orange: 'linear-gradient(135deg, #9a3412 0%, #7c2d12 100%)',
    green: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
    blue: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    red: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
  },

  // Professional text colors
  text: {
    primary: 'rgba(30, 30, 30, 0.95)', 
    secondary: 'rgba(60, 60, 60, 0.85)', 
    tertiary: 'rgba(90, 90, 90, 0.75)', 
    dark: 'rgba(0, 0, 0, 0.95)',
    darkSecondary: 'rgba(0, 0, 0, 0.8)',
    // Professional brand colors
    violet: '#4A2D85', // Professional indigo/purple
    violetSecondary: '#6A4098', // Lighter indigo/purple
  },

  // Subtle border colors
  border: {
    light: 'rgba(255, 255, 255, 0.4)', 
    medium: 'rgba(255, 255, 255, 0.55)', 
    dark: 'rgba(0, 0, 0, 0.15)',
  }
};

export const darkTheme = {
  // Glass backgrounds - Professional opacity
  glass: {
    primary: 'rgba(0, 0, 0, 0.5)', 
    secondary: 'rgba(0, 0, 0, 0.35)', 
    tertiary: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(255, 255, 255, 0.05)',
    darkSecondary: 'rgba(255, 255, 255, 0.03)',
  },
  
  // Professional, subtle gradients
  gradients: {
    primary: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)', // Professional indigo/purple
    secondary: 'linear-gradient(135deg, #6A4098 0%, #8A53AB 100%)', // Lighter variant
    accent: 'linear-gradient(135deg, #4A2D85 0%, #34D399 100%)', // Indigo to teal
    neutral: 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(107, 114, 128, 0.4) 100%)',
    // Professional dark mode background
    background: `
      radial-gradient(ellipse at top left, rgba(74, 45, 133, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse at top right, rgba(106, 64, 152, 0.25) 0%, transparent 40%),
      radial-gradient(ellipse at bottom left, rgba(138, 83, 171, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse at bottom right, rgba(74, 45, 133, 0.25) 0%, transparent 40%),
      radial-gradient(ellipse at center top, rgba(106, 64, 152, 0.2) 0%, transparent 60%),
      radial-gradient(ellipse at center bottom, rgba(138, 83, 171, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 20% 80%, rgba(74, 45, 133, 0.25) 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, rgba(138, 83, 171, 0.25) 0%, transparent 40%),
      linear-gradient(135deg, 
        #0f0f17 0%, 
        #151429 10%, 
        #1b193b 20%, 
        #211e4d 30%, 
        #27235f 40%, 
        #2d2871 50%, 
        #332d83 60%, 
        #393295 70%, 
        #3f37a7 80%, 
        #453cb9 90%, 
        #4b41cb 100%
      )
    `,
    
    // Professional status gradients
    success: 'linear-gradient(135deg, rgba(16, 122, 92, 0.9) 0%, rgba(5, 102, 75, 0.9) 100%)',
    warning: 'linear-gradient(135deg, rgba(180, 83, 9, 0.9) 0%, rgba(146, 64, 0, 0.9) 100%)',
    error: 'linear-gradient(135deg, rgba(153, 27, 27, 0.9) 0%, rgba(127, 29, 29, 0.9) 100%)',
    // Professional info gradient
    info: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)',
    
    // Professional accent gradients
    orange: 'linear-gradient(135deg, #9a3412 0%, #7c2d12 100%)',
    green: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
    blue: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    red: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
  },

  // Professional text colors
  text: {
    primary: 'rgba(255, 255, 255, 0.98)', 
    secondary: 'rgba(255, 255, 255, 0.8)', 
    tertiary: 'rgba(255, 255, 255, 0.6)', 
    dark: 'rgba(0, 0, 0, 0.9)',
    darkSecondary: 'rgba(0, 0, 0, 0.7)',
    // Professional brand colors
    violet: '#8A53AB', // Brighter purple for dark mode
    violetSecondary: '#A56CC2', // Lighter purple for dark mode
  },

  // Subtle border colors
  border: {
    light: 'rgba(255, 255, 255, 0.15)', 
    medium: 'rgba(255, 255, 255, 0.25)', 
    dark: 'rgba(0, 0, 0, 0.3)',
  }
};

// Default export for backward compatibility
export const colors = lightTheme;

// Professional solid colors
export const solidColors = {
  // Primary brand colors
  primary: {
    50: '#f5f3f8',
    100: '#ede8f3',
    500: '#4A2D85', // Professional indigo/purple
    600: '#3A2368', // Darker indigo/purple
    700: '#2A194B', // Even darker indigo/purple
  },
  
  // Secondary brand colors
  purple: {
    50: '#f5f3f8',
    100: '#ede8f3',
    500: '#6A4098', // Professional purple
    600: '#553379', // Darker purple
    700: '#40265A', // Even darker purple
  },
  
  // Accent brand colors
  pink: {
    50: '#fefcfd',
    100: '#fdf9fb',
    500: '#8A53AB', // Professional lavender
    600: '#6F4289', // Darker lavender
    700: '#543167', // Even darker lavender
  },
  
  // Status colors - professional
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#047857', // Professional green
    600: '#065f46',
    700: '#064e3b',
    gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#b45309', // Professional amber
    600: '#92400e',
    700: '#78350f',
    gradient: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#b91c1c', // Professional red
    600: '#991b1b',
    700: '#7f1d1d',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
  },
  
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#4A2D85', // Professional indigo/purple
    600: '#3A2368', // Darker indigo/purple
    700: '#2A194B', // Even darker indigo/purple
    gradient: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)', // Professional gradient
  },
  
  // Additional professional colors
  orange: {
    500: '#9a3412', // Professional orange
    600: '#7c2d12',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #7c2d12 100%)',
  },
  
  green: {
    500: '#047857', // Professional green
    600: '#065f46',
    gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
  },
  
  blue: {
    500: '#1e40af', // Professional blue
    600: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  },
  
  red: {
    500: '#b91c1c', // Professional red
    600: '#991b1b',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
  },
};