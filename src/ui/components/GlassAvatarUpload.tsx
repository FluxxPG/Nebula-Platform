import React, { useState, useRef, useCallback } from 'react';
import { User, Upload, X, Camera, AlertCircle, Check } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface GlassAvatarUploadProps {
  value?: string;
  onChange?: (value: string | null) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export const GlassAvatarUpload: React.FC<GlassAvatarUploadProps> = ({
  value,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  label,
  required = false,
  error,
  maxSizeInMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const colors = useThemeColors();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = {
    sm: { size: '100px', fontSize: '0.75rem' },
    md: { size: '150px', fontSize: '0.875rem' },
    lg: { size: '200px', fontSize: '1rem' },
    xl: { size: '250px', fontSize: '1.125rem' },
  };

  const sizeConfig = sizes[size];

  const containerStyles: React.CSSProperties = {
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
  };

  const avatarContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: sizeConfig.size,
    height: sizeConfig.size,
    margin: '0 auto',
    borderRadius: '50%',
    background: colors.glass.secondary,
    border: `2px solid ${validationError ? '#ef4444' : isDragging ? colors.border.medium : colors.border.light}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: shadows.glass,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    opacity: disabled ? 0.7 : 1,
  };

  const avatarImageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isHovering ? 0.7 : 1,
    transition: `opacity ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  const placeholderStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: sizeConfig.fontSize,
  };

  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isHovering ? 1 : 0,
    transition: `opacity ${animations.duration.normal} ${animations.easing.smooth}`,
    borderRadius: '50%',
    pointerEvents: 'none',
  };

  const removeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '32px',
    height: '32px',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    opacity: value && isHovering ? 1 : 0,
    transform: value && isHovering ? 'scale(1)' : 'scale(0.8)',
    pointerEvents: value && isHovering ? 'auto' : 'none',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const successStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#10b981',
    marginTop: spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [disabled]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = useCallback((file: File) => {
    setValidationError(null);
    setIsLoading(true);
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setValidationError(`Invalid file type. Allowed types: ${allowedTypes.map(type => type.replace('image/', '')).join(', ')}`);
      setIsLoading(false);
      return;
    }
    
    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      setValidationError(`File size exceeds ${maxSizeInMB}MB limit`);
      setIsLoading(false);
      return;
    }
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onChange?.(base64String);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setValidationError('Error reading file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [allowedTypes, maxSizeInMB, onChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setValidationError(null);
  }, [onChange]);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .avatar-upload-container:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.glassHover};
            border-color: ${colors.border.medium};
          }
          
          .avatar-upload-container.dragging {
            transform: scale(1.05);
            box-shadow: ${shadows.glassHover}, 0 0 0 4px rgba(99, 102, 241, 0.2);
            border-color: ${colors.border.medium};
          }
          
          .avatar-upload-remove:hover {
            background: #ef4444;
            color: white;
            transform: scale(1.1);
          }
          
          .avatar-upload-loading {
            animation: pulse 1.5s infinite;
          }
          
          .avatar-upload-input {
            display: none;
          }
          
          /* Ensure proper contrast in both themes */
          .avatar-upload-placeholder {
            color: ${colors.text.secondary} !important;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .avatar-upload-container {
              border: 3px solid ${colors.border.medium} !important;
            }
            
            .avatar-upload-placeholder {
              color: ${colors.text.primary} !important;
              font-weight: 700 !important;
            }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .avatar-upload-container,
            .avatar-upload-image,
            .avatar-upload-overlay,
            .avatar-upload-remove {
              transition: none !important;
            }
          }
        `}
      </style>
      
      <div style={containerStyles} className={className}>
        {label && (
          <label style={labelStyles}>
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        
        <div
          style={avatarContainerStyles}
          className={`avatar-upload-container ${isDragging ? 'dragging' : ''} ${isLoading ? 'avatar-upload-loading' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            disabled={disabled}
            className="avatar-upload-input"
          />
          
          {value ? (
            <>
              <img 
                src={value} 
                alt="Avatar" 
                style={avatarImageStyles}
                className="avatar-upload-image"
              />
              <div style={overlayStyles} className="avatar-upload-overlay">
                <Camera size={32} color="white" />
              </div>
              <button
                type="button"
                style={removeButtonStyles}
                onClick={handleRemove}
                className="avatar-upload-remove"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <div style={placeholderStyles} className="avatar-upload-placeholder">
              <User size={32} />
              <div>
                {isLoading ? 'Processing...' : 'Click or drag to upload'}
              </div>
            </div>
          )}
        </div>
        
        {(validationError || error) && (
          <div style={errorStyles}>
            <AlertCircle size={12} />
            <span>{validationError || error}</span>
          </div>
        )}
        
        {value && !validationError && !error && (
          <div style={successStyles}>
            <Check size={12} />
            <span>Image uploaded successfully</span>
          </div>
        )}
        
        <div style={{ 
          fontSize: '0.75rem', 
          color: colors.text.secondary, 
          marginTop: spacing.xs,
          textAlign: 'center' 
        }}>
          Allowed formats: {allowedTypes.map(type => type.replace('image/', '')).join(', ')}
          <br />
          Max size: {maxSizeInMB}MB
        </div>
      </div>
    </>
  );
};