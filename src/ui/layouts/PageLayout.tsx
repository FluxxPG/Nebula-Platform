import React from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius } from '../tokens/spacing';
import { ResponsiveContainer } from '../components/ResponsiveContainer';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
}) => {
  const colors = useThemeColors();

  const containerStyles: React.CSSProperties = {
    width: '100%',
    minHeight: 'calc(100vh - 120px)', // Account for header and dock
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['3xl'],
    padding: `${spacing.xl} 0`,
    gap: spacing.lg,
  };

  const titleSectionStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0, // Allow text to wrap
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    lineHeight: '1.2',
    wordBreak: 'break-word',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    color: colors.text.secondary,
    lineHeight: '1.6',
    fontWeight: '500',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.lg,
    alignItems: 'flex-start',
    flexShrink: 0,
  };

  const contentStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <>
      <style>
        {`
          /* Responsive typography */
          @media (max-width: 1023px) {
            .page-title {
              font-size: 2.5rem !important;
            }
            .page-subtitle {
              font-size: 1.125rem !important;
            }
          }
          
          @media (max-width: 767px) {
            .page-title {
              font-size: 2rem !important;
            }
            .page-subtitle {
              font-size: 1rem !important;
            }
            .page-header {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: ${spacing.xl} !important;
            }
            .page-actions {
              flex-direction: column !important;
              gap: ${spacing.md} !important;
            }
          }
          
          @media (max-width: 480px) {
            .page-title {
              font-size: 1.75rem !important;
            }
            .page-subtitle {
              font-size: 0.875rem !important;
            }
            .page-container {
              padding-top: ${spacing.xl} !important;
              padding-bottom: ${spacing['2xl']} !important;
            }
            .page-header {
              margin-bottom: ${spacing['2xl']} !important;
              padding: ${spacing.lg} 0 !important;
            }
          }
        `}
      </style>
      <div style={containerStyles} className={`page-container ${className}`}>
        <ResponsiveContainer maxWidth="2xl">
          {(title || subtitle || actions) && (
            <div style={headerStyles} className="page-header">
              <div style={titleSectionStyles}>
                {title && (
                  <h1 style={titleStyles} className="page-title">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p style={subtitleStyles} className="page-subtitle">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div style={actionsStyles} className="page-actions">
                  {actions}
                </div>
              )}
            </div>
          )}
          
          <div style={contentStyles}>
            {children}
          </div>
        </ResponsiveContainer>
      </div>
    </>
  );
};