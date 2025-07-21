import React, { useState } from 'react';
import { 
  BarChart2, 
  Search, 
  Plus, 
  Filter, 
  Star, 
  Clock, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  PieChart,
  LineChart,
  Table,
  Code,
  Users,
  Calendar,
  Briefcase
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockReports, getReportById, executeReport, getDataSourceById } from '../../data/reportingMockData';
import { Report } from '../../types/reporting';
import { useNavigate } from 'react-router-dom';

export const ReportsPage: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filter reports based on search term
  const filteredReports = mockReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePreviewReport = (reportId: string) => {
    const report = getReportById(reportId);
    if (report) {
      setSelectedReport(report);
      setIsPreviewModalOpen(true);
    }
  };
  
  const handleViewReport = (reportId: string) => {
    navigate(`/reporting/reports/${reportId}`);
  };
  
  const handleEditReport = (reportId: string) => {
    navigate(`/reporting/report-builder?id=${reportId}`);
  };
  
  const handleDeleteReport = (reportId: string) => {
    const report = getReportById(reportId);
    if (report) {
      setSelectedReport(report);
      setIsDeleteModalOpen(true);
    }
  };
  
  const confirmDeleteReport = () => {
    // In a real app, this would delete the report
    // For now, we'll just close the modal
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  };
  
  const getReportIcon = (report: Report) => {
    const dataSource = getDataSourceById(report.dataSourceId);
    if (!dataSource) return <BarChart2 size={24} style={{ color: 'white' }} />;
    
    if (dataSource.name === 'Persons') {
      return <Users size={24} style={{ color: 'white' }} />;
    } else if (dataSource.name === 'Visitors') {
      return <Briefcase size={24} style={{ color: 'white' }} />;
    } else {
      return <Calendar size={24} style={{ color: 'white' }} />;
    }
  };
  
  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <BarChart2 size={16} />;
      case 'pie':
        return <PieChart size={16} />;
      case 'line':
        return <LineChart size={16} />;
      case 'table':
        return <Table size={16} />;
      default:
        return <BarChart2 size={16} />;
    }
  };

  return (
    <PageLayout
      title="Reports"
      subtitle="Create, manage, and analyze reports for audit and compliance purposes"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost">
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            Filters
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => navigate('/reporting/report-builder')}
          >
            <Plus size={18} style={{ marginRight: spacing.sm }} />
            Create Report
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
          placeholder="Search reports..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: spacing.xl,
      }}>
        {filteredReports.map(report => (
          <GlassCard key={report.id} variant="primary" padding="lg" hoverable>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: colors.gradients.success,
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getReportIcon(report)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                  {report.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                  {report.description}
                </p>
                <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <GlassStatusBadge 
                    status="info" 
                    label={`${report.visualizations.length} visualizations`} 
                    size="sm" 
                  />
                  <GlassStatusBadge 
                    status={report.isCustomSQL ? "warning" : "success"} 
                    label={report.isCustomSQL ? "Custom SQL" : "Standard"} 
                    size="sm" 
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                    <Clock size={12} />
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visualizations Preview */}
            <div style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              background: colors.glass.secondary,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.border.light}`,
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
                Visualizations
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                {report.visualizations.map(viz => (
                  <div key={viz.id} style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: colors.glass.primary,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: borderRadius.sm,
                    fontSize: '0.75rem',
                    color: colors.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}>
                    {getVisualizationIcon(viz.type)}
                    <span>{viz.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                <div>Data Source: {getDataSourceById(report.dataSourceId)?.name || 'Unknown'}</div>
              </div>
              
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlePreviewReport(report.id)}
                >
                  <Eye size={14} style={{ marginRight: spacing.xs }} />
                  Preview
                </GlassButton>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditReport(report.id)}
                >
                  <Edit size={14} style={{ marginRight: spacing.xs }} />
                  Edit
                </GlassButton>
                <GlassButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleViewReport(report.id)}
                >
                  <BarChart2 size={14} style={{ marginRight: spacing.xs }} />
                  View Report
                </GlassButton>
                <GlassButton 
                  variant="error" 
                  size="sm"
                  onClick={() => handleDeleteReport(report.id)}
                >
                  <Trash2 size={14} />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Report Preview Modal */}
      <GlassModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={selectedReport ? `${selectedReport.name} Preview` : 'Report Preview'}
      >
        {selectedReport && (
          <div style={{ padding: spacing.lg }}>
            <div style={{ marginBottom: spacing.xl }}>
              <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                {selectedReport.description}
              </p>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={`Data Source: ${getDataSourceById(selectedReport.dataSourceId)?.name || 'Unknown'}`} 
                  size="sm" 
                />
                <GlassStatusBadge 
                  status={selectedReport.isCustomSQL ? "warning" : "success"} 
                  label={selectedReport.isCustomSQL ? "Custom SQL" : "Standard"} 
                  size="sm" 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                  <Clock size={14} />
                  Updated {new Date(selectedReport.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Visualizations Preview */}
            <div style={{ marginBottom: spacing.xl }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
                Visualizations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
                {selectedReport.visualizations.map(viz => (
                  <GlassCard key={viz.id} variant="secondary" padding="md">
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: colors.glass.primary,
                        borderRadius: borderRadius.md,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {getVisualizationIcon(viz.type)}
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colors.text.primary }}>
                        {viz.name}
                      </h4>
                    </div>
                    <div style={{
                      height: '150px',
                      background: colors.glass.secondary,
                      borderRadius: borderRadius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.text.secondary,
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                    }}>
                      {viz.type.charAt(0).toUpperCase() + viz.type.slice(1)} Visualization Preview
                    </div>
                  </GlassCard>
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
                  handleViewReport(selectedReport.id);
                }}
              >
                <Eye size={16} style={{ marginRight: spacing.sm }} />
                View Full Report
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Report"
      >
        {selectedReport && (
          <div style={{ padding: spacing.xl }}>
            <p style={{ fontSize: '1rem', color: colors.text.primary, marginBottom: spacing.xl }}>
              Are you sure you want to delete the report "{selectedReport.name}"? This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton variant="error" onClick={confirmDeleteReport}>
                <Trash2 size={16} style={{ marginRight: spacing.sm }} />
                Delete Report
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};