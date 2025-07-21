import React from 'react';
import { spacing } from '../tokens/spacing';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = true,
  className = '',
}) => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: maxWidths[maxWidth],
    margin: '0 auto',
    ...(padding && {
      paddingLeft: spacing.lg,
      paddingRight: spacing.lg,
    }),
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .responsive-container {
              padding-left: ${spacing.md} !important;
              padding-right: ${spacing.md} !important;
            }
          }
          
          @media (max-width: 480px) {
            .responsive-container {
              padding-left: ${spacing.sm} !important;
              padding-right: ${spacing.sm} !important;
            }
          }
        `}
      </style>
      <div 
        style={containerStyles} 
        className={`responsive-container ${className}`}
      >
        {children}
      </div>
    </>
  );
};