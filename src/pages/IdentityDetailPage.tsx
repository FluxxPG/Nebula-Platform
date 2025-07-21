import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Shield, CreditCard, Key, MapPin, Calendar, Phone, Mail, Plus, Save, ChevronLeft, ChevronRight, Smartphone, Laptop, X, Check } from 'lucide-react';
import { BentoGrid, BentoCard } from '../ui/layouts';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassStatusBadge, GlassAvatar, GlassProgress, GlassModal, GlassInput, GlassDropdown } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { colors, spacing, borderRadius, shadows } from '../ui';
import { Identity, AccessCard } from '../types/identity';
import { FormWidget, FormData, ValidationError } from '../types/designer';
import { WidgetSelector } from '../components/designer/WidgetSelector';
import { FormRenderer } from '../components/designer/FormRenderer';

interface IdentityDetailPageProps {
  identity: Identity;
  onBack: () => void;
}

export const IdentityDetailPage: React.FC<IdentityDetailPageProps> = ({ identity, onBack }) => {
  const themeColors = useThemeColors();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);
  const [formWidgets, setFormWidgets] = useState<FormWidget[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Card management state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<AccessCard | null>(null);
  const [newCardData, setNewCardData] = useState<Partial<AccessCard>>({
    cardType: 'physical',
    status: 'active',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0],
    accessZones: [],
  });
  const [availableAccessZones, setAvailableAccessZones] = useState<string[]>([
    'Building A', 'Building B', 'Engineering Floor', 'Marketing Floor', 
    'Executive Floor', 'Server Room', 'Conference Rooms', 'Security Office',
    'Parking Garage', 'Cafeteria', 'Gym', 'Digital Assets', 'All Areas'
  ]);

  // Load any saved form widgets for this identity
  useEffect(() => {
    const savedWidgets = localStorage.getItem(`identity-form-widgets-${identity.id}`);
    if (savedWidgets) {
      try {
        setFormWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.error('Failed to load saved widgets:', error);
      }
    }

    // Initialize form data with identity data
    const initialData: FormData = {
      firstName: identity.firstname,
      lastName: identity.lastname,
      email: identity.email,
      phone: identity.phone || '',
      department: identity.company,
      position: identity.position,
      employeeId: identity.employeeid,
      location: identity.location,
      manager: identity.manager || '',
    };
    setFormData(initialData);
  }, [identity]);

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'super_admin': return 'error';
      case 'admin': return 'warning';
      case 'standard': return 'success';
      default: return 'inactive';
    }
  };

  const handleAddWidget = (widget: FormWidget) => {
    const updatedWidgets = [...formWidgets, widget];
    setFormWidgets(updatedWidgets);
    
    // Save widgets to localStorage
    localStorage.setItem(`identity-form-widgets-${identity.id}`, JSON.stringify(updatedWidgets));
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (confirm('Are you sure you want to remove this widget?')) {
      const updatedWidgets = formWidgets.filter(widget => widget.id !== widgetId);
      setFormWidgets(updatedWidgets);
      
      // Save widgets to localStorage
      localStorage.setItem(`identity-form-widgets-${identity.id}`, JSON.stringify(updatedWidgets));
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    formWidgets.forEach(widget => {
      widget.fields.forEach(field => {
        const value = formData[field.id];
        
        if (field.validations && field.validations.length > 0) {
          field.validations.forEach(validation => {
            if (!validation.enabled) return;

            switch (validation.type) {
              case 'required':
                if (value === undefined || value === null || value === '') {
                  errors.push({ fieldId: field.id, message: validation.message || 'This field is required' });
                }
                break;
              case 'minLength':
                if (value && typeof value === 'string' && validation.value && value.length < Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Minimum length is ${validation.value} characters` });
                }
                break;
              case 'maxLength':
                if (value && typeof value === 'string' && validation.value && value.length > Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Maximum length is ${validation.value} characters` });
                }
                break;
              case 'email':
                if (value && typeof value === 'string') {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid email address' });
                  }
                }
                break;
              case 'number':
                if (value && isNaN(Number(value))) {
                  errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid number' });
                }
                break;
              case 'pattern':
                if (value && typeof value === 'string' && validation.value) {
                  try {
                    const regex = new RegExp(String(validation.value));
                    if (!regex.test(value)) {
                      errors.push({ fieldId: field.id, message: validation.message || 'Value does not match the required pattern' });
                    }
                  } catch (error) {
                    console.error('Invalid regex pattern:', validation.value);
                  }
                }
                break;
            }
          });
        }

        // Also check required flag even if no validations are defined
        if (field.required && (value === undefined || value === null || value === '')) {
          // Only add this error if there isn't already a required validation error for this field
          if (!errors.some(error => error.fieldId === field.id)) {
            errors.push({ fieldId: field.id, message: 'This field is required' });
          }
        }
      });
    });

    return errors;
  };

  const handleSubmit = (data: FormData) => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Save form data to localStorage
        localStorage.setItem(`identity-form-data-${identity.id}`, JSON.stringify(data));
        
        // Exit edit mode
        setIsEditMode(false);
        setIsSubmitting(false);
        
        // Show success message
        alert('Identity updated successfully!');
      }, 1000);
    }
  };

  // Card carousel navigation
  const handleNextCard = () => {
    if (identity.cards.length > 1) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % identity.cards.length);
    }
  };

  const handlePrevCard = () => {
    if (identity.cards.length > 1) {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + identity.cards.length) % identity.cards.length);
    }
  };

  // Card management functions
  const handleAddCard = () => {
    setNewCardData({
      cardType: 'physical',
      status: 'active',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0],
      accessZones: [],
    });
    setIsAddCardModalOpen(true);
  };

  const handleEditCard = (card: AccessCard) => {
    setSelectedCard(card);
    setNewCardData({
      cardNumber: card.cardNumber,
      cardType: card.cardType,
      status: card.status,
      issuedDate: new Date(card.issuedDate).toISOString().split('T')[0],
      expiryDate: new Date(card.expiryDate).toISOString().split('T')[0],
      accessZones: card.accessZones,
    });
    setIsEditCardModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this access card?')) {
      // In a real app, you would call an API to delete the card
      alert('Card deleted successfully!');
      
      // If this was the last card in the carousel, adjust the index
      if (currentCardIndex >= identity.cards.length - 1) {
        setCurrentCardIndex(Math.max(0, identity.cards.length - 2));
      }
    }
  };

  const handleSaveCard = (isNew: boolean) => {
    if (!newCardData.cardNumber) {
      alert('Card number is required');
      return;
    }

    if (!newCardData.issuedDate) {
      alert('Issue date is required');
      return;
    }

    if (!newCardData.expiryDate) {
      alert('Expiry date is required');
      return;
    }

    // In a real app, you would call an API to save the card
    setTimeout(() => {
      if (isNew) {
        alert('Card added successfully!');
        setIsAddCardModalOpen(false);
      } else {
        alert('Card updated successfully!');
        setIsEditCardModalOpen(false);
      }
      
      // Reset form
      setNewCardData({
        cardType: 'physical',
        status: 'active',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0],
        accessZones: [],
      });
      setSelectedCard(null);
    }, 500);
  };

  const handleAccessZoneToggle = (zone: string) => {
    const currentZones = newCardData.accessZones || [];
    if (currentZones.includes(zone)) {
      setNewCardData({
        ...newCardData,
        accessZones: currentZones.filter(z => z !== zone)
      });
    } else {
      setNewCardData({
        ...newCardData,
        accessZones: [...currentZones, zone]
      });
    }
  };

  // Card rendering
  const renderAccessCard = (card: AccessCard) => {
    // Different styles based on card type
    const getCardStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        aspectRatio: '1.586/1', // Standard card aspect ratio
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: shadows.glassHover,
        transition: 'all 0.3s ease',
      };

      switch (card.cardType) {
        case 'physical':
          return {
            ...baseStyles,
            background: 'linear-gradient(135deg, #4A2D85 0%, #6A4098 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          };
        case 'mobile':
          return {
            ...baseStyles,
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          };
        case 'virtual':
          return {
            ...baseStyles,
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          };
        default:
          return baseStyles;
      }
    };

    // Card icon based on type
    const getCardIcon = () => {
      switch (card.cardType) {
        case 'physical':
          return <CreditCard size={24} style={{ color: 'white' }} />;
        case 'mobile':
          return <Smartphone size={24} style={{ color: 'white' }} />;
        case 'virtual':
          return <Laptop size={24} style={{ color: 'white' }} />;
        default:
          return <CreditCard size={24} style={{ color: 'white' }} />;
      }
    };

    return (
      <div style={getCardStyles()}>
        {/* Card background effects */}
       
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }} />
        
        {/* Holographic effect */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          zIndex: 0,
        }} />

        {/* Card Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            {getCardIcon()}
            <div>
              <div style={{ 
                color: 'white', 
                fontSize: '1.25rem', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}>
                Access Card
              </div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              }}>
                {card.cardType}
              </div>
            </div>
          </div>
          
          <GlassStatusBadge status={card.status as any} size="md" />
        </div>

        {/* Card Number */}
        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'white',
          letterSpacing: '0.05em',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          zIndex: 1,
          marginTop: spacing.xl,
          marginBottom: spacing.xl,
        }}>
          {card.cardNumber}
        </div>

        {/* Card Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: spacing.lg,
          zIndex: 1,
        }}>
          <div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              marginBottom: spacing.xs,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}>
              Issued Date
            </div>
            <div style={{ 
              color: 'white', 
              fontSize: '0.875rem',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}>
              {new Date(card.issuedDate).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.75rem',
              marginBottom: spacing.xs,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}>
              Expiry Date
            </div>
            <div style={{ 
              color: 'white', 
              fontSize: '0.875rem',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}>
              {new Date(card.expiryDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div style={{ 
          marginTop: spacing.xl,
          zIndex: 1,
        }}>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '0.75rem',
            marginBottom: spacing.xs,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}>
            Access Zones ({card.accessZones.length})
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: spacing.xs,
          }}>
            {card.accessZones.slice(0, 3).map((zone, index) => (
              <span key={index} style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: borderRadius.md,
                fontSize: '0.75rem',
                color: 'white',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              }}>
                {zone}
              </span>
            ))}
            {card.accessZones.length > 3 && (
              <span style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: borderRadius.md,
                fontSize: '0.75rem',
                color: 'white',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              }}>
                +{card.accessZones.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div style={{
          position: 'absolute',
          top: spacing.md,
          right: spacing.md,
          display: 'flex',
          gap: spacing.xs,
          marginTop:spacing['4xl'],
          marginRight:spacing.md,
          zIndex: 2
        }}>
         
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCard(card);
            }}
          >
            <Edit size={14} />
          </GlassButton>
          <GlassButton
            variant="error"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCard(card.id);
            }}
          >
            <Trash2 size={14} />
          </GlassButton>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title={`${identity.firstname} ${identity.lastname}`}
      subtitle={`${identity.position} • ${identity.company}`}
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} style={{ marginRight: spacing.sm }} />
            Back
          </GlassButton>
          
          {isEditMode ? (
            <>
              <GlassButton 
                variant="ghost" 
                onClick={() => setIsWidgetSelectorOpen(true)}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Form Widget
              </GlassButton>
              
              <GlassButton 
                variant="primary" 
                onClick={() => setIsEditMode(false)}
              >
                Cancel Editing
              </GlassButton>
            </>
          ) : (
            <GlassButton 
              variant="primary" 
              onClick={() => setIsEditMode(true)}
            >
              <Edit size={16} style={{ marginRight: spacing.sm }} />
              Design Page
            </GlassButton>
          )}
          
          <GlassButton variant="accent">
            <Shield size={16} style={{ marginRight: spacing.sm }} />
            Security Actions
          </GlassButton>
        </div>
      }
    >
      {isEditMode ? (
        // Edit Mode - Show Form Widgets
        <div style={{
          background: themeColors.glass.primary,
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          marginBottom: spacing['4xl'],
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: themeColors.text.primary,
              margin: 0,
            }}>
              Edit Identity Information
            </h2>
            
            <GlassButton 
              variant="success" 
              onClick={() => handleSubmit(formData)}
              loading={isSubmitting}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Save Changes
            </GlassButton>
          </div>
          
          {formWidgets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: spacing['3xl'],
              color: themeColors.text.secondary,
               marginBottom: spacing['4xl'],
            }}>
              <Plus size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: themeColors.text.primary, 
                marginBottom: spacing.lg 
              }}>
                No Form Widgets Added
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                maxWidth: '500px', 
                margin: '0 auto',
                marginBottom: spacing.xl,
              }}>
                Click "Add Form Widget" to add form components from your saved designs.
              </p>
              <GlassButton 
                variant="primary" 
                onClick={() => setIsWidgetSelectorOpen(true)}
              >
                <Plus size={20} style={{ marginRight: spacing.sm }} />
                Add Form Widget
              </GlassButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
              {formWidgets.map((widget, index) => (
                <div key={widget.id} style={{
                  position: 'relative',
                  background: themeColors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                   marginBottom: spacing['4xl'],
                }}>
 
                  <div style={{
                    position: 'absolute',
                    top: spacing.md,
                    right: spacing.md,
                    zIndex: 10,
                  }}>
                    <GlassButton
                      variant="error"
                      size="sm"
                      onClick={() => handleRemoveWidget(widget.id)}
                    >
                      <Trash2 size={16} />
                    </GlassButton>
                  </div>
                  
                  <FormRenderer
                    widgets={[widget]}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                    validationErrors={validationErrors}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // View Mode - Show BentoGrid
        <BentoGrid columns={12} gap="lg">
          {/* Profile Overview */}
          <BentoCard span={4} variant="primary" padding="xl">
            <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
              <GlassAvatar
                src={identity.avatar}
                name={`${identity.firstname} ${identity.lastname}`}
                size="xl"
                status="online"
              />
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginTop: spacing.lg,
                marginBottom: spacing.sm,
              }}>
                {identity.firstname} {identity.lastname}
              </h2>
              <p style={{ color: themeColors.text.secondary, marginBottom: spacing.md }}>
                {identity.position}
              </p>
              <GlassStatusBadge
                status={getAccessLevelColor(identity.accessLevel) as any}
                label={identity.accessLevel.replace('_', ' ').toUpperCase()}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Mail size={16} style={{ color: themeColors.text.secondary }} />
                <span style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.email}
                </span>
              </div>
              {identity.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <Phone size={16} style={{ color: themeColors.text.secondary }} />
                  <span style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                    {identity.phone}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <MapPin size={16} style={{ color: themeColors.text.secondary }} />
                <span style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  {identity.location}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Calendar size={16} style={{ color: themeColors.text.secondary }} />
                <span style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                  Joined {new Date(identity.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Quick Stats */}
          <BentoCard span={8} variant="secondary" padding="lg">
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: themeColors.text.primary,
              marginBottom: spacing.lg,
            }}>
              Access Overview
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.lg }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: themeColors.text.primary,
                  marginBottom: spacing.xs,
                }}>
                  {identity.cards.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.secondary }}>
                  Access Cards
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: themeColors.text.primary,
                  marginBottom: spacing.xs,
                }}>
                  {identity.permissions.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.secondary }}>
                  Permissions
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: themeColors.text.primary,
                  marginBottom: spacing.xs,
                }}>
                  {identity.cards.reduce((acc, card) => acc + card.accessZones.length, 0)}
                </div>
                <div style={{ fontSize: '0.875rem', color: themeColors.text.secondary }}>
                  Access Zones
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <GlassStatusBadge status={identity.status as any} />
                <div style={{ fontSize: '0.875rem', color: themeColors.text.secondary, marginTop: spacing.xs }}>
                  Account Status
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Access Cards */}
          <BentoCard span={6} variant="elevated" padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: themeColors.text.primary,
              }}>
                Access Cards
              </h3>
              <GlassButton variant="primary" size="sm" onClick={handleAddCard}>
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Card
              </GlassButton>
            </div>
            
            {identity.cards.length > 0 ? (
              <div>
                {/* Card Carousel */}
                <div style={{ position: 'relative', marginBottom: spacing.lg }}>
                  {renderAccessCard(identity.cards[currentCardIndex])}
                  
                  {/* Carousel Navigation */}
                  {identity.cards.length > 1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      gap: spacing.md,
                      marginTop: spacing.md,
                    }}>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevCard}
                      >
                        <ChevronLeft size={16} />
                      </GlassButton>
                      
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: themeColors.text.secondary,
                        fontWeight: '500',
                      }}>
                        Card {currentCardIndex + 1} of {identity.cards.length}
                      </span>
                      
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={handleNextCard}
                      >
                        <ChevronRight size={16} />
                      </GlassButton>
                    </div>
                  )}
                </div>
                
                {/* Access Zones Summary */}
                <div style={{ 
                  padding: spacing.lg,
                  background: themeColors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${themeColors.border.light}`,
                }}>
                  <h4 style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: themeColors.text.primary,
                    marginBottom: spacing.md,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Access Zones
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                    {identity.cards[currentCardIndex].accessZones.map((zone, index) => (
                      <GlassStatusBadge
                        key={index}
                        status="info"
                        label={zone}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: spacing.xl,
                color: themeColors.text.secondary,
                background: themeColors.glass.secondary,
                borderRadius: borderRadius.lg,
                border: `1px solid ${themeColors.border.light}`,
              }}>
                <CreditCard size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: themeColors.text.primary, 
                  marginBottom: spacing.md 
                }}>
                  No Access Cards
                </h4>
                <p style={{ fontSize: '0.875rem', marginBottom: spacing.lg }}>
                  This identity doesn't have any access cards yet.
                </p>
                <GlassButton variant="primary" size="sm" onClick={handleAddCard}>
                  <Plus size={16} style={{ marginRight: spacing.sm }} />
                  Add First Card
                </GlassButton>
              </div>
            )}
          </BentoCard>

          {/* Permissions */}
          <BentoCard span={6} variant="primary" padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: themeColors.text.primary,
              }}>
                Permissions
              </h3>
              <GlassButton variant="ghost" size="sm">
                <Key size={16} style={{ marginRight: spacing.sm }} />
                Manage
              </GlassButton>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {identity.permissions.map((permission) => (
                <div key={permission.id} style={{
                  padding: spacing.lg,
                  background: themeColors.glass.secondary,
                  border: `1px solid ${themeColors.border.light}`,
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                    <div style={{ fontWeight: '600', color: themeColors.text.primary, fontSize: '0.875rem' }}>
                      {permission.name}
                    </div>
                    <GlassStatusBadge
                      status={permission.level === 'admin' ? 'error' : permission.level === 'write' ? 'warning' : 'success'}
                      label={permission.level.toUpperCase()}
                      size="sm"
                    />
                  </div>
                  
                  <div style={{ color: themeColors.text.secondary, fontSize: '0.75rem', marginBottom: spacing.sm }}>
                    {permission.description}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: themeColors.text.secondary }}>
                    <span>Category: {permission.category}</span>
                    <span>Granted: {new Date(permission.grantedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Activity Timeline */}
          <BentoCard span={12} variant="secondary" padding="lg">
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: themeColors.text.primary,
              marginBottom: spacing.lg,
            }}>
              Recent Activity
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.lg }}>
              <div style={{
                padding: spacing.lg,
                background: themeColors.glass.primary,
                border: `1px solid ${themeColors.border.light}`,
                borderRadius: '12px',
              }}>
                <div style={{ fontWeight: '600', color: themeColors.text.primary, marginBottom: spacing.sm }}>
                  Last Login
                </div>
                <div style={{ color: themeColors.text.secondary, fontSize: '0.875rem' }}>
                  {identity.lastLogin ? new Date(identity.lastLogin).toLocaleString() : 'Never'}
                </div>
              </div>
              
              <div style={{
                padding: spacing.lg,
                background: themeColors.glass.primary,
                border: `1px solid ${themeColors.border.light}`,
                borderRadius: '12px',
              }}>
                <div style={{ fontWeight: '600', color: themeColors.text.primary, marginBottom: spacing.sm }}>
                  Account Created
                </div>
                <div style={{ color: themeColors.text.secondary, fontSize: '0.875rem' }}>
                  {new Date(identity.joinDate).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{
                padding: spacing.lg,
                background: themeColors.glass.primary,
                border: `1px solid ${themeColors.border.light}`,
                borderRadius: '12px',
              }}>
                <div style={{ fontWeight: '600', color: themeColors.text.primary, marginBottom: spacing.sm }}>
                  Manager
                </div>
                <div style={{ color: themeColors.text.secondary, fontSize: '0.875rem' }}>
                  {identity.manager || 'Not assigned'}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Custom Form Widgets */}
          {formWidgets.length > 0 && (
            <BentoCard span={12} variant="elevated" padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: themeColors.text.primary,
                }}>
                  Additional Information
                </h3>
              </div>
              
              <FormRenderer
                widgets={formWidgets}
                formData={formData}
                readOnly={true}
              />
            </BentoCard>
          )}
        </BentoGrid>
      )}

      {/* Widget Selector Modal */}
      <GlassModal
        isOpen={isWidgetSelectorOpen}
        onClose={() => setIsWidgetSelectorOpen(false)}
        title="Add Form Widget"
      >
        <WidgetSelector
          onWidgetSelect={handleAddWidget}
          onClose={() => setIsWidgetSelectorOpen(false)}
        />
      </GlassModal>

      {/* Add Card Modal */}
      <GlassModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        title="Add Access Card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Card Number *
              </label>
              <GlassInput
                value={newCardData.cardNumber || ''}
                onChange={(value) => setNewCardData({ ...newCardData, cardNumber: value })}
                placeholder="Enter card number"
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Card Type *
              </label>
              <GlassDropdown
                options={[
                  { value: 'physical', label: 'Physical Card' },
                  { value: 'mobile', label: 'Mobile App' },
                  { value: 'virtual', label: 'Virtual Card' },
                ]}
                value={newCardData.cardType || 'physical'}
                onChange={(value) => setNewCardData({ ...newCardData, cardType: value as any })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Status *
              </label>
              <GlassDropdown
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'lost', label: 'Lost' },
                  { value: 'expired', label: 'Expired' },
                ]}
                value={newCardData.status || 'active'}
                onChange={(value) => setNewCardData({ ...newCardData, status: value as any })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Issue Date *
              </label>
              <GlassInput
                value={newCardData.issuedDate || ''}
                onChange={(value) => setNewCardData({ ...newCardData, issuedDate: value })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Expiry Date *
              </label>
              <GlassInput
                value={newCardData.expiryDate || ''}
                onChange={(value) => setNewCardData({ ...newCardData, expiryDate: value })}
              />
            </div>
          </div>
          
          {/* Access Zones */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: themeColors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Access Zones
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: spacing.md,
              maxHeight: '200px',
              overflowY: 'auto',
              padding: spacing.sm,
              background: themeColors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${themeColors.border.light}`,
            }}>
              {availableAccessZones.map((zone) => (
                <label key={zone} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: spacing.sm,
                  padding: spacing.sm,
                  cursor: 'pointer',
                  borderRadius: borderRadius.md,
                  transition: 'background 0.2s ease',
                }}>
                  <input
                    type="checkbox"
                    checked={(newCardData.accessZones || []).includes(zone)}
                    onChange={() => handleAccessZoneToggle(zone)}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: themeColors.text.primary,
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.875rem',
                    color: themeColors.text.primary,
                  }}>
                    {zone}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Selected Zones */}
          {(newCardData.accessZones || []).length > 0 && (
            <div style={{
              padding: spacing.md,
              background: themeColors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${themeColors.border.light}`,
            }}>
              <div style={{ 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Selected Zones ({(newCardData.accessZones || []).length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                {(newCardData.accessZones || []).map((zone) => (
                  <div key={zone} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: themeColors.glass.primary,
                    borderRadius: borderRadius.md,
                    fontSize: '0.75rem',
                    color: themeColors.text.primary,
                  }}>
                    {zone}
                    <button
                      onClick={() => handleAccessZoneToggle(zone)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: themeColors.text.secondary,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: spacing.md,
            marginTop: spacing.md,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${themeColors.border.light}`,
          }}>
            <GlassButton
              variant="ghost"
              onClick={() => setIsAddCardModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={() => handleSaveCard(true)}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Card
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Edit Card Modal */}
      <GlassModal
        isOpen={isEditCardModalOpen}
        onClose={() => setIsEditCardModalOpen(false)}
        title="Edit Access Card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Card Number *
              </label>
              <GlassInput
                value={newCardData.cardNumber || ''}
                onChange={(value) => setNewCardData({ ...newCardData, cardNumber: value })}
                placeholder="Enter card number"
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Card Type *
              </label>
              <GlassDropdown
                options={[
                  { value: 'physical', label: 'Physical Card' },
                  { value: 'mobile', label: 'Mobile App' },
                  { value: 'virtual', label: 'Virtual Card' },
                ]}
                value={newCardData.cardType || 'physical'}
                onChange={(value) => setNewCardData({ ...newCardData, cardType: value as any })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Status *
              </label>
              <GlassDropdown
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'lost', label: 'Lost' },
                  { value: 'expired', label: 'Expired' },
                ]}
                value={newCardData.status || 'active'}
                onChange={(value) => setNewCardData({ ...newCardData, status: value as any })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Issue Date *
              </label>
              <GlassInput
                value={newCardData.issuedDate || ''}
                onChange={(value) => setNewCardData({ ...newCardData, issuedDate: value })}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Expiry Date *
              </label>
              <GlassInput
                value={newCardData.expiryDate || ''}
                onChange={(value) => setNewCardData({ ...newCardData, expiryDate: value })}
              />
            </div>
          </div>
          
          {/* Access Zones */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: themeColors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Access Zones
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: spacing.md,
              maxHeight: '200px',
              overflowY: 'auto',
              padding: spacing.sm,
              background: themeColors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${themeColors.border.light}`,
            }}>
              {availableAccessZones.map((zone) => (
                <label key={zone} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: spacing.sm,
                  padding: spacing.sm,
                  cursor: 'pointer',
                  borderRadius: borderRadius.md,
                  transition: 'background 0.2s ease',
                }}>
                  <input
                    type="checkbox"
                    checked={(newCardData.accessZones || []).includes(zone)}
                    onChange={() => handleAccessZoneToggle(zone)}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: themeColors.text.primary,
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.875rem',
                    color: themeColors.text.primary,
                  }}>
                    {zone}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Selected Zones */}
          {(newCardData.accessZones || []).length > 0 && (
            <div style={{
              padding: spacing.md,
              background: themeColors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${themeColors.border.light}`,
            }}>
              <div style={{ 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Selected Zones ({(newCardData.accessZones || []).length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                {(newCardData.accessZones || []).map((zone) => (
                  <div key={zone} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: themeColors.glass.primary,
                    borderRadius: borderRadius.md,
                    fontSize: '0.75rem',
                    color: themeColors.text.primary,
                  }}>
                    {zone}
                    <button
                      onClick={() => handleAccessZoneToggle(zone)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: themeColors.text.secondary,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: spacing.md,
            marginTop: spacing.sm,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${themeColors.border.light}`,
          }}>
            <GlassButton
              variant="error"
              onClick={() => {
                if (selectedCard) {
                  handleDeleteCard(selectedCard.id);
                  setIsEditCardModalOpen(false);
                }
              }}
            >
              <Trash2 size={16} style={{ marginRight: spacing.sm }} />
              Delete Card
            </GlassButton>
            
            <div style={{ display: 'flex', gap: spacing.md }}>
              <GlassButton
                variant="ghost"
                onClick={() => setIsEditCardModalOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={() => handleSaveCard(false)}
              >
                <Check size={16} style={{ marginRight: spacing.sm }} />
                Save Changes
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>
    </PageLayout>
  );
};