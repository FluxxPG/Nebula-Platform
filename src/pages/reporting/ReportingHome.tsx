import React, { useState } from 'react';
import {
  BarChart2,
  Database,
  FileText,
  Grid,
  Plus,
  Search,
  Star,
  Clock,
  Filter,
  Layout,
  Code,
  Table,
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  Briefcase
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassCard, GlassInput, GlassStatusBadge } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockDataSources, mockReports, mockDashboards } from '../../data/reportingMockData';
import { useNavigate } from 'react-router-dom';

export const ReportingHome: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data sources, reports, and dashboards based on search term
  const filteredDataSources = mockDataSources.filter(ds =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = mockReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDashboards = mockDashboards.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get recent items (last 5)
  const recentItems = [
    ...mockReports.map(r => ({
      id: r.id,
      name: r.name,
      type: 'report',
      updatedAt: r.updatedAt,
      icon: <FileText size={20} />
    })),
    ...mockDashboards.map(d => ({
      id: d.id,
      name: d.name,
      type: 'dashboard',
      updatedAt: d.updatedAt,
      icon: <Layout size={20} />
    }))
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleCreateReport = () => {
    navigate('/reporting/report-builder');
  };

  const handleCreateDashboard = () => {
    navigate('/reporting/dashboard-builder');
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reporting/reports/${reportId}`);
  };

  const handleViewDashboard = (dashboardId: string) => {
    navigate(`/reporting/dashboards/${dashboardId}`);
  };

  return (
    <PageLayout
      title="Audit & Compliance Reporting"
      subtitle="Create, manage, and analyze reports and dashboards for audit and compliance purposes"
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
            Create New
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
          placeholder="Search reports, dashboards, and data sources..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing.xl,
        marginBottom: spacing.xl,
      }}>
        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: colors.gradients.primary,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Database size={24} style={{ color: 'white' }} />
            </div>
            <GlassStatusBadge status="info" label="Data Sources" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
            {mockDataSources.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            Available data sources
          </div>
        </GlassCard>

        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: colors.gradients.success,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileText size={24} style={{ color: 'white' }} />
            </div>
            <GlassStatusBadge status="success" label="Reports" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
            {mockReports.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            Created reports
          </div>
        </GlassCard>

        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: colors.gradients.warning,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Grid size={24} style={{ color: 'white' }} />
            </div>
            <GlassStatusBadge status="warning" label="Dashboards" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
            {mockDashboards.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
            Active dashboards
          </div>
        </GlassCard>
      </div>

      {/* Recent Items */}
      <div style={{ marginBottom: spacing.xl }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
          Recent Items
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: spacing.lg,
        }}>
          {recentItems.map(item => (
            <GlassCard key={item.id} variant="secondary" padding="lg" hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text.primary,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                    {item.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <GlassStatusBadge
                      status={item.type === 'report' ? 'success' : 'warning'}
                      label={item.type === 'report' ? 'Report' : 'Dashboard'}
                      size="sm"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                      <Clock size={12} />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (item.type === 'report') {
                      handleViewReport(item.id);
                    } else {
                      handleViewDashboard(item.id);
                    }
                  }}
                >
                  {item.type === 'report' ? 'View Report' : 'View Dashboard'}
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div style={{ marginBottom: spacing.xl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary }}>
            Data Sources
          </h2>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/reporting/data-sources')}
          >
            View All
          </GlassButton>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: spacing.lg,
        }}>
          {filteredDataSources.slice(0, 3).map(dataSource => (
            <GlassCard key={dataSource.id} variant="primary" padding="lg" hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: colors.gradients.primary,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {dataSource.name === 'Persons' ? (
                    <Users size={24} style={{ color: 'white' }} />
                  ) : dataSource.name === 'Visitors' ? (
                    <Briefcase size={24} style={{ color: 'white' }} />
                  ) : (
                    <Calendar size={24} style={{ color: 'white' }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                    {dataSource.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                    {dataSource.description}
                  </p>
                  <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <GlassStatusBadge
                      status="info"
                      label={`${dataSource.schema.columns.length} columns`}
                      size="sm"
                    />
                    <GlassStatusBadge
                      status="success"
                      label={dataSource.type}
                      size="sm"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                      <Clock size={12} />
                      {new Date(dataSource.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
                <GlassButton variant="ghost" size="sm">
                  <Table size={14} style={{ marginRight: spacing.xs }} />
                  Preview
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleCreateReport}
                >
                  <BarChart2 size={14} style={{ marginRight: spacing.xs }} />
                  Create Report
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Reports */}
      <div style={{ marginBottom: spacing.xl }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary }}>
            Reports
          </h2>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/reporting/reports')}
          >
            View All
          </GlassButton>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: spacing.lg,
        }}>
          {filteredReports.slice(0, 3).map(report => (
            <GlassCard key={report.id} variant="primary" padding="lg" hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: colors.gradients.success,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {report.name.includes('Person') ? (
                    <Users size={24} style={{ color: 'white' }} />
                  ) : report.name.includes('Visitor') ? (
                    <Briefcase size={24} style={{ color: 'white' }} />
                  ) : (
                    <Calendar size={24} style={{ color: 'white' }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
                <GlassButton variant="ghost" size="sm">
                  <Star size={14} style={{ marginRight: spacing.xs }} />
                  Favorite
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewReport(report.id)}
                >
                  <BarChart2 size={14} style={{ marginRight: spacing.xs }} />
                  View Report
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Dashboards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary }}>
            Dashboards
          </h2>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/reporting/dashboards')}
          >
            View All
          </GlassButton>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: spacing.lg,
        }}>
          {filteredDashboards.map(dashboard => (
            <GlassCard key={dashboard.id} variant="primary" padding="lg" hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: colors.gradients.warning,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Grid size={24} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
                <GlassButton variant="ghost" size="sm">
                  <Star size={14} style={{ marginRight: spacing.xs }} />
                  Favorite
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDashboard(dashboard.id)}
                >
                  <Grid size={14} style={{ marginRight: spacing.xs }} />
                  View Dashboard
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
