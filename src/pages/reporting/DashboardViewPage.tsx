import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Download, 
  Filter, 
  Share, 
  Printer, 
  RefreshCw, 
  Calendar, 
  Clock,
  ChevronLeft,
  Edit,
  Star,
  AlertTriangle,
  BarChart2,
  PieChart,
  LineChart,
  Table,
  FileText
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassCard, GlassStatusBadge, GlassDropdown } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { 
  mockDashboards, 
  getDashboardById, 
  getReportById, 
  executeReport 
} from '../../data/reportingMockData';
import { Dashboard, DashboardWidget, Report, Visualization } from '../../types/reporting';
import { 
  BarChart, 
  PieChart as RechartsPieChart, 
  LineChart as RechartsLineChart,
  Bar, 
  Pie, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export const DashboardViewPage: React.FC = () => {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [reportData, setReportData] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  // Load dashboard data
  useEffect(() => {
    if (!dashboardId) return;
    
    const fetchedDashboard = getDashboardById(dashboardId);
    if (!fetchedDashboard) {
      setError('Dashboard not found');
      setIsLoading(false);
      return;
    }
    
    setDashboard(fetchedDashboard);
    
    // Initialize active filters
    const initialFilters: Record<string, any> = {};
    fetchedDashboard.filters.forEach(filter => {
      initialFilters[filter.id] = filter.value;
    });
    setActiveFilters(initialFilters);
    
    // Load data for each report used in the dashboard
    const reportIds = new Set<string>();
    fetchedDashboard.layout.widgets.forEach(widget => {
      if (widget.reportId) {
        reportIds.add(widget.reportId);
      }
    });
    
    const reportDataPromises: Promise<void>[] = [];
    const newReportData: Record<string, any[]> = {};
    
    reportIds.forEach(reportId => {
      const report = getReportById(reportId);
      if (report) {
        reportDataPromises.push(
          new Promise<void>((resolve) => {
            // Simulate async data loading
            setTimeout(() => {
              try {
                const data = executeReport(report);
                newReportData[reportId] = data;
                resolve();
              } catch (err) {
                console.error(`Error loading data for report ${reportId}:`, err);
                resolve();
              }
            }, 500);
          })
        );
      }
    });
    
    Promise.all(reportDataPromises).then(() => {
      setReportData(newReportData);
      setIsLoading(false);
    });
  }, [dashboardId]);
  
  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters({
      ...activeFilters,
      [filterId]: value,
    });
    
    // In a real app, this would re-execute affected reports with the new filters
    // For now, we'll just simulate a refresh
    handleRefreshData();
  };
  
  // Refresh dashboard data
  const handleRefreshData = () => {
    if (!dashboard) return;
    
    setIsLoading(true);
    setError(null);
    
    // Load data for each report used in the dashboard
    const reportIds = new Set<string>();
    dashboard.layout.widgets.forEach(widget => {
      if (widget.reportId) {
        reportIds.add(widget.reportId);
      }
    });
    
    const reportDataPromises: Promise<void>[] = [];
    const newReportData: Record<string, any[]> = {};
    
    reportIds.forEach(reportId => {
      const report = getReportById(reportId);
      if (report) {
        reportDataPromises.push(
          new Promise<void>((resolve) => {
            // Simulate async data loading
            setTimeout(() => {
              try {
                const data = executeReport(report);
                newReportData[reportId] = data;
                resolve();
              } catch (err) {
                console.error(`Error loading data for report ${reportId}:`, err);
                resolve();
              }
            }, 500);
          })
        );
      }
    });
    
    Promise.all(reportDataPromises).then(() => {
      setReportData(newReportData);
      setIsLoading(false);
    });
  };
  
  // Handle edit dashboard
  const handleEditDashboard = () => {
    if (dashboard) {
      navigate(`/reporting/dashboard-builder?id=${dashboard.id}`);
    }
  };
  
  // Get widget icon
  const getWidgetIcon = (widget: DashboardWidget) => {
    if (widget.type === 'text') {
      return <FileText size={20} style={{ color: colors.text.primary }} />;
    } else if (widget.type === 'filter') {
      return <Filter size={20} style={{ color: colors.text.primary }} />;
    } else if (widget.type === 'visualization') {
      const report = getReportById(widget.reportId || '');
      const visualization = report?.visualizations.find(viz => viz.id === widget.visualizationId);
      
      if (!visualization) return <BarChart2 size={20} style={{ color: colors.text.primary }} />;
      
      switch (visualization.type) {
        case 'bar':
          return <BarChart2 size={20} style={{ color: colors.text.primary }} />;
        case 'pie':
          return <PieChart size={20} style={{ color: colors.text.primary }} />;
        case 'line':
          return <LineChart size={20} style={{ color: colors.text.primary }} />;
        case 'table':
          return <Table size={20} style={{ color: colors.text.primary }} />;
        default:
          return <BarChart2 size={20} style={{ color: colors.text.primary }} />;
      }
    }
    
    return <Grid size={20} style={{ color: colors.text.primary }} />;
  };
  
  // Get theme-aware chart colors
  const getChartColors = () => {
    // Use different color palettes based on theme
    if (theme === 'dark') {
      return [
        '#8b5cf6', // Violet
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#6366f1', // Indigo
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#f97316', // Orange
        '#84cc16'  // Lime
      ];
    } else {
      return [
        '#6366f1', // Indigo
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#f97316', // Orange
        '#84cc16'  // Lime
      ];
    }
  };
  
  // Render widget content
  const renderWidgetContent = (widget: DashboardWidget) => {
    if (widget.type === 'text') {
      return (
        <div style={{
          padding: spacing.md,
          fontSize: '0.875rem',
          color: colors.text.secondary,
          lineHeight: '1.5',
        }}>
          {widget.content}
        </div>
      );
    } else if (widget.type === 'filter') {
      return (
        <div style={{
          padding: spacing.md,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
        }}>
          <GlassDropdown
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            placeholder="Select filter value"
          />
        </div>
      );
    } else if (widget.type === 'visualization') {
      const report = getReportById(widget.reportId || '');
      const visualization = report?.visualizations.find(viz => viz.id === widget.visualizationId);
      
      if (!visualization) {
        return (
          <div style={{
            padding: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.secondary,
            fontSize: '0.875rem',
            fontStyle: 'italic',
            height: '100%',
          }}>
            Visualization not found
          </div>
        );
      }
      
      const data = reportData[widget.reportId || ''] || [];
      
      if (data.length === 0) {
        return (
          <div style={{
            padding: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.secondary,
            fontSize: '0.875rem',
            fontStyle: 'italic',
            height: '100%',
          }}>
            No data available
          </div>
        );
      }
      
      // Prepare data for visualization
      const vizData = data.map(row => {
        const item: Record<string, any> = {};
        visualization.dataConfig.dimensions.forEach(dim => {
          item[dim] = row[dim];
        });
        visualization.dataConfig.metrics.forEach(metric => {
          item[metric] = row[metric];
        });
        return item;
      });
      
      // Render based on visualization type
      switch (visualization.type) {
        case 'bar':
          return (
            <div style={{ width: '100%', height: '100%', padding: spacing.md }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vizData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                  <XAxis 
                    dataKey={visualization.dataConfig.dimensions[0]}
                    tick={{ fill: colors.text.secondary }}
                    axisLine={{ stroke: colors.border.light }}
                  />
                  <YAxis 
                    tick={{ fill: colors.text.secondary }}
                    axisLine={{ stroke: colors.border.light }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.glass.primary,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md
                    }}
                    labelStyle={{ color: colors.text.primary }}
                    itemStyle={{ color: colors.text.primary }}
                  />
                  <Legend 
                    wrapperStyle={{ color: colors.text.primary }}
                    formatter={(value) => <span style={{ color: colors.text.primary }}>{value}</span>}
                  />
                  {visualization.dataConfig.metrics.map((metric, index) => (
                    <Bar 
                      key={metric} 
                      dataKey={metric} 
                      fill={getChartColors()[index % getChartColors().length]}
                      name={metric}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        
        case 'pie':
          return (
            <div style={{ width: '100%', height: '100%', padding: spacing.md }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.glass.primary,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md
                    }}
                    labelStyle={{ color: colors.text.primary }}
                    itemStyle={{ color: colors.text.primary }}
                  />
                  <Legend 
                    wrapperStyle={{ color: colors.text.primary }}
                    formatter={(value) => <span style={{ color: colors.text.primary }}>{value}</span>}
                  />
                  <Pie
                    data={vizData}
                    dataKey={visualization.dataConfig.metrics[0]}
                    nameKey={visualization.dataConfig.dimensions[0]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: colors.text.secondary, strokeWidth: 1 }}
                  >
                    {vizData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getChartColors()[index % getChartColors().length]}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          );
        
        case 'line':
          return (
            <div style={{ width: '100%', height: '100%', padding: spacing.md }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={vizData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                  <XAxis 
                    dataKey={visualization.dataConfig.dimensions[0]}
                    tick={{ fill: colors.text.secondary }}
                    axisLine={{ stroke: colors.border.light }}
                  />
                  <YAxis 
                    tick={{ fill: colors.text.secondary }}
                    axisLine={{ stroke: colors.border.light }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.glass.primary,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md
                    }}
                    labelStyle={{ color: colors.text.primary }}
                    itemStyle={{ color: colors.text.primary }}
                  />
                  <Legend 
                    wrapperStyle={{ color: colors.text.primary }}
                    formatter={(value) => <span style={{ color: colors.text.primary }}>{value}</span>}
                  />
                  {visualization.dataConfig.metrics.map((metric, index) => (
                    <Line 
                      key={metric} 
                      type="monotone" 
                      dataKey={metric} 
                      stroke={getChartColors()[index % getChartColors().length]}
                      activeDot={{ r: 8 }}
                      name={metric}
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          );
        
        case 'table':
          return (
            <div style={{ width: '100%', height: '100%', padding: spacing.md, overflow: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
              }}>
                <thead>
                  <tr>
                    {[...visualization.dataConfig.dimensions, ...visualization.dataConfig.metrics].map(col => (
                      <th key={col} style={{
                        padding: spacing.md,
                        textAlign: 'left',
                        borderBottom: `1px solid ${colors.border.light}`,
                        fontWeight: '600',
                        color: colors.text.primary,
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vizData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...visualization.dataConfig.dimensions, ...visualization.dataConfig.metrics].map(col => (
                        <td key={col} style={{
                          padding: spacing.md,
                          borderBottom: `1px solid ${colors.border.light}`,
                          color: colors.text.secondary,
                        }}>
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        
        default:
          return (
            <div style={{
              padding: spacing.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.secondary,
              fontSize: '0.875rem',
              fontStyle: 'italic',
              height: '100%',
            }}>
              Unsupported visualization type: {visualization.type}
            </div>
          );
      }
    }
    
    return null;
  };

  return (
    <PageLayout
      title={dashboard?.name || 'Dashboard View'}
      subtitle={dashboard?.description || 'Loading dashboard...'}
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Link to="/reporting/dashboards">
            <GlassButton variant="ghost">
              <ChevronLeft size={18} style={{ marginRight: spacing.sm }} />
              Back to Dashboards
            </GlassButton>
          </Link>
          <GlassButton variant="ghost">
            <Star size={18} style={{ marginRight: spacing.sm }} />
            Favorite
          </GlassButton>
          <GlassButton variant="ghost">
            <Share size={18} style={{ marginRight: spacing.sm }} />
            Share
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={handleEditDashboard}
          >
            <Edit size={18} style={{ marginRight: spacing.sm }} />
            Edit Dashboard
          </GlassButton>
        </div>
      }
    >
      {isLoading ? (
        <div style={{
          padding: spacing.xl,
          textAlign: 'center',
          color: colors.text.secondary,
        }}>
          <div style={{ marginBottom: spacing.lg }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: `3px solid ${colors.border.light}`,
              borderTop: `3px solid ${colors.text.primary}`,
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Loading Dashboard
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Please wait while we load the dashboard data...
          </p>
          
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : error ? (
        <div style={{
          padding: spacing.xl,
          textAlign: 'center',
          color: colors.text.secondary,
        }}>
          <AlertTriangle size={48} style={{ marginBottom: spacing.lg, color: '#ef4444' }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Error Loading Dashboard
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
            {error}
          </p>
          <Link to="/reporting/dashboards">
            <GlassButton variant="primary">
              <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />
              Back to Dashboards
            </GlassButton>
          </Link>
        </div>
      ) : dashboard ? (
        <>
          {/* Dashboard Info */}
          <GlassCard variant="primary" padding="lg" style={{ marginBottom: spacing['3xl'] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={`${dashboard.layout.widgets.length} widgets`} 
                  size="md" 
                />
                <GlassStatusBadge 
                  status="warning" 
                  label={`${dashboard.filters.length} filters`} 
                  size="md" 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}>
                  <Clock size={16} />
                  <span>Updated {new Date(dashboard.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <GlassButton variant="ghost" size="sm">
                  <Printer size={16} style={{ marginRight: spacing.xs }} />
                  Print
                </GlassButton>
                <GlassButton variant="ghost" size="sm">
                  <Download size={16} style={{ marginRight: spacing.xs }} />
                  Export
                </GlassButton>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRefreshData}
                >
                  <RefreshCw size={16} style={{ marginRight: spacing.xs }} />
                  Refresh
                </GlassButton>
              </div>
            </div>
          </GlassCard>
          
          {/* Dashboard Filters */}
          {dashboard.filters.length > 0 && (
            <GlassCard variant="primary" padding="lg" style={{ marginBottom: spacing['3xl'] }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                Filters
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg }}>
                {dashboard.filters.map(filter => (
                  <div key={filter.id} style={{ minWidth: '200px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}>
                      {filter.name}
                    </label>
                    <GlassDropdown
                      options={[
                        { value: 'option1', label: 'Option 1' },
                        { value: 'option2', label: 'Option 2' },
                        { value: 'option3', label: 'Option 3' },
                      ]}
                      value={activeFilters[filter.id] || ''}
                      onChange={(value) => handleFilterChange(filter.id, value)}
                      placeholder="Select value"
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
          
          {/* Dashboard Layout */}
          <div style={{
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            minHeight: '600px',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(12, 50px)',
            gap: spacing.xl, // Increased gap between widgets
            position: 'relative',
          }}>
            {dashboard.layout.widgets.map(widget => (
              <div 
                key={widget.id}
                style={{
                  gridColumn: `${widget.position.x + 1} / span ${widget.position.w}`,
                  gridRow: `${widget.position.y + 1} / span ${widget.position.h}`,
                  background: colors.glass.primary,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border.light}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: spacing.md, // Added margin around each widget
                }}
              >
                <div style={{
                  padding: spacing.md,
                  background: colors.glass.secondary,
                  borderBottom: `1px solid ${colors.border.light}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.primary,
                  }}>
                    {getWidgetIcon(widget)}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary }}>
                    {widget.title || widget.type}
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {renderWidgetContent(widget)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{
          padding: spacing.xl,
          textAlign: 'center',
          color: colors.text.secondary,
        }}>
          <AlertTriangle size={48} style={{ marginBottom: spacing.lg, color: '#ef4444' }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.text.primary, 
            marginBottom: spacing.md 
          }}>
            Dashboard Not Found
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
            The requested dashboard could not be found.
          </p>
          <Link to="/reporting/dashboards">
            <GlassButton variant="primary">
              <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />
              Back to Dashboards
            </GlassButton>
          </Link>
        </div>
      )}
    </PageLayout>
  );
};