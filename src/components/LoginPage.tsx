import React, { useState, CSSProperties } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle, Sparkles, Zap, Star } from 'lucide-react';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows, animations } from '../ui';
import { GlassButton } from '../ui/components';
import { useTranslation } from 'react-i18next';

import styles from './Badge.module.css';

// Reusable Badge Component with optimized styles
const Badge = ({ id, label, color }: { id: string; label: string; color: string }) => {
  const gradient = {
    'emerald': 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
    'indigo': 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)',
    'amber': 'linear-gradient(135deg, #b45309 0%, #92400e 100%)'
  };

  const glow = {
    'emerald': 'rgba(4, 120, 87, 0.15)',
    'indigo': 'rgba(74, 45, 133, 0.15)',
    'amber': 'rgba(180, 83, 9, 0.15)'
  };

  // Inline styles for dynamic values
  const baseStyle: CSSProperties = {
    '--badge-glow': glow[color as keyof typeof glow],
    '--gradient': gradient[color as keyof typeof gradient],
    background: gradient[color as keyof typeof gradient],
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 0 30px var(--badge-glow), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  } as CSSProperties;

  return (
    <span 
      id={id}
      className={styles.glassStatusBadge}
      style={baseStyle}
    >
      <span className={styles.badgeDot} />
      <span className={styles.badgeText}>{label}</span>
    </span>
  );
};

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // MAIN CONTAINER STYLES - MISSING DEFINITION
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: colors.gradients.background,
  };

  // SMART TEXT COLORS based on theme
  const getTextColor = (type: 'primary' | 'secondary' | 'violet') => {
    if (theme === 'light') {
      switch (type) {
        case 'primary':
          return 'rgba(30, 30, 30, 0.95)'; // Dark text for light theme
        case 'secondary':
          return 'rgba(60, 60, 60, 0.85)'; // Dark secondary for light theme
        case 'violet':
          return colors.text.violet; // Use theme-aware violet color
        default:
          return 'rgba(30, 30, 30, 0.95)';
      }
    } else {
      switch (type) {
        case 'primary':
          return 'rgba(255, 255, 255, 0.98)'; // White text for dark theme
        case 'secondary':
          return 'rgba(255, 255, 255, 0.8)'; // White secondary for dark theme
        case 'violet':
          return colors.text.violet; // Use theme-aware violet color
        default:
          return 'rgba(255, 255, 255, 0.98)';
      }
    }
  };

  // LEFT SIDE - NEBULA DESIGN - NOW THEME-AWARE
  const leftSideStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    position: 'relative',
    background: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)',
    overflow: 'hidden',
  };

  // RIGHT SIDE - LOGIN FORM - NOW THEME-AWARE
  const rightSideStyles: React.CSSProperties = {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    background: colors.glass.primary, // THEME-AWARE BACKGROUND
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderLeft: `2px solid ${colors.border.medium}`, // THEME-AWARE BORDER
    position: 'relative',
  };

  const formContainerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    background: colors.glass.primary, // THEME-AWARE BACKGROUND
    border: `2px solid ${colors.border.medium}`, // THEME-AWARE BORDER
    borderRadius: borderRadius['2xl'],
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    boxShadow: `${shadows.modal}, 0 0 60px rgba(74, 45, 133, 0.3)`, // Using Nebula brand color
    padding: spacing['3xl'],
    position: 'relative',
    zIndex: 10,
    animation: 'slideIn 0.6s ease-out',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  };

  const logoStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    background: 'transparent',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${spacing.xl}`,
    border: `2px solid ${colors.border.light}`, // THEME-AWARE BORDER
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 12px 40px rgba(74, 45, 133, 0.4)', // Using Nebula brand color
    overflow: 'hidden',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: '800',
    color: getTextColor('violet'), // SMART COLOR SWITCHING
    marginBottom: spacing.md,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '1rem',
    color: getTextColor('secondary'), // SMART COLOR SWITCHING
    fontWeight: '500',
    lineHeight: '1.6',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  };

  const inputGroupStyles: React.CSSProperties = {
    position: 'relative',
  };

  const inputWithIconStyles: React.CSSProperties = {
    position: 'relative',
  };

  const inputIconStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    color: getTextColor('secondary'), // SMART COLOR SWITCHING
    zIndex: 2,
  };

  const passwordToggleStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: getTextColor('secondary'), // SMART COLOR SWITCHING
    cursor: 'pointer',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    zIndex: 2,
  };

  const errorStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: '#ef4444',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginTop: spacing.sm,
    padding: spacing.sm,
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.md,
    border: '1px solid rgba(239, 68, 68, 0.3)',
  };

  const successStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: '#22c55e',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginTop: spacing.sm,
    padding: spacing.sm,
    background: 'rgba(34, 197, 94, 0.1)',
    borderRadius: borderRadius.md,
    border: '1px solid rgba(34, 197, 94, 0.3)',
  };

  const passwordStrengthStyles: React.CSSProperties = {
    marginTop: spacing.md,
  };

  const strengthBarStyles: React.CSSProperties = {
    width: '100%',
    height: '6px',
    background: colors.glass.secondary, // THEME-AWARE BACKGROUND
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  };

  const strengthLabelStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'right',
  };


  // Consistent input styles for both email and password
  const inputBaseStyles: React.CSSProperties = {
    width: '100%',
    height: '56px',
    padding: `${spacing.lg} ${spacing.xl}`,
    paddingLeft: '3.5rem',
    background: colors.glass.primary, // THEME-AWARE BACKGROUND
    border: `2px solid ${colors.border.light}`, // THEME-AWARE BORDER
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    fontSize: '1rem',
    fontWeight: '500',
    color: getTextColor('primary'), // SMART COLOR SWITCHING
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: shadows.glass,
  };

  const passwordInputStyles: React.CSSProperties = {
    ...inputBaseStyles,
    paddingRight: '3.5rem',
  };

  const validateUsername = (username: string): string | undefined => {
    if (!username) return t('common.required');
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return t('common.required');
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&=])/.test(password)) return 'Password must contain at least one special character';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    const usernameError = validateUsername(formData.email);
    const passwordError = validatePassword(formData.password);

    if (usernameError) newErrors.email = usernameError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear errors on input change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation for better UX
    if (isSubmitted) {
      const newErrors = { ...errors };
      if (field === 'email') {
        const usernameError = validateUsername(value);
        if (usernameError) newErrors.email = usernameError;
        else delete newErrors.email;
      }
      if (field === 'password') {
        const passwordError = validatePassword(value);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic with updated credentials
      if (formData.email === 'sadmin' && formData.password === 'Nebula=2020') {
        onLogin(formData);
      } else {
        setErrors({ general: 'Invalid username or password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&=])/.test(password)) strength++;

    if (strength <= 2) return { strength: strength * 20, label: 'Weak', color: '#ef4444' };
    if (strength <= 3) return { strength: strength * 20, label: 'Fair', color: '#f59e0b' };
    if (strength <= 4) return { strength: strength * 20, label: 'Good', color: '#10b981' };
    return { strength: 100, label: 'Strong', color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const strengthFillStyles: React.CSSProperties = {
    height: '100%',
    width: `${passwordStrength.strength}%`,
    background: passwordStrength.color,
    borderRadius: borderRadius.full,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-15px); }
            75% { transform: translateY(15px) translateX(20px); }
          }
          
          @keyframes sparkle {
            0%, 100% { 
              opacity: 0.3;
              transform: scale(1) rotate(0deg);
            }
            50% { 
              opacity: 1;
              transform: scale(1.2) rotate(180deg);
            }
          }
          
          @keyframes nebulaPulse {
            0%, 100% { 
              opacity: 0.6;
              transform: scale(1);
            }
            50% { 
              opacity: 1;
              transform: scale(1.05);
            }
          }
          
          .login-input {
            height: 56px !important;
          }
          
          .login-input::placeholder {
            color: ${getTextColor('secondary')} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .login-input:focus {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover}, 0 0 0 4px rgba(74, 45, 133, 0.1) !important;
          }
          
          .login-input {
            -webkit-text-fill-color: ${getTextColor('primary')} !important;
            -webkit-opacity: 1 !important;
          }
          
          .password-toggle:hover {
            background: ${colors.glass.secondary} !important;
            color: ${getTextColor('primary')} !important;
          }
          
          .form-container:hover {
            box-shadow: ${shadows.modal}, 0 0 80px rgba(74, 45, 133, 0.4) !important;
          }
          
          .logo-container {
            animation: pulse 3s ease-in-out infinite;
          }
          
          .nebula-element {
            animation: float 8s ease-in-out infinite;
          }
          
          .sparkle-element {
            animation: sparkle 4s ease-in-out infinite;
          }
          
          .nebula-glow {
            animation: nebulaPulse 6s ease-in-out infinite;
          }
          
          /* Responsive design */
          @media (max-width: 1024px) {
            .login-container {
              flex-direction: column !important;
            }
            
            .login-left {
              min-height: 40vh !important;
              width: 100% !important;
            }
            
            .login-right {
              width: 100% !important;
              border-left: none !important;
              border-top: 2px solid ${colors.border.medium} !important;
            }
            
            .badges-container {
              flex-direction: row !important;
              flex-wrap: wrap !important;
              justify-content: center !important;
            }
          }
          
          @media (max-width: 768px) {
            .form-container {
              padding: ${spacing['2xl']} !important;
              margin: ${spacing.lg} !important;
            }
            
            .login-title {
              font-size: 1.75rem !important;
            }
            
            .login-subtitle {
              font-size: 0.875rem !important;
            }
            
            .logo-container {
              width: 60px !important;
              height: 60px !important;
            }
            
            .login-left {
              padding: ${spacing['2xl']} !important;
            }
            
            .login-right {
              padding: ${spacing['2xl']} !important;
            }
          }
          
          @media (max-width: 480px) {
            .form-container {
              padding: ${spacing.xl} !important;
              margin: ${spacing.md} !important;
            }
            
            .login-title {
              font-size: 1.5rem !important;
            }
            
            .login-left {
              padding: ${spacing.xl} !important;
              min-height: 30vh !important;
            }
            
            .login-right {
              padding: ${spacing.xl} !important;
            }
          }
        `}
      </style>

      <div id="NEB33" style={containerStyles} className="login-container">
        {/* Xecutables - Top Left */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1.25rem',
          borderRadius: '50px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <img
            id="NEB54"
            src="/Xecutables.png"
            alt="Xecutables Private Limited"
            style={{
              height: '50px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              transition: 'all 0.2s ease',
              transformOrigin: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{
            height: '40px',
            width: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
            margin: '0 0.5rem'
          }} />
          <p 
            id="NEB53" 
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em'
            }}
          >
            {t('common.poweredBy')}
          </p>
        </div>

        {/* LEFT SIDE - STUNNING NEBULA DESIGN - NOW THEME-AWARE */}
        <div id="NEB34" style={leftSideStyles} className="login-left">
          {/* Background SVG from login-template.svg */}
          <div id="NEB35" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              id="NEB36"
              src="/login-template.svg"
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.6,
                position: 'absolute',
              }}
            />
          </div>

          {/* Floating Nebula Elements - NOW USING THEME-AWARE COLORS */}
          <div id="NEB37" style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(223, 94, 255, 0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }} className="nebula-element" />

          <div id="NEB38" style={{
            position: 'absolute',
            top: '60%',
            right: '25%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(177, 70, 254, 0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animationDelay: '2s',
          }} className="nebula-element" />

          <div id="NEB39" style={{
            position: 'absolute',
            bottom: '30%',
            left: '30%',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(133, 4, 254, 0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(1.5px)',
            animationDelay: '4s',
          }} className="nebula-element" />

          {/* Sparkle Effects */}
          <div id="NEB40" style={{
            position: 'absolute',
            top: '15%',
            right: '20%',
            color: 'rgba(255, 255, 255, 0.8)',
          }} className="sparkle-element">
            <Sparkles size={24} />
          </div>

          <div id="NEB41" style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            color: 'rgba(255, 255, 255, 0.6)',
            animationDelay: '2s',
          }} className="sparkle-element">
            <Star size={20} />
          </div>

          <div id="NEB42" style={{
            position: 'absolute',
            top: '40%',
            left: '15%',
            color: 'rgba(255, 255, 255, 0.7)',
            animationDelay: '3s',
          }} className="sparkle-element">
            <Zap size={18} />
          </div>

          {/* Central Nebula Logo */}
          <div 
            id="NEB43" 
            className="nebula-header" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              position: 'relative',
              height: '100%',
              width: '100%',
              padding: '2rem 0',
              margin: 'auto'
            }}
          >
            {/* Logo and Title Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'nowrap',
              transform: 'translateY(-10%)' /* Fine-tune vertical position */
            }}>
              {/* Logo Container */}
              <div 
                className="nebula-logo-container"
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'transparent',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 15px 45px rgba(74, 45, 133, 0.5)',
                  overflow: 'visible', /* Changed to visible to allow logo to extend */
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  transform: 'scale(0.9)'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'scale(1.45)' /* Further increased scale for larger logo */
                }}>
                  <img
                    id="NEB45"
                    src="/Nebula_Logo_H6.svg"
                    alt="Nebula Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </div>

              {/* Title */}
              <h1 
                id="NEB46" 
                className="nebula-title"
                style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.95)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                Nebula
              </h1>
            </div>

            {/* Subtitle */}
            <p 
              id="NEB47" 
              className="nebula-subtitle" 
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                lineHeight: 1.2,
                margin: '0',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                letterSpacing: '0.02em',
                width: '100%',
                padding: '0 1rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Advanced Identity &amp; Access Management Platform
            </p>

            {/* Status Badges */}
            <div 
              id="NEB48" 
              className="badges-container"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                margin: '1.5rem 0',
              }}
            >
              <Badge id="NEB49" label="Enterprise Ready" color="emerald" />
              <Badge id="NEB50" label="Cloud Native" color="indigo" />
              <Badge id="NEB51" label="AI Powered" color="amber" />
            </div>

            {/* Spacer to maintain layout */}
            <div style={{ height: '1.5rem' }}></div>
          </div>
        </div>

        {/* RIGHT SIDE - COMPACT LOGIN FORM - NOW THEME-AWARE */}
        <div id="NEB55" style={rightSideStyles} className="login-right">
          <div id="NEB56" style={formContainerStyles} className="form-container">
            {/* Header */}
            <div id="NEB57" style={headerStyles}>
              <div id="NEB58" style={logoStyles} className="logo-container">
                <img
                  id="NEB59"
                  src="/Nebula_Logo_H6.svg"
                  alt="Nebula Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
              </div>
              <h2 id="NEB60" style={titleStyles} className="login-title">
                {t('common.welcome')}
              </h2>
              <p id="NEB61" style={subtitleStyles} className="login-subtitle">
                {t('common.signInTo')}
              </p>
            </div>

            {/* Login Form */}
            <form id="NEB62" onSubmit={handleSubmit} style={formStyles}>
              {/* General Error */}
              {errors.general && (
                <div id="NEB63" style={errorStyles}>
                  <AlertCircle size={16} />
                  {errors.general}
                </div>
              )}

              {/* Username Field */}
              <div id="NEB64" style={inputGroupStyles}>
                <div id="NEB65" style={inputWithIconStyles}>
                  <div id="NEB66" style={inputIconStyles}>
                    <User size={20} />
                  </div>
                  <input
                    id="NEB67"
                    type="text"
                    placeholder={t('common.enterUsername')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={inputBaseStyles}
                    className="login-input"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div id="NEB68" style={errorStyles}>
                    <AlertCircle size={16} />
                    {errors.email}
                  </div>
                )}
                {!errors.email && formData.email && validateUsername(formData.email) === undefined && (
                  <div id="NEB69" style={successStyles}>
                    <CheckCircle size={16} />
                    Valid username
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div id="NEB70" style={inputGroupStyles}>
                <div id="NEB71" style={inputWithIconStyles}>
                  <div id="NEB72" style={inputIconStyles}>
                    <Lock size={20} />
                  </div>
                  <input
                    id="NEB73"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('common.enterPassword')}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    style={passwordInputStyles}
                    className="login-input"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    id="NEB74"
                    type="button"
                    style={passwordToggleStyles}
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div id="NEB75" style={passwordStrengthStyles}>
                    <div id="NEB76" style={strengthBarStyles}>
                      <div id="NEB77" style={strengthFillStyles} />
                    </div>
                    <div id="NEB78" style={{
                      ...strengthLabelStyles,
                      color: passwordStrength.color,
                    }}>
                      {t('common.passwordStrength')}: {passwordStrength.label}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div id="NEB79" style={errorStyles}>
                    <AlertCircle size={16} />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <GlassButton
                id="NEB80"
                variant="primary"
                size="lg"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? t('common.loading') : t('common.login') + ' to Nebula'}
              </GlassButton>
            </form>

            {/* Demo Credentials */}
            {/* <div id="NEB81" style={demoCredentialsStyles}>
              <h4 id="NEB82" style={{
                margin: `0 0 ${spacing.md} 0`,
                fontSize: '0.875rem',
                fontWeight: '700',
                color: getTextColor('primary'), // SMART COLOR SWITCHING
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {t('common.demoCredentials')}
              </h4>
              <div id="NEB83" style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <div id="NEB84" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span id="NEB85" style={{ fontSize: '0.875rem', color: getTextColor('secondary'), fontWeight: '500' }}>
                    {t('common.username')}:
                  </span>
                  <GlassStatusBadge id="NEB86" status="info" label="sadmin" size="sm" />
                </div>
                <div id="NEB87" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span id="NEB88" style={{ fontSize: '0.875rem', color: getTextColor('secondary'), fontWeight: '500' }}>
                    {t('common.password')}:
                  </span>
                  <GlassStatusBadge id="NEB89" status="info" label="Nebula=2020" size="sm" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
