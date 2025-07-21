import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  UserCheck, 
  Calendar, 
  Clock, 
  LogOut, 
  CheckSquare, 
  Camera, 
  X, 
  ArrowLeft, 
  User, 
  Building, 
  Tag, 
  Info, 
  AlertCircle, 
  Check,
  Maximize,
  Minimize,
  Keyboard
} from 'lucide-react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { 
  GlassButton, 
  GlassCard, 
  GlassInput, 
  GlassStatusBadge, 
  GlassModal, 
  GlassPhotoCapture 
} from '../../ui/components';
import { mockVisits, getVisitById, getAccessZoneOptions, getIdProofTypeOptions, checkInVisitor } from '../../data/visitorMockData';
import { Visit } from '../../types/visitor';
import { useNavigate } from 'react-router-dom';

export const VisitorKioskApp: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  
  // App states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'search' | 'details' | 'checkin' | 'success'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isVirtualKeyboardVisible, setIsVirtualKeyboardVisible] = useState(false);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  
  // Check-in form state
  const [cardNumber, setCardNumber] = useState('');
  const [idProofType, setIdProofType] = useState('');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedAccessZones, setSelectedAccessZones] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [accessZoneOptions, setAccessZoneOptions] = useState<Array<{
    value: string;
    label: string;
    requiresEscort: boolean;
  }>>([]);
  
  // Refs for input elements
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cardNumberInputRef = useRef<HTMLInputElement>(null);
  const idProofNumberInputRef = useRef<HTMLInputElement>(null);
  
  // Filtered visits based on search term
  const filteredVisits = React.useMemo(() => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    return mockVisits
      .filter(visit => 
        visit.status === 'scheduled' && 
        (visit.visitor.toLowerCase().includes(term) || 
         visit.visitorId.toLowerCase().includes(term) || 
         visit.host.toLowerCase().includes(term))
      )
      .slice(0, 5); // Limit to 5 results for better UX
  }, [searchTerm]);
  
  // Load access zone options
  useEffect(() => {
    const zoneOptions = getAccessZoneOptions();
    setAccessZoneOptions(zoneOptions);
  }, []);
  
  // Request fullscreen on component mount
  useEffect(() => {
    const handleFullscreen = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreen);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);
  
  // Focus on search input when step changes to search
  useEffect(() => {
    if (currentStep === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [currentStep]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Handle visit selection
  const handleVisitSelect = (visit: Visit) => {
    setSelectedVisit(visit);
    setCurrentStep('details');
  };
  
  // Handle back button
  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('search');
      setSelectedVisit(null);
    } else if (currentStep === 'checkin') {
      setCurrentStep('details');
      // Reset form data
      setCardNumber('');
      setIdProofType('');
      setIdProofNumber('');
      setPhoto(null);
      setSelectedAccessZones([]);
      setFormErrors({});
    } else if (currentStep === 'success') {
      // Go back to search from success
      setCurrentStep('search');
      setSelectedVisit(null);
      setSearchTerm('');
      // Reset form data
      setCardNumber('');
      setIdProofType('');
      setIdProofNumber('');
      setPhoto(null);
      setSelectedAccessZones([]);
      setFormErrors({});
    }
  };
  
  // Start check-in process
  const startCheckin = () => {
    if (selectedVisit) {
      setCurrentStep('checkin');
    }
  };
  
  // Handle form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    }
    
    if (!idProofType) {
      errors.idProofType = 'ID proof type is required';
    }
    
    if (!idProofNumber.trim()) {
      errors.idProofNumber = 'ID proof number is required';
    }
    
    if (!photo) {
      errors.photo = 'Visitor photo is required';
    }
    
    if (selectedAccessZones.length === 0) {
      errors.accessZones = 'At least one access zone must be selected';
    }
    
    // Check if any selected zones require an escort
    const requiresEscort = selectedAccessZones.some(zoneId => {
      const zone = accessZoneOptions.find(option => option.value === zoneId);
      return zone?.requiresEscort;
    });
    
    if (requiresEscort && !selectedVisit?.escort) {
      errors.escort = 'An escort is required for one or more selected access zones';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle check-in submission
  const handleSubmit = () => {
    if (!validateForm() || !selectedVisit) return;
    
    // Process check-in
    const result = checkInVisitor(
      selectedVisit.id,
      cardNumber,
      idProofType,
      idProofNumber,
      photo || '',
      selectedAccessZones
    );
    
    if (result) {
      setSelectedVisit(result);
      setCurrentStep('success');
    } else {
      setFormErrors({
        ...formErrors,
        general: 'Failed to check in. Please try again or contact the front desk.'
      });
    }
  };
  
  // Handle exit button
  const handleExit = () => {
    setIsExitModalOpen(true);
  };
  
  // Confirm exit
  const confirmExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/visitors');
  };
  
  // Handle access zone selection
  const handleAccessZoneChange = (value: string[]) => {
    setSelectedAccessZones(value);
    
    // Clear escort error if no zones require escort
    const requiresEscort = value.some(zoneId => {
      const zone = accessZoneOptions.find(option => option.value === zoneId);
      return zone?.requiresEscort;
    });
    
    if (!requiresEscort && formErrors.escort) {
      const { escort, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };
  
  // Handle input focus for virtual keyboard
  const handleInputFocus = (inputId: string) => {
    setActiveInputId(inputId);
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    // Small delay to allow for touch events to complete
    setTimeout(() => {
      setActiveInputId(null);
    }, 200);
  };
  
  // Toggle virtual keyboard
  const toggleVirtualKeyboard = () => {
    setIsVirtualKeyboardVisible(!isVirtualKeyboardVisible);
  };
  
  // Render search step
  const renderSearchStep = () => {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: spacing.xl,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <GlassCard variant="primary" padding="lg">
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: colors.text.primary,
              marginBottom: spacing.md
            }}>
              Welcome to Nebula
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: colors.text.secondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Please search for your visit by your name, visitor ID, or host name
            </p>
          </div>
          
          <div style={{ marginBottom: spacing.xl, position: 'relative' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by visitor name, ID, or host name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => handleInputFocus('search')}
              onBlur={handleInputBlur}
              style={{
                width: '100%',
                padding: `${spacing.lg} ${spacing.xl}`,
                paddingLeft: '3rem',
                background: colors.glass.primary,
                border: `2px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                fontSize: '1.125rem',
                color: colors.text.primary,
                outline: 'none',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: activeInputId === 'search' ? shadows.glassHover : shadows.glass,
              }}
            />
            <Search 
              size={24} 
              style={{ 
                position: 'absolute', 
                left: spacing.lg, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: colors.text.secondary
              }} 
            />
          </div>
          
          {searchTerm && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: spacing.md,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {filteredVisits.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: spacing.xl,
                  color: colors.text.secondary
                }}>
                  <Info size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: colors.text.primary, 
                    marginBottom: spacing.md 
                  }}>
                    No Scheduled Visits Found
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                    We couldn't find any scheduled visits matching your search.
                    <br />Please try a different search term or contact the front desk for assistance.
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: colors.text.primary, 
                    marginBottom: spacing.md 
                  }}>
                    Scheduled Visits
                  </h3>
                  
                  {filteredVisits.map(visit => (
                    <div
                      key={visit.id}
                      style={{
                        padding: spacing.xl,
                        background: colors.glass.secondary,
                        borderRadius: borderRadius.lg,
                        border: `1px solid ${colors.border.light}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleVisitSelect(visit)}
                      onTouchStart={(e) => {
                        e.currentTarget.style.background = colors.glass.primary;
                        e.currentTarget.style.transform = 'scale(0.98)';
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.background = colors.glass.secondary;
                        e.currentTarget.style.transform = 'scale(1)';
                        handleVisitSelect(visit);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.lg }}>
                        <div>
                          <h4 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: '700', 
                            color: colors.text.primary, 
                            marginBottom: spacing.xs 
                          }}>
                            {visit.visitor}
                          </h4>
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: colors.text.secondary,
                            marginBottom: spacing.md
                          }}>
                            Visitor ID: {visit.visitorId}
                          </p>
                          
                          <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.875rem', color: colors.text.secondary }}>
                              <User size={14} />
                              <span>Host: {visit.host}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.875rem', color: colors.text.secondary }}>
                              <Calendar size={14} />
                              <span>{new Date(visit.startDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.875rem', color: colors.text.secondary }}>
                              <Clock size={14} />
                              <span>{new Date(visit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <GlassStatusBadge 
                          status={
                            visit.type === 'Business' ? 'info' :
                            visit.type === 'Interview' ? 'success' :
                            visit.type === 'Vendor' ? 'warning' :
                            visit.type === 'Contractor' ? 'error' :
                            'inactive'
                          } 
                          label={visit.type} 
                          size="md" 
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    );
  };
  
  // Render visit details step
  const renderDetailsStep = () => {
    if (!selectedVisit) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: spacing.xl,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <GlassCard variant="primary" padding="lg">
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: spacing.xl, 
            marginBottom: spacing.xl 
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: colors.gradients.primary,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <UserCheck size={32} style={{ color: 'white' }} />
            </div>
            
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: colors.text.primary, 
                marginBottom: spacing.xs 
              }}>
                Visit Details
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: colors.text.secondary,
                marginBottom: spacing.md
              }}>
                {selectedVisit.description}
              </p>
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={selectedVisit.status} 
                  size="md" 
                />
                <GlassStatusBadge 
                  status={
                    selectedVisit.type === 'Business' ? 'info' :
                    selectedVisit.type === 'Interview' ? 'success' :
                    selectedVisit.type === 'Vendor' ? 'warning' :
                    selectedVisit.type === 'Contractor' ? 'error' :
                    'inactive'
                  } 
                  label={selectedVisit.type} 
                  size="md" 
                />
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {/* Visit Information */}
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: colors.text.primary, 
                marginBottom: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}>
                <Calendar size={20} style={{ color: colors.text.primary }} />
                Visit Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Start Date
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {new Date(selectedVisit.startDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Start Time
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {new Date(selectedVisit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    End Date
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {new Date(selectedVisit.endDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    End Time
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {new Date(selectedVisit.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* People Information */}
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: colors.text.primary, 
                marginBottom: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}>
                <User size={20} style={{ color: colors.text.primary }} />
                People Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Visitor
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {selectedVisit.visitor} ({selectedVisit.visitorId})
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Host
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {selectedVisit.host} ({selectedVisit.hostId})
                  </div>
                </div>
                
                {selectedVisit.escort && (
                  <div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Escort
                    </div>
                    <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                      {selectedVisit.escort} ({selectedVisit.escortId})
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: spacing.xl,
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl
          }}>
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                padding: `${spacing.lg} ${spacing.xl}`,
                background: colors.gradients.primary,
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.xl,
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: shadows.glass,
                transition: 'all 0.2s ease',
                minHeight: '60px',
                minWidth: '250px',
              }}
              onClick={startCheckin}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = shadows.soft;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = shadows.glass;
                startCheckin();
              }}
            >
              <CheckSquare size={24} />
              Start Check-in Process
            </button>
          </div>
        </GlassCard>
      </div>
    );
  };
  
  // Render check-in step
  const renderCheckinStep = () => {
    if (!selectedVisit) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: spacing.xl,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <GlassCard variant="primary" padding="lg">
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            color: colors.text.primary, 
            marginBottom: spacing.xl,
            textAlign: 'center'
          }}>
            Complete Your Check-in
          </h2>
          
          {formErrors.general && (
            <div style={{
              padding: spacing.md,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: borderRadius.md,
              color: '#ef4444',
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.sm,
              marginBottom: spacing.xl,
            }}>
              <AlertCircle size={16} style={{ marginTop: '2px' }} />
              <div>{formErrors.general}</div>
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {/* ID and Card Information */}
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: colors.text.primary, 
                marginBottom: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}>
                <Tag size={20} style={{ color: colors.text.primary }} />
                ID and Card Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}>
                    Card Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={cardNumberInputRef}
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      onFocus={() => handleInputFocus('cardNumber')}
                      onBlur={handleInputBlur}
                      style={{
                        width: '100%',
                        padding: `${spacing.lg} ${spacing.xl}`,
                        background: colors.glass.primary,
                        border: `2px solid ${formErrors.cardNumber ? '#ef4444' : activeInputId === 'cardNumber' ? colors.border.medium : colors.border.light}`,
                        borderRadius: borderRadius.lg,
                        fontSize: '1.125rem',
                        color: colors.text.primary,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: activeInputId === 'cardNumber' ? shadows.glassHover : shadows.glass,
                      }}
                      placeholder="Enter visitor card number"
                    />
                    {formErrors.cardNumber && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: spacing.xs }}>
                        {formErrors.cardNumber}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}>
                    ID Proof Type *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value)}
                      onFocus={() => handleInputFocus('idProofType')}
                      onBlur={handleInputBlur}
                      style={{
                        width: '100%',
                        padding: `${spacing.lg} ${spacing.xl}`,
                        background: colors.glass.primary,
                        border: `2px solid ${formErrors.idProofType ? '#ef4444' : activeInputId === 'idProofType' ? colors.border.medium : colors.border.light}`,
                        borderRadius: borderRadius.lg,
                        fontSize: '1.125rem',
                        color: colors.text.primary,
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '16px',
                        paddingRight: '40px',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: activeInputId === 'idProofType' ? shadows.glassHover : shadows.glass,
                      }}
                    >
                      <option value="">Select ID proof type</option>
                      {getIdProofTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.idProofType && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: spacing.xs }}>
                        {formErrors.idProofType}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}>
                    ID Proof Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={idProofNumberInputRef}
                      type="text"
                      value={idProofNumber}
                      onChange={(e) => setIdProofNumber(e.target.value)}
                      onFocus={() => handleInputFocus('idProofNumber')}
                      onBlur={handleInputBlur}
                      style={{
                        width: '100%',
                        padding: `${spacing.lg} ${spacing.xl}`,
                        background: colors.glass.primary,
                        border: `2px solid ${formErrors.idProofNumber ? '#ef4444' : activeInputId === 'idProofNumber' ? colors.border.medium : colors.border.light}`,
                        borderRadius: borderRadius.lg,
                        fontSize: '1.125rem',
                        color: colors.text.primary,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: activeInputId === 'idProofNumber' ? shadows.glassHover : shadows.glass,
                      }}
                      placeholder="Enter ID proof number"
                    />
                    {formErrors.idProofNumber && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: spacing.xs }}>
                        {formErrors.idProofNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Access Zones */}
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: colors.text.primary, 
                marginBottom: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}>
                <Building size={20} style={{ color: colors.text.primary }} />
                Access Zones
              </h3>
              
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  Select Access Zones *
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    multiple
                    value={selectedAccessZones}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleAccessZoneChange(values);
                    }}
                    onFocus={() => handleInputFocus('accessZones')}
                    onBlur={handleInputBlur}
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      background: colors.glass.primary,
                      border: `2px solid ${formErrors.accessZones ? '#ef4444' : activeInputId === 'accessZones' ? colors.border.medium : colors.border.light}`,
                      borderRadius: borderRadius.lg,
                      fontSize: '1.125rem',
                      color: colors.text.primary,
                      outline: 'none',
                      minHeight: '150px',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: activeInputId === 'accessZones' ? shadows.glassHover : shadows.glass,
                    }}
                  >
                    {accessZoneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} {option.requiresEscort ? '(Requires Escort)' : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.accessZones && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: spacing.xs }}>
                      {formErrors.accessZones}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Escort Warning */}
              {selectedAccessZones.some(zoneId => {
                const zone = accessZoneOptions.find(option => option.value === zoneId);
                return zone?.requiresEscort;
              }) && (
                <div style={{
                  padding: spacing.md,
                  background: selectedVisit.escort ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${selectedVisit.escort ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                }}>
                  {selectedVisit.escort ? (
                    <>
                      <Info size={16} style={{ color: '#10b981', marginTop: '2px' }} />
                      <div style={{ color: '#10b981', fontSize: '0.875rem' }}>
                        <strong>Escort Assigned:</strong> {selectedVisit.escort} will escort you to restricted areas.
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} style={{ color: '#ef4444', marginTop: '2px' }} />
                      <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                        <strong>Escort Required:</strong> One or more selected zones require an escort, but no escort is assigned to this visit. Please contact the front desk.
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Visitor Photo */}
          <div style={{ marginTop: spacing.xl }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}>
              <User size={20} style={{ color: colors.text.primary }} />
              Visitor Photo
            </h3>
            
            <GlassPhotoCapture
              value={photo || undefined}
              onChange={setPhoto}
              size="md"
              error={formErrors.photo}
              aspectRatio="4:3"
            />
          </div>
          
          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: spacing.xl,
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl,
            gap: spacing.xl
          }}>
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                padding: `${spacing.lg} ${spacing.xl}`,
                background: 'transparent',
                color: colors.text.primary,
                border: `2px solid ${colors.border.light}`,
                borderRadius: borderRadius.xl,
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: shadows.glass,
                transition: 'all 0.2s ease',
                minHeight: '60px',
                minWidth: '180px',
              }}
              onClick={handleBack}
              onTouchStart={(e) => {
                e.currentTarget.style.background = colors.glass.secondary;
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                handleBack();
              }}
            >
              <ArrowLeft size={24} />
              Back
            </button>
            
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                padding: `${spacing.lg} ${spacing.xl}`,
                background: colors.gradients.primary,
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.xl,
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: shadows.glass,
                transition: 'all 0.2s ease',
                minHeight: '60px',
                minWidth: '250px',
              }}
              onClick={handleSubmit}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = shadows.soft;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = shadows.glass;
                handleSubmit();
              }}
            >
              <CheckSquare size={24} />
              Complete Check-in
            </button>
          </div>
        </GlassCard>
      </div>
    );
  };
  
  // Render success step
  const renderSuccessStep = () => {
    if (!selectedVisit) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: spacing.xl,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <GlassCard variant="primary" padding="lg">
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.xl,
            }}>
              <CheckSquare size={50} style={{ color: '#10b981' }} />
            </div>
            
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: colors.text.primary, 
              marginBottom: spacing.md 
            }}>
              Check-in Successful!
            </h2>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: colors.text.secondary,
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: spacing.xl
            }}>
              Welcome, {selectedVisit.visitor}! Your visit has been successfully checked in.
            </p>
          </div>
          
          <div style={{ 
            padding: spacing.xl,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.xl
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg 
            }}>
              Visit Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Host
                </div>
                <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                  {selectedVisit.host}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Card Number
                </div>
                <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                  {cardNumber}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Meeting Time
                </div>
                <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                  {new Date(selectedVisit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {selectedVisit.escort && (
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Escort
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text.primary, fontWeight: '600' }}>
                    {selectedVisit.escort}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            padding: spacing.xl,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.xl
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg 
            }}>
              Access Zones
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {selectedAccessZones.map(zoneId => {
                const zone = accessZoneOptions.find(option => option.value === zoneId);
                return (
                  <div 
                    key={zoneId}
                    style={{
                      padding: spacing.md,
                      background: colors.glass.primary,
                      borderRadius: borderRadius.md,
                      fontSize: '0.875rem',
                      color: colors.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{zone?.label}</span>
                    {zone?.requiresEscort && (
                      <GlassStatusBadge 
                        status={selectedVisit.escort ? "success" : "error"} 
                        label={selectedVisit.escort ? "Escort Assigned" : "Requires Escort"} 
                        size="sm" 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: spacing.xl,
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl
          }}>
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                padding: `${spacing.lg} ${spacing.xl}`,
                background: colors.gradients.primary,
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.xl,
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: shadows.glass,
                transition: 'all 0.2s ease',
                minHeight: '60px',
                minWidth: '180px',
              }}
              onClick={() => {
                setCurrentStep('search');
                setSelectedVisit(null);
                setSearchTerm('');
                // Reset form data
                setCardNumber('');
                setIdProofType('');
                setIdProofNumber('');
                setPhoto(null);
                setSelectedAccessZones([]);
                setFormErrors({});
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = shadows.soft;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = shadows.glass;
                setCurrentStep('search');
                setSelectedVisit(null);
                setSearchTerm('');
                // Reset form data
                setCardNumber('');
                setIdProofType('');
                setIdProofNumber('');
                setPhoto(null);
                setSelectedAccessZones([]);
                setFormErrors({});
              }}
            >
              <Check size={24} />
              Done
            </button>
          </div>
        </GlassCard>
      </div>
    );
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.gradients.background,
      padding: spacing['3xl'],
      position: 'relative',
    }}>
      <style>
        {`
          /* Touch-specific styles */
          @media (hover: none) and (pointer: coarse) {
            .touch-button {
              min-height: 60px !important;
              min-width: 60px !important;
              font-size: 1.125rem !important;
            }
            
            .touch-input {
              min-height: 54px !important;
              font-size: 1.125rem !important;
            }
            
            .touch-select {
              min-height: 54px !important;
              font-size: 1.125rem !important;
            }
            
            /* Increase touch targets */
            select option {
              padding: 12px !important;
              font-size: 1.125rem !important;
            }
            
            /* Ensure proper spacing for touch */
            .touch-container {
              gap: 20px !important;
            }
            
            /* Improve touch feedback */
            .touch-feedback:active {
              transform: scale(0.98) !important;
              opacity: 0.9 !important;
            }
          }
          
          /* Ensure inputs work well with virtual keyboards */
          input:focus, select:focus, textarea:focus {
            position: relative;
            z-index: 10;
          }
          
          /* Prevent zoom on focus in iOS */
          @media screen and (-webkit-min-device-pixel-ratio: 0) { 
            select,
            textarea,
            input {
              font-size: 16px !important;
            }
          }
          
          /* Improve scrolling on touch devices */
          .touch-scroll {
            -webkit-overflow-scrolling: touch;
            overflow-y: auto;
          }
          
          /* Prevent text selection on touch */
          .no-select {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing['3xl'],
      }} className="no-select">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'transparent',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${colors.border.light}`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}>
            <img 
              src="/Nebula_Logo_H6.svg" 
              alt="Nebula Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
              }} 
            />
          </div>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: colors.text.violet,
              margin: 0,
            }}>
              Nebula
            </h1>
            <p style={{
              fontSize: '1rem',
              color: colors.text.secondary,
              margin: 0,
              fontWeight: '500',
            }}>
              Visitor Self Check-in Kiosk
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: spacing.md }}>
          {currentStep !== 'search' && (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'transparent',
                color: colors.text.primary,
                border: `2px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: shadows.glass,
                transition: 'all 0.2s ease',
                minHeight: '50px',
                minWidth: '100px',
              }}
              onClick={handleBack}
              className="touch-button"
              onTouchStart={(e) => {
                e.currentTarget.style.background = colors.glass.secondary;
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                handleBack();
              }}
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              background: 'transparent',
              color: colors.text.primary,
              border: `2px solid ${colors.border.light}`,
              borderRadius: borderRadius.lg,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: shadows.glass,
              transition: 'all 0.2s ease',
              minHeight: '50px',
              minWidth: '50px',
            }}
            onClick={toggleVirtualKeyboard}
            className="touch-button"
            onTouchStart={(e) => {
              e.currentTarget.style.background = colors.glass.secondary;
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              toggleVirtualKeyboard();
            }}
          >
            <Keyboard size={20} />
          </button>
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              background: 'transparent',
              color: colors.text.primary,
              border: `2px solid ${colors.border.light}`,
              borderRadius: borderRadius.lg,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: shadows.glass,
              transition: 'all 0.2s ease',
              minHeight: '50px',
              minWidth: '50px',
            }}
            onClick={toggleFullscreen}
            className="touch-button"
            onTouchStart={(e) => {
              e.currentTarget.style.background = colors.glass.secondary;
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              toggleFullscreen();
            }}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: `2px solid rgba(239, 68, 68, 0.3)`,
              borderRadius: borderRadius.lg,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: shadows.glass,
              transition: 'all 0.2s ease',
              minHeight: '50px',
              minWidth: '100px',
            }}
            onClick={handleExit}
            className="touch-button"
            onTouchStart={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              handleExit();
            }}
          >
            <LogOut size={20} />
            Exit
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ marginBottom: spacing['3xl'] }} className="touch-scroll">
        {currentStep === 'search' && renderSearchStep()}
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'checkin' && renderCheckinStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        color: colors.text.secondary,
        fontSize: '0.875rem',
        marginTop: 'auto',
      }} className="no-select">
        <p>© 2025 Nebula Identity & Access Management Platform. All rights reserved.</p>
      </div>
      
      {/* Virtual Keyboard Trigger */}
      {isVirtualKeyboardVisible && activeInputId && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: spacing.md,
          background: colors.glass.primary,
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderTop: `1px solid ${colors.border.light}`,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{ textAlign: 'center', color: colors.text.secondary }}>
            <p>Virtual keyboard is active. Tap outside to dismiss.</p>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', marginTop: spacing.md }}>
              <button
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: colors.glass.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
                onClick={() => {
                  if (activeInputId === 'search' && searchInputRef.current) {
                    searchInputRef.current.focus();
                  } else if (activeInputId === 'cardNumber' && cardNumberInputRef.current) {
                    cardNumberInputRef.current.focus();
                  } else if (activeInputId === 'idProofNumber' && idProofNumberInputRef.current) {
                    idProofNumberInputRef.current.focus();
                  }
                }}
              >
                Focus Input
              </button>
              <button
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: colors.glass.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
                onClick={() => setIsVirtualKeyboardVisible(false)}
              >
                Close Keyboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Exit Confirmation Modal */}
      <GlassModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title="Exit Kiosk Mode"
      >
        <div style={{ padding: spacing.xl }}>
          <p style={{ 
            fontSize: '1rem', 
            color: colors.text.primary, 
            marginBottom: spacing.xl,
            lineHeight: '1.6'
          }}>
            Are you sure you want to exit kiosk mode? This will return you to the admin interface.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <button
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'transparent',
                color: colors.text.primary,
                border: `2px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '50px',
                minWidth: '100px',
              }}
              onClick={() => setIsExitModalOpen(false)}
              className="touch-button"
            >
              Cancel
            </button>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: `2px solid rgba(239, 68, 68, 0.3)`,
                borderRadius: borderRadius.lg,
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '50px',
                minWidth: '120px',
              }}
              onClick={confirmExit}
              className="touch-button"
            >
              <LogOut size={20} />
              Exit Kiosk
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};