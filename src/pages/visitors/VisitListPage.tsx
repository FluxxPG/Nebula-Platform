import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  UserCheck, 
  Clock, 
  Plus, 
  RefreshCw,
  CheckSquare,
  LogOut,
  FileText,
  User,
  Users,
  Building,
  Tag
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { 
  GlassButton, 
  GlassCard, 
  GlassInput, 
  GlassDataTable, 
  GlassStatusBadge,
  GlassDropdown,
  GlassModal
} from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockVisits, filterVisits, getVisitTypeOptions } from '../../data/visitorMockData';
import { Visit, VisitFilter } from '../../types/visitor';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const VisitListPage: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<VisitFilter>({
    status: [],
    type: [],
    startDateFrom: '',
    startDateTo: '',
    host: '',
    visitor: ''
  });
  
  // Load visits on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVisits(mockVisits);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Filter visits based on search term and filters
  const filteredVisits = React.useMemo(() => {
    let result = visits;
    
    // Apply filters
    result = filterVisits(filters);
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(visit => 
        visit.visitor.toLowerCase().includes(term) ||
        visit.host.toLowerCase().includes(term) ||
        visit.description.toLowerCase().includes(term) ||
        visit.type.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [visits, searchTerm, filters]);
  
  // Handle check-in
  const handleCheckIn = (visit: Visit) => {
    navigate(`/visitors/checkin/${visit.id}`);
  };
  
  // Handle check-out
  const handleCheckOut = (visit: Visit) => {
    // In a real app, this would call an API to check out the visitor
    console.log('Checking out visitor:', visit.id);
  };
  
  // Handle view visit details
  const handleViewVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsViewModalOpen(true);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVisits(mockVisits);
      setIsLoading(false);
    }, 500);
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof VisitFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      status: [],
      type: [],
      startDateFrom: '',
      startDateTo: '',
      host: '',
      visitor: ''
    });
  };
  
  // Table columns
  const columns = [
    {
      key: 'startDate',
      label: t('visitors.fields.startDate'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'endDate',
      label: t('visitors.fields.endDate'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'host',
      label: t('visitors.fields.host'),
      sortable: true,
    },
    {
      key: 'escort',
      label: t('visitors.fields.escort'),
      sortable: true,
      render: (value: string | undefined) => value || 'N/A',
    },
    {
      key: 'visitor',
      label: t('visitors.fields.visitor'),
      sortable: true,
    },
    {
      key: 'type',
      label: t('visitors.fields.type'),
      sortable: true,
      render: (value: string) => (
        <GlassStatusBadge 
          status={
            value === 'Business' ? 'info' :
            value === 'Interview' ? 'success' :
            value === 'Vendor' ? 'warning' :
            value === 'Contractor' ? 'error' :
            'inactive'
          } 
          label={t(`visitors.types.${value.toLowerCase()}`)} 
          size="sm" 
        />
      ),
    },
    {
      key: 'status',
      label: t('visitors.fields.status'),
      sortable: true,
      render: (value: string) => (
        <GlassStatusBadge 
          status={
            value === 'scheduled' ? 'info' :
            value === 'checked-in' ? 'success' :
            value === 'checked-out' ? 'inactive' :
            'error'
          } 
          label={t(`visitors.status.${value.replace('-', '')}`)} 
          size="sm" 
        />
      ),
    },
    {
      key: 'actions',
      label: t('common.actions'),
      sortable: false,
      render: (_: any, row: Visit) => (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <GlassButton 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewVisit(row);
            }}
            title={t('common.view')}
          >
            <FileText size={14} />
          </GlassButton>
          
          {row.status === 'scheduled' && (
            <GlassButton 
              variant="success" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCheckIn(row);
              }}
              title={t('visitors.actions.checkIn')}
            >
              <CheckSquare size={14} />
            </GlassButton>
          )}
          
          {row.status === 'checked-in' && (
            <GlassButton 
              variant="warning" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCheckOut(row);
              }}
              title={t('visitors.actions.checkOut')}
            >
              <LogOut size={14} />
            </GlassButton>
          )}
        </div>
      ),
    },
  ];
  
  // Render visit details in modal
  const renderVisitDetails = (visit: Visit) => {
    return (
      <div style={{ padding: spacing.lg }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: spacing.xl, 
          marginBottom: spacing.xl,
          padding: spacing.lg,
          background: colors.glass.secondary,
          borderRadius: borderRadius.lg,
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
              {t('common.details')}
            </h3>
            <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
              {visit.description}
            </p>
            <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
              <GlassStatusBadge 
                status={
                  visit.status === 'scheduled' ? 'info' :
                  visit.status === 'checked-in' ? 'success' :
                  visit.status === 'checked-out' ? 'inactive' :
                  'error'
                } 
                label={t(`visitors.status.${visit.status.replace('-', '')}`)} 
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
                label={t(`visitors.types.${visit.type.toLowerCase()}`)} 
                size="md" 
              />
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
          {/* Visit Information */}
          <GlassCard variant="secondary" padding="lg">
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
              {t('visitors.fields.visitInfo')}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  {t('visitors.fields.startDate')}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                  {new Date(visit.startDate).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  {t('visitors.fields.endDate')}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                  {new Date(visit.endDate).toLocaleString()}
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard variant="secondary" padding="lg">
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
              {t('visitors.fields.peopleInfo')}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  {t('visitors.fields.visitor')}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                  {visit.visitor} ({visit.visitorId})
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  {t('visitors.fields.host')}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                  {visit.host} ({visit.hostId})
                </div>
              </div>
              
              {visit.escort && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                    {t('visitors.fields.escort')}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                    {visit.escort} ({visit.escortId})
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
        
        {/* Check-in Information (if checked in) */}
        {(visit.status === 'checked-in' || visit.status === 'checked-out') && (
          <div style={{ marginTop: spacing.xl }}>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg 
            }}>
              {t('visitors.checkIn.checkInInfo')}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
              {/* ID and Card Information */}
              <GlassCard variant="secondary" padding="lg">
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
                  {t('visitors.checkIn.idAndCard')}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      {t('visitors.checkIn.cardNumber')}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {visit.cardNumber || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      {t('visitors.checkIn.idProofType')}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {visit.idProofType || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      {t('visitors.checkIn.idProofNumber')}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.text.primary }}>
                      {visit.idProofNumber || 'N/A'}
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Access Zones */}
              <GlassCard variant="secondary" padding="lg">
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
                  {t('visitors.checkIn.accessZones')}
                </h4>
                
                {visit.accessZones && visit.accessZones.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {visit.accessZones.map((zone, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          background: colors.glass.primary,
                          borderRadius: borderRadius.md,
                          fontSize: '0.875rem',
                          color: colors.text.primary,
                        }}
                      >
                        {zone}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, fontStyle: 'italic' }}>
                    No access zones assigned
                  </div>
                )}
              </GlassCard>
              
              {/* Visitor Photo */}
              {visit.photo && (
                <GlassCard variant="secondary" padding="lg">
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
                    {t('visitors.checkIn.visitorPhoto')}
                  </h4>
                  
                  <div style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center',
                    marginBottom: spacing.md
                  }}>
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${colors.border.light}`,
                    }}>
                      <img 
                        src={visit.photo} 
                        alt="Visitor" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: spacing.md, 
          marginTop: spacing.xl,
          borderTop: `1px solid ${colors.border.light}`,
          paddingTop: spacing.xl
        }}>
          {visit.status === 'scheduled' && (
            <GlassButton 
              variant="success"
              onClick={() => {
                setIsViewModalOpen(false);
                handleCheckIn(visit);
              }}
            >
              <CheckSquare size={16} style={{ marginRight: spacing.sm }} />
              {t('visitors.actions.checkIn')}
            </GlassButton>
          )}
          
          {visit.status === 'checked-in' && (
            <GlassButton 
              variant="warning"
              onClick={() => {
                setIsViewModalOpen(false);
                handleCheckOut(visit);
              }}
            >
              <LogOut size={16} style={{ marginRight: spacing.sm }} />
              {t('visitors.actions.checkOut')}
            </GlassButton>
          )}
          
          <GlassButton 
            variant="ghost"
            onClick={() => setIsViewModalOpen(false)}
          >
            {t('common.close')}
          </GlassButton>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title={t('visitors.title')}
      subtitle={t('visitors.subtitle')}
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton 
            variant="ghost"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            {t('common.filter')}
          </GlassButton>
          
          <GlassButton 
            variant="ghost"
            onClick={handleRefresh}
            loading={isLoading}
          >
            <RefreshCw size={18} style={{ marginRight: spacing.sm }} />
            {t('common.refresh')}
          </GlassButton>
          
          <GlassButton 
            variant="primary"
            onClick={() => navigate('/visitors/create')}
          >
            <Plus size={18} style={{ marginRight: spacing.sm }} />
            {t('visitors.newVisit')}
          </GlassButton>
        </div>
      }
    >
      {/* Search Bar */}
      <div style={{
        marginBottom: spacing.xl,
        padding: spacing.xl,
        background: colors.glass.primary,
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <GlassInput
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={setSearchTerm}
        />
        
        {/* Active Filters Display */}
        {(filters.status.length > 0 || 
          filters.type.length > 0 || 
          filters.startDateFrom || 
          filters.startDateTo || 
          filters.host || 
          filters.visitor) && (
          <div style={{ 
            marginTop: spacing.md, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: spacing.sm 
          }}>
            {filters.status.length > 0 && (
              <GlassStatusBadge 
                status="info" 
                label={`${t('visitors.fields.status')}: ${filters.status.map(s => t(`visitors.status.${s.replace('-', '')}`) as string).join(', ')}`} 
                size="sm" 
              />
            )}
            
            {filters.type.length > 0 && (
              <GlassStatusBadge 
                status="info" 
                label={`${t('visitors.fields.type')}: ${filters.type.map(t => t).join(', ')}`} 
                size="sm" 
              />
            )}
            
            {filters.startDateFrom && (
              <GlassStatusBadge 
                status="info" 
                label={`From: ${new Date(filters.startDateFrom).toLocaleDateString()}`} 
                size="sm" 
              />
            )}
            
            {filters.startDateTo && (
              <GlassStatusBadge 
                status="info" 
                label={`To: ${new Date(filters.startDateTo).toLocaleDateString()}`} 
                size="sm" 
              />
            )}
            
            {filters.host && (
              <GlassStatusBadge 
                status="info" 
                label={`${t('visitors.fields.host')}: ${filters.host}`} 
                size="sm" 
              />
            )}
            
            {filters.visitor && (
              <GlassStatusBadge 
                status="info" 
                label={`${t('visitors.fields.visitor')}: ${filters.visitor}`} 
                size="sm" 
              />
            )}
            
            <GlassButton 
              variant="ghost" 
              size="sm"
              onClick={handleFilterReset}
            >
              {t('common.clearAll')}
            </GlassButton>
          </div>
        )}
      </div>
      
      {/* Visits Table */}
      <GlassDataTable
        columns={columns}
        data={filteredVisits}
        pagination={true}
        pageSize={10}
        searchable={false} // We're using our own search
        showPageSizeSelector={true}
        loading={isLoading}
        onRowClick={handleViewVisit}
        emptyMessage={t('common.noResults')}
      />
      
      {/* Filter Modal */}
      <GlassModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title={t('common.filter')}
      >
        <div style={{ padding: spacing.xl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              {t('visitors.fields.status')}
            </label>
            <GlassDropdown
              options={[
                { value: 'scheduled', label: t('visitors.status.scheduled') },
                { value: 'checked-in', label: t('visitors.status.checkedIn') },
                { value: 'checked-out', label: t('visitors.status.checkedOut') },
                { value: 'cancelled', label: t('visitors.status.cancelled') },
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder={t('common.select')}
              searchable={false}
            />
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              {t('visitors.fields.type')}
            </label>
            <GlassDropdown
              options={getVisitTypeOptions().map(option => ({
                ...option,
                label: t(`visitors.types.${option.value.toLowerCase()}`)
              }))}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              placeholder={t('common.select')}
              searchable={false}
            />
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              {t('visitors.fields.visitSchedule')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  From
                </label>
                <GlassInput
                  type="date"
                  value={filters.startDateFrom}
                  onChange={(value) => handleFilterChange('startDateFrom', value)}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  To
                </label>
                <GlassInput
                  type="date"
                  value={filters.startDateTo}
                  onChange={(value) => handleFilterChange('startDateTo', value)}
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              {t('visitors.fields.host')}
            </label>
            <GlassInput
              value={filters.host || ''}
              onChange={(value) => handleFilterChange('host', value)}
              placeholder={t('common.search')}
            />
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              {t('visitors.fields.visitor')}
            </label>
            <GlassInput
              value={filters.visitor || ''}
              onChange={(value) => handleFilterChange('visitor', value)}
              placeholder={t('common.search')}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: spacing.md,
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl
          }}>
            <GlassButton 
              variant="ghost"
              onClick={handleFilterReset}
            >
              {t('common.reset')}
            </GlassButton>
            
            <GlassButton 
              variant="primary"
              onClick={() => setIsFilterModalOpen(false)}
            >
              {t('common.apply')}
            </GlassButton>
          </div>
        </div>
      </GlassModal>
      
      {/* View Visit Modal */}
      <GlassModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t('common.details')}
      >
        {selectedVisit && renderVisitDetails(selectedVisit)}
      </GlassModal>
    </PageLayout>
  );
};