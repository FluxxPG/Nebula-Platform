import React from 'react';
import { User } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '..';

interface GlassAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const GlassAvatar: React.FC<GlassAvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const sizes = {
    xs: { size: '24px', fontSize: '0.75rem' },
    sm: { size: '32px', fontSize: '0.875rem' },
    md: { size: '40px', fontSize: '1rem' },
    lg: { size: '48px', fontSize: '1.125rem' },
    xl: { size: '64px', fontSize: '1.5rem' },
  };

  const statusColors = {
    online: '#10b981',
    offline: '#6b7280',
    away: '#f59e0b',
    busy: '#ef4444',
  };

  const sizeConfig = sizes[size];

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const avatarStyles: React.CSSProperties = {
    width: sizeConfig.size,
    height: sizeConfig.size,
    borderRadius: borderRadius.full,
    background: src ? 'transparent' : colors.gradients.primary,
    border: `2px solid ${colors.border.light}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: shadows.glass,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: sizeConfig.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const statusIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
    height: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
    borderRadius: borderRadius.full,
    background: status ? statusColors[status] : 'transparent',
    border: `2px solid ${colors.glass.primary}`,
    boxShadow: shadows.soft,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={avatarStyles}>
        {src ? (
          <img src={src} alt={alt || name} style={imageStyles} />
        ) : name ? (
          getInitials(name)
        ) : (
          <User size={parseInt(sizeConfig.size) * 0.5} />
        )}
      </div>
      
      {status && <div style={statusIndicatorStyles} />}
    </div>
  );
};