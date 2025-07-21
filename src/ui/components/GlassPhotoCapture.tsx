import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Image, RefreshCw, AlertCircle, Check, Maximize2, Minimize2 } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { GlassButton } from './GlassButton';

interface GlassPhotoCaptureProps {
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
  aspectRatio?: 'square' | '4:3' | '16:9';
}

export const GlassPhotoCapture: React.FC<GlassPhotoCaptureProps> = ({
  value,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  label,
  required = false,
  error,
  maxSizeInMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  aspectRatio = 'square'
}) => {
  const colors = useThemeColors();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sizes = {
    sm: { width: '300px', height: aspectRatio === 'square' ? '300px' : aspectRatio === '4:3' ? '225px' : '169px', fontSize: '0.75rem' },
    md: { width: '400px', height: aspectRatio === 'square' ? '400px' : aspectRatio === '4:3' ? '300px' : '225px', fontSize: '0.875rem' },
    lg: { width: '500px', height: aspectRatio === 'square' ? '500px' : aspectRatio === '4:3' ? '375px' : '281px', fontSize: '1rem' },
    xl: { width: '600px', height: aspectRatio === 'square' ? '600px' : aspectRatio === '4:3' ? '450px' : '338px', fontSize: '1.125rem' },
  };

  const sizeConfig = sizes[size];

  // Check if camera is available
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsCameraAvailable(true);
    }
  }, []);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const containerStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
    alignSelf: 'flex-start',
  };

  const captureContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: isFullscreen ? '100%' : sizeConfig.width,
    height: isFullscreen ? 'calc(100vh - 200px)' : sizeConfig.height,
    margin: '0 auto',
    borderRadius: borderRadius.lg,
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

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isHovering ? 0.7 : 1,
    transition: `opacity ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  const videoStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    width: '100%',
    height: '100%',
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
    borderRadius: borderRadius.lg,
    pointerEvents: 'none',
  };

  const controlsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    width: '100%',
  };

  const fullscreenButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  const removeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.md,
    right: isFullscreen ? spacing.xl : spacing.md,
    zIndex: 10,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    opacity: value ? 1 : 0,
    transform: value ? 'scale(1)' : 'scale(0.8)',
    pointerEvents: value ? 'auto' : 'none',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  };

  const successStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#10b981',
    marginTop: spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
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
    if (!disabled && !isCameraActive && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isCameraActive]);

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
    
    // Stop camera if active
    if (isCameraActive && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, [onChange, isCameraActive]);

  const startCamera = useCallback(async () => {
    if (disabled) return;
    
    try {
      setIsLoading(true);
      setValidationError(null);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsCameraActive(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setValidationError('Could not access camera. Please check permissions.');
      setIsLoading(false);
    }
  }, [disabled]);

  const capturePhoto = useCallback(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64
      const base64Image = canvas.toDataURL('image/jpeg');
      onChange?.(base64Image);
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setIsCameraActive(false);
    }
  }, [isCameraActive, onChange]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .photo-capture-container:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.glassHover};
            border-color: ${colors.border.medium};
          }
          
          .photo-capture-container.dragging {
            transform: scale(1.02);
            box-shadow: ${shadows.glassHover}, 0 0 0 4px rgba(99, 102, 241, 0.2);
            border-color: ${colors.border.medium};
          }
          
          .photo-capture-remove:hover {
            background: #ef4444;
            color: white;
            transform: scale(1.1);
          }
          
          .photo-capture-fullscreen:hover {
            background: ${colors.glass.secondary};
            transform: scale(1.1);
          }
          
          .photo-capture-loading {
            animation: pulse 1.5s infinite;
          }
          
          .photo-capture-input {
            display: none;
          }
          
          /* Ensure proper contrast in both themes */
          .photo-capture-placeholder {
            color: ${colors.text.secondary} !important;
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .photo-capture-container {
              border: 3px solid ${colors.border.medium} !important;
            }
            
            .photo-capture-placeholder {
              color: ${colors.text.primary} !important;
              font-weight: 700 !important;
            }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .photo-capture-container,
            .photo-capture-image,
            .photo-capture-overlay,
            .photo-capture-remove,
            .photo-capture-fullscreen {
              transition: none !important;
            }
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .photo-capture-container {
              width: 100% !important;
              height: auto !important;
              aspect-ratio: ${aspectRatio === 'square' ? '1/1' : aspectRatio === '4:3' ? '4/3' : '16/9'};
            }
            
            .photo-capture-controls {
              flex-wrap: wrap;
              justify-content: center;
            }
          }
          
          /* Fullscreen mode */
          .photo-capture-fullscreen-mode {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
          }
          
          /* Camera shutter animation */
          @keyframes shutter {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          .camera-shutter {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            opacity: 0;
            pointer-events: none;
          }
          
          .camera-shutter.active {
            animation: shutter 0.5s ease-out;
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
          style={captureContainerStyles}
          className={`photo-capture-container ${isDragging ? 'dragging' : ''} ${isLoading ? 'photo-capture-loading' : ''} ${isFullscreen ? 'photo-capture-fullscreen-mode' : ''}`}
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
            className="photo-capture-input"
          />
          
          {value ? (
            <>
              <img 
                src={value} 
                alt="Captured" 
                style={imageStyles}
                className="photo-capture-image"
              />
              <div style={overlayStyles} className="photo-capture-overlay">
                <Camera size={32} color="white" />
              </div>
            </>
          ) : isCameraActive ? (
            <video 
              ref={videoRef} 
              style={videoStyles} 
              autoPlay 
              playsInline 
              muted
            />
          ) : (
            <div style={placeholderStyles} className="photo-capture-placeholder">
              <Camera size={32} />
              <div>
                {isLoading ? 'Processing...' : 'Click or drag to upload'}
              </div>
            </div>
          )}
          
          {/* Fullscreen toggle button */}
          {(value || isCameraActive) && (
            <button
              type="button"
              style={fullscreenButtonStyles}
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="photo-capture-fullscreen"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          
          {/* Remove button */}
          {(value || isCameraActive) && (
            <button
              type="button"
              style={removeButtonStyles}
              onClick={handleRemove}
              className="photo-capture-remove"
              title="Remove image"
            >
              <X size={16} />
            </button>
          )}
          
          {/* Hidden canvas for capturing photos */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Camera shutter effect */}
          <div className={`camera-shutter ${isLoading ? 'active' : ''}`} />
        </div>
        
        {/* Controls */}
        <div style={controlsContainerStyles} className="photo-capture-controls">
          {isCameraActive ? (
            <GlassButton 
              variant="primary" 
              onClick={capturePhoto}
              disabled={disabled || isLoading}
            >
              <Camera size={16} style={{ marginRight: spacing.sm }} />
              Capture Photo
            </GlassButton>
          ) : (
            <>
              {isCameraAvailable && (
                <GlassButton 
                  variant="primary" 
                  onClick={startCamera}
                  disabled={disabled || isLoading}
                >
                  <Camera size={16} style={{ marginRight: spacing.sm }} />
                  Use Camera
                </GlassButton>
              )}
              <GlassButton 
                variant="ghost" 
                onClick={handleClick}
                disabled={disabled || isLoading}
              >
                <Upload size={16} style={{ marginRight: spacing.sm }} />
                Upload Image
              </GlassButton>
            </>
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
            <span>Image captured successfully</span>
          </div>
        )}
        
        <div style={{ 
          fontSize: '0.75rem', 
          color: colors.text.secondary, 
          marginTop: spacing.xs,
          textAlign: 'center',
          alignSelf: 'flex-start'
        }}>
          Allowed formats: {allowedTypes.map(type => type.replace('image/', '')).join(', ')}
          <br />
          Max size: {maxSizeInMB}MB
        </div>
      </div>
    </>
  );
};