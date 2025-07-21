import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
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
  AlertTriangle
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassCard, GlassStatusBadge, GlassDropdown, GlassDataTable } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockReports, getReportById, executeReport, getDataSourceById } from '../../data/reportingMockData';
import { Report, Visualization } from '../../types/reporting';
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

export const ReportViewPage: React.FC = () => {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  // Load report data
  useEffect(() => {
    if (!reportId) return;
    
    const fetchedReport = getReportById(reportId);
    if (!fetchedReport) {
      setError('Report not found');
      setIsLoading(false);
      return;
    }
    
    setReport(fetchedReport);
    
    // Initialize active filters
    const initialFilters: Record<string, any> = {};
    fetchedReport.filters.forEach(filter => {
      if (filter.isActive) {
        initialFilters[filter.column] = filter.value;
      }
    });
    setActiveFilters(initialFilters);
    
    // Execute report
    try {
      const data = executeReport(fetchedReport);
      setReportData(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error executing report: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  }, [reportId]);
  
  // Refresh report data
  const handleRefreshData = () => {
    if (!report) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = executeReport(report);
      setReportData(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error executing report: ' + (err instanceof Error ? err.message : String(err)));
      setIsLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (column: string, value: any) => {
    setActiveFilters({
      ...activeFilters,
      [column]: value,
    });
    
    // In a real app, this would re-execute the report with the new filters
    // For now, we'll just simulate a refresh
    handleRefreshData();
  };
  
  // Handle edit report
  const handleEditReport = () => {
    if (report) {
      navigate(`/reporting/report-builder?id=${report.id}`);
    }
  };
  
  // Get table columns for data table
  const getTableColumns = () => {
    if (!reportData || reportData.length === 0) return [];
    
    const firstRow = reportData[0];
    return Object.keys(firstRow).map(key => ({
      key,
      label: key,
      sortable: true,
    }));
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
  
  // Render visualization
  const renderVisualization = (viz: Visualization) => {
    if (!reportData || reportData.length === 0) {
      return (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text.secondary,
          fontSize: '0.875rem',
          fontStyle: 'italic',
        }}>
          No data available for visualization
        </div>
      );
    }
    
    // Prepare data for visualization
    const data = reportData.map(row => {
      const item: Record<string, any> = {};
      viz.dataConfig.dimensions.forEach(dim => {
        item[dim] = row[dim];
      });
      viz.dataConfig.metrics.forEach(metric => {
        item[metric] = row[metric];
      });
      return item;
    });
    
    // Render based on visualization type
    switch (viz.type) {
      case 'bar':
        return (
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                <XAxis 
                  dataKey={viz.dataConfig.dimensions[0]}
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
                {viz.dataConfig.metrics.map((metric, index) => (
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
          <div style={{ width: '100%', height: '400px' }}>
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
                  data={data}
                  dataKey={viz.dataConfig.metrics[0]}
                  nameKey={viz.dataConfig.dimensions[0]}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: colors.text.secondary, strokeWidth: 1 }}
                >
                  {data.map((entry, index) => (
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
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                <XAxis 
                  dataKey={viz.dataConfig.dimensions[0]}
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
                {viz.dataConfig.metrics.map((metric, index) => (
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
          <div style={{ width: '100%' }}>
            <GlassDataTable
              columns={viz.dataConfig.dimensions.concat(viz.dataConfig.metrics).map(col => ({
                key: col,
                label: col,
                sortable: true,
              }))}
              data={data}
              pagination={true}
              pageSize={10}
              searchable={true}
              showPageSizeSelector={true}
            />
          </div>
        );
      
      default:
        return (
          <div style={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.secondary,
            fontSize: '0.875rem',
            fontStyle: 'italic',
          }}>
            Unsupported visualization type: {viz.type}
          </div>
        );
    }
  };

  return (
    <PageLayout
      title={report?.name || 'Report View'}
      subtitle={report?.description || 'Loading report...'}
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Link to="/reporting/reports">
            <GlassButton variant="ghost">
              <ChevronLeft size={18} style={{ marginRight: spacing.sm }} />
              Back to Reports
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
            onClick={handleEditReport}
          >
            <Edit size={18} style={{ marginRight: spacing.sm }} />
            Edit Report
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
            Loading Report
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Please wait while we load the report data...
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
            Error Loading Report
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
            {error}
          </p>
          <Link to="/reporting/reports">
            <GlassButton variant="primary">
              <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />
              Back to Reports
            </GlassButton>
          </Link>
        </div>
      ) : report ? (
        <>
          {/* Report Info */}
          <GlassCard variant="primary" padding="lg" style={{ marginBottom: spacing['3xl'] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={`Data Source: ${getDataSourceById(report.dataSourceId)?.name || 'Unknown'}`} 
                  size="md" 
                />
                <GlassStatusBadge 
                  status="success" 
                  label={`${report.visualizations.length} visualizations`} 
                  size="md" 
                />
                <GlassStatusBadge 
                  status="warning" 
                  label={`${report.filters.length} filters`} 
                  size="md" 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}>
                  <Clock size={16} />
                  <span>Updated {new Date(report.updatedAt).toLocaleDateString()}</span>
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
          
          {/* Filters */}
          {report.filters.length > 0 && (
            <GlassCard variant="primary" padding="lg" className="mt-2" style={{ marginBottom: spacing['3xl'] }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                Filters
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg }}>
                {report.filters.map(filter => (
                  <div key={filter.id} style={{ minWidth: '200px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}>
                      {filter.column}
                    </label>
                    <GlassDropdown
                      options={[
                        { value: 'option1', label: 'Option 1' },
                        { value: 'option2', label: 'Option 2' },
                        { value: 'option3', label: 'Option 3' },
                      ]}
                      value={activeFilters[filter.column] || ''}
                      onChange={(value) => handleFilterChange(filter.column, value)}
                      placeholder="Select value"
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
          
          {/* Visualizations */}
          {report.visualizations.map((viz, index) => (
            <GlassCard 
              key={viz.id} 
              variant="primary" 
              padding="lg" 
              style={{ marginBottom: spacing['3xl'] }}
              className="mt-2"
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                {viz.name}
              </h3>
              {renderVisualization(viz)}
            </GlassCard>
          ))}

          
          {/* Data Table */}
          <GlassCard variant="primary" padding="lg" className="mt-2">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg}}>
              Data Table
            </h3>
            
            {reportData && reportData.length > 0 ? (
              <GlassDataTable
                columns={getTableColumns()}
                data={reportData}
                pagination={true}
                pageSize={10}
                searchable={true}
                showPageSizeSelector={true}
              />
            ) : (
              <div style={{
                padding: spacing.xl,
                textAlign: 'center',
                color: colors.text.secondary,
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: colors.text.primary, 
                  marginBottom: spacing.md 
                }}>
                  No Data Available
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  There is no data available for this report. Try adjusting the filters or refreshing the data.
                </p>
              </div>
            )}
          </GlassCard>
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
            Report Not Found
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
            The requested report could not be found.
          </p>
          <Link to="/reporting/reports">
            <GlassButton variant="primary">
              <ChevronLeft size={16} style={{ marginRight: spacing.sm }} />
              Back to Reports
            </GlassButton>
          </Link>
        </div>
      )}
    </PageLayout>
  );
};