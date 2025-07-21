import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Building, 
  Tag, 
  CheckSquare, 
  ChevronLeft,
  AlertCircle,
  Info,
  Shield
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { 
  GlassButton, 
  GlassCard, 
  GlassInput, 
  GlassStatusBadge, 
  GlassDropdown,
  GlassModal,
  GlassPhotoCapture
} from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { 
  getVisitById, 
  getAccessZoneOptions, 
  getIdProofTypeOptions,
  checkInVisitor
} from '../../data/visitorMockData';
import { Visit, AccessZone } from '../../types/visitor';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const VisitCheckinPage: React.FC = () => {
  const colors = useThemeColors();
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [idProofType, setIdProofType] = useState('');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedAccessZones, setSelectedAccessZones] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Access zone options
  const [accessZoneOptions, setAccessZoneOptions] = useState<Array<{
    value: string;
    label: string;
    requiresEscort: boolean;
  }>>([]);
  
  // Load visit data
  useEffect(() => {
    if (!visitId) {
      setError('Visit ID is required');
      setIsLoading(false);
      return;
    }
    
    // Get visit data
    const visitData = getVisitById(visitId);
    if (!visitData) {
      setError('Visit not found');
      setIsLoading(false);
      return;
    }
    
    // Check if visit is already checked in
    if (visitData.status !== 'scheduled') {
      setError('This visit is already checked in or completed');
      setIsLoading(false);
      return;
    }
    
    setVisit(visitData);
    
    // Get access zone options
    const zoneOptions = getAccessZoneOptions();
    setAccessZoneOptions(zoneOptions);
    
    setIsLoading(false);
  }, [visitId]);
  
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
    
    if (requiresEscort && !visit?.escort) {
      errors.escort = 'An escort is required for one or more selected access zones';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle check-in submission
  const handleSubmit = () => {
    if (!validateForm() || !visit) return;
    
    // Process check-in
    const result = checkInVisitor(
      visit.id,
      cardNumber,
      idProofType,
      idProofNumber,
      photo || '',
      selectedAccessZones
    );
    
    if (result) {
      setVisit(result);
      setIsSuccessModalOpen(true);
    } else {
      setError('Failed to check in visitor. Please try again.');
    }
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
  
  // Render loading state
  if (isLoading) {
    return (
      <PageLayout
        title="Visitor Check-in"
        subtitle="Loading visit information..."
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.border.light}`,
            borderTop: `3px solid ${colors.text.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </PageLayout>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <PageLayout
        title="Visitor Check-in"
        subtitle="Error loading visit information"
      >
        <GlassCard variant="primary" padding="lg">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.xl,
            textAlign: 'center',
          }}>
            <AlertCircle size={64} style={{ color: '#ef4444', marginBottom: spacing.xl }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
              {error}
            </h3>
            <p style={{ fontSize: '1rem', color: colors.text.secondary, marginBottom: spacing.xl }}>
              Please go back to the visit list and try again.
            </p>
            <Link to="/visitors">
              <GlassButton variant="primary">
                <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />
                Back to Visit List
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </PageLayout>
    );
  }
  
  // Render main content
  return (
    <PageLayout
      title="Visitor Check-in"
      subtitle="Complete the check-in process for the scheduled visit"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Link to="/visitors">
            <GlassButton variant="ghost">
              <ChevronLeft size={18} style={{ marginRight: spacing.sm }} />
              Back to Visit List
            </GlassButton>
          </Link>
        </div>
      }
    >
      {visit && (
        <>
          {/* Visit Information */}
          <GlassCard variant="primary" padding="lg" style={{ marginBottom: spacing.xl }}>
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
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Visit Details
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                  {visit.description}
                </p>
                <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                  <GlassStatusBadge 
                    status="info" 
                    label={visit.status} 
                    size="md" 
                  />
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
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing.xl }}>
              <div>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Calendar size={18} style={{ color: colors.text.primary }} />
                  Visit Schedule
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Start Date
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {new Date(visit.startDate).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      End Date
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {new Date(visit.endDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Users size={18} style={{ color: colors.text.primary }} />
                  People Information
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Visitor
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {visit.visitor} ({visit.visitorId})
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Host
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {visit.host} ({visit.hostId})
                    </div>
                  </div>
                  
                  {visit.escort && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                        Escort
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                        {visit.escort} ({visit.escortId})
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
          
          {/* Check-in Form */}
          <GlassCard variant="primary" className="mt-2" padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xl }}>
              Check-in Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
              {/* ID and Card Information */}
              <div>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Tag size={18} style={{ color: colors.text.primary }} />
                  ID and Card Information
                </h4>
                
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
                    <GlassInput
                      value={cardNumber}
                      onChange={setCardNumber}
                      placeholder="Enter visitor card number"
                      error={formErrors.cardNumber}
                    />
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
                    <GlassDropdown
                      options={getIdProofTypeOptions()}
                      value={idProofType}
                      onChange={setIdProofType}
                      placeholder="Select ID proof type"
                      error={formErrors.idProofType}
                    />
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
                    <GlassInput
                      value={idProofNumber}
                      onChange={setIdProofNumber}
                      placeholder="Enter ID proof number"
                      error={formErrors.idProofNumber}
                    />
                  </div>
                </div>
              </div>
              
              {/* Access Zones */}
              <div>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Building size={18} style={{ color: colors.text.primary }} />
                  Access Zones
                </h4>
                
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
                  <GlassDropdown
                    options={accessZoneOptions}
                    value={selectedAccessZones}
                    onChange={handleAccessZoneChange}
                    placeholder="Select access zones"
                    error={formErrors.accessZones}
                    searchable={true}
                  />
                </div>
                
                {/* Escort Warning */}
                {selectedAccessZones.some(zoneId => {
                  const zone = accessZoneOptions.find(option => option.value === zoneId);
                  return zone?.requiresEscort;
                }) && (
                  <div style={{
                    padding: spacing.md,
                    background: visit.escort ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${visit.escort ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: borderRadius.md,
                    marginBottom: spacing.lg,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing.sm,
                  }}>
                    {visit.escort ? (
                      <>
                        <Info size={16} style={{ color: '#10b981', marginTop: '2px' }} />
                        <div style={{ color: '#10b981', fontSize: '0.875rem' }}>
                          <strong>Escort Assigned:</strong> {visit.escort} will escort the visitor to restricted areas.
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} style={{ color: '#ef4444', marginTop: '2px' }} />
                        <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                          <strong>Escort Required:</strong> One or more selected zones require an escort, but no escort is assigned to this visit.
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Selected Zones */}
                {selectedAccessZones.length > 0 && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.text.primary,
                      marginBottom: spacing.sm,
                    }}>
                      Selected Zones
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      {selectedAccessZones.map(zoneId => {
                        const zone = accessZoneOptions.find(option => option.value === zoneId);
                        return (
                          <div 
                            key={zoneId}
                            style={{
                              padding: `${spacing.sm} ${spacing.md}`,
                              background: colors.glass.secondary,
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
                                status={visit.escort ? "success" : "error"} 
                                label={visit.escort ? "Escort Assigned" : "Requires Escort"} 
                                size="sm" 
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Visitor Photo */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <User size={18} style={{ color: colors.text.primary }} />
                  Visitor Photo
                </h4>
                
                <GlassPhotoCapture
                  value={photo || undefined}
                  onChange={setPhoto}
                  size="md"
                  error={formErrors.photo}
                  aspectRatio="4:3"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: spacing.md, 
              marginTop: spacing.xl,
              borderTop: `1px solid ${colors.border.light}`,
              paddingTop: spacing.xl
            }}>
              <Link to="/visitors">
                <GlassButton variant="ghost">
                  Cancel
                </GlassButton>
              </Link>
              
              <GlassButton 
                variant="primary"
                onClick={handleSubmit}
              >
                <CheckSquare size={16} style={{ marginRight: spacing.sm }} />
                Complete Check-in
              </GlassButton>
            </div>
          </GlassCard>
          
          {/* Success Modal */}
          <GlassModal
            isOpen={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false);
              navigate('/visitors');
            }}
            title="Check-in Successful"
          >
            <div style={{ padding: spacing.xl, textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.xl,
              }}>
                <CheckSquare size={40} style={{ color: '#10b981' }} />
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                Visitor Successfully Checked In
              </h3>
              
              <p style={{ fontSize: '1rem', color: colors.text.secondary, marginBottom: spacing.xl }}>
                {visit.visitor} has been checked in for their visit with {visit.host}.
              </p>
              
              <div style={{ 
                padding: spacing.lg,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.xl,
                textAlign: 'left',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Card Number
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {cardNumber}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      ID Proof
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {idProofType}: {idProofNumber}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.md }}>
                <GlassButton 
                  variant="primary"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/visitors');
                  }}
                >
                  Return to Visit List
                </GlassButton>
              </div>
            </div>
          </GlassModal>
        </>
      )}
    </PageLayout>
  );
};