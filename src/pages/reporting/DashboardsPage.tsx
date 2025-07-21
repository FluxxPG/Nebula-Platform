import React, { useState } from 'react';
import { 
  Grid, 
  Search, 
  Plus, 
  Filter, 
  Star, 
  Clock, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  BarChart2,
  PieChart,
  Table,
  Layout
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockDashboards, getDashboardById } from '../../data/reportingMockData';
import { Dashboard } from '../../types/reporting';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardsPage: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filter dashboards based on search term
  const filteredDashboards = mockDashboards.filter(dashboard => 
    dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePreviewDashboard = (dashboardId: string) => {
    const dashboard = getDashboardById(dashboardId);
    if (dashboard) {
      setSelectedDashboard(dashboard);
      setIsPreviewModalOpen(true);
    }
  };
  
  const handleViewDashboard = (dashboardId: string) => {
    navigate(`/reporting/dashboards/${dashboardId}`);
  };
  
  const handleEditDashboard = (dashboardId: string) => {
    navigate(`/reporting/dashboard-builder?id=${dashboardId}`);
  };
  
  const handleDeleteDashboard = (dashboardId: string) => {
    const dashboard = getDashboardById(dashboardId);
    if (dashboard) {
      setSelectedDashboard(dashboard);
      setIsDeleteModalOpen(true);
    }
  };
  
  const confirmDeleteDashboard = () => {
    // In a real app, this would delete the dashboard
    // For now, we'll just close the modal
    setIsDeleteModalOpen(false);
    setSelectedDashboard(null);
  };
  
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'visualization':
        return <BarChart2 size={16} />;
      case 'text':
        return <Edit size={16} />;
      case 'filter':
        return <Filter size={16} />;
      default:
        return <Grid size={16} />;
    }
  };

  return (
    <PageLayout
      title="Dashboards"
      subtitle="Create, manage, and analyze dashboards for audit and compliance purposes"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost">
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            Filters
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => navigate('/reporting/dashboard-builder')}
          >
            <Plus size={18} style={{ marginRight: spacing.sm }} />
            Create Dashboard
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
          placeholder="Search dashboards..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Dashboards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: spacing.xl,
      }}>
        {filteredDashboards.map(dashboard => (
          <GlassCard key={dashboard.id} variant="primary" padding="lg" hoverable>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: colors.gradients.warning,
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Layout size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                  {dashboard.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                  {dashboard.description}
                </p>
                <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <GlassStatusBadge 
                    status="info" 
                    label={`${dashboard.layout.widgets.length} widgets`} 
                    size="sm" 
                  />
                  <GlassStatusBadge 
                    status="warning" 
                    label={`${dashboard.filters.length} filters`} 
                    size="sm" 
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                    <Clock size={12} />
                    {new Date(dashboard.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Widgets Preview */}
            <div style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              background: colors.glass.secondary,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.border.light}`,
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
                Widgets
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                {dashboard.layout.widgets.map(widget => (
                  <div key={widget.id} style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: colors.glass.primary,
                    borderRadius: borderRadius.sm,
                    fontSize: '0.75rem',
                    color: colors.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}>
                    {getWidgetIcon(widget.type)}
                    <span>{widget.title || widget.type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                <div>Created by: {dashboard.createdBy}</div>
              </div>
              
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlePreviewDashboard(dashboard.id)}
                >
                  <Eye size={14} style={{ marginRight: spacing.xs }} />
                  Preview
                </GlassButton>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditDashboard(dashboard.id)}
                >
                  <Edit size={14} style={{ marginRight: spacing.xs }} />
                  Edit
                </GlassButton>
                <GlassButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleViewDashboard(dashboard.id)}
                >
                  <Grid size={14} style={{ marginRight: spacing.xs }} />
                  View Dashboard
                </GlassButton>
                <GlassButton 
                  variant="error" 
                  size="sm"
                  onClick={() => handleDeleteDashboard(dashboard.id)}
                >
                  <Trash2 size={14} />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Dashboard Preview Modal */}
      <GlassModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={selectedDashboard ? `${selectedDashboard.name} Preview` : 'Dashboard Preview'}
      >
        {selectedDashboard && (
          <div style={{ padding: spacing.lg }}>
            <div style={{ marginBottom: spacing.xl }}>
              <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                {selectedDashboard.description}
              </p>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={`${selectedDashboard.layout.widgets.length} widgets`} 
                  size="sm" 
                />
                <GlassStatusBadge 
                  status="warning" 
                  label={`${selectedDashboard.filters.length} filters`} 
                  size="sm" 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                  <Clock size={14} />
                  Updated {new Date(selectedDashboard.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Dashboard Layout Preview */}
            <div style={{ marginBottom: spacing.xl }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
                Dashboard Layout
              </h3>
              <div style={{
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                height: '400px',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(12, 1fr)',
                gap: spacing.md,
                position: 'relative',
              }}>
                {selectedDashboard.layout.widgets.map(widget => (
                  <div key={widget.id} style={{
                    gridColumn: `${widget.position.x + 1} / span ${widget.position.w}`,
                    gridRow: `${widget.position.y + 1} / span ${widget.position.h}`,
                    background: colors.glass.primary,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.border.light}`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      padding: spacing.sm,
                      background: colors.glass.secondary,
                      borderBottom: `1px solid ${colors.border.light}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.text.primary,
                      }}>
                        {getWidgetIcon(widget.type)}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.text.primary }}>
                        {widget.title || widget.type}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: spacing.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.secondary, fontSize: '0.75rem' }}>
                      {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: spacing.xl, display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton variant="ghost" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </GlassButton>
              <GlassButton 
                variant="primary"
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  handleViewDashboard(selectedDashboard.id);
                }}
              >
                <Eye size={16} style={{ marginRight: spacing.sm }} />
                View Full Dashboard
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Dashboard"
      >
        {selectedDashboard && (
          <div style={{ padding: spacing.xl }}>
            <p style={{ fontSize: '1rem', color: colors.text.primary, marginBottom: spacing.xl }}>
              Are you sure you want to delete the dashboard "{selectedDashboard.name}"? This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton variant="error" onClick={confirmDeleteDashboard}>
                <Trash2 size={16} style={{ marginRight: spacing.sm }} />
                Delete Dashboard
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};