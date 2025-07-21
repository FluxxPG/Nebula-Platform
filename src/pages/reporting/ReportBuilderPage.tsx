import React, { useState } from 'react';
import { 
  BarChart2, 
  Save, 
  Play, 
  Plus, 
  Trash2, 
  Settings, 
  ChevronLeft,
  Database,
  Table,
  PieChart,
  LineChart,
  Eye,
  Code,
  Layout,
  X,
  Check
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassCard, GlassDropdown, GlassInput, GlassModal, GlassStatusBadge } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockDataSources, getDataSourceById } from '../../data/reportingMockData';
import { Link, useNavigate } from 'react-router-dom';

export const ReportBuilderPage: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedDataSourceId, setSelectedDataSourceId] = useState(mockDataSources[0]?.id || '');
  const [isCustomSQL, setIsCustomSQL] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAddVisualizationModalOpen, setIsAddVisualizationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Visualization form state
  const [vizName, setVizName] = useState('');
  const [vizType, setVizType] = useState('table');
  const [vizDimensions, setVizDimensions] = useState<string[]>([]);
  const [vizMetrics, setVizMetrics] = useState<string[]>([]);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  
  // Get available columns from selected data source
  const getAvailableColumns = () => {
    const dataSource = getDataSourceById(selectedDataSourceId);
    return dataSource?.schema.columns || [];
  };
  
  // Add dimension to visualization
  const handleAddDimension = () => {
    if (selectedDimension && !vizDimensions.includes(selectedDimension)) {
      setVizDimensions([...vizDimensions, selectedDimension]);
      setSelectedDimension('');
    }
  };
  
  // Remove dimension from visualization
  const handleRemoveDimension = (dimension: string) => {
    setVizDimensions(vizDimensions.filter(dim => dim !== dimension));
  };
  
  // Add metric to visualization
  const handleAddMetric = () => {
    if (selectedMetric && !vizMetrics.includes(selectedMetric)) {
      setVizMetrics([...vizMetrics, selectedMetric]);
      setSelectedMetric('');
    }
  };
  
  // Remove metric from visualization
  const handleRemoveMetric = (metric: string) => {
    setVizMetrics(vizMetrics.filter(m => m !== metric));
  };
  
  // Handle add visualization
  const handleAddVisualization = () => {
    if (!vizName.trim() || !vizType || vizDimensions.length === 0) {
      setError('Visualization name, type, and at least one dimension are required');
      return;
    }
    
    const newVisualization = {
      id: `viz-${Date.now()}`,
      name: vizName,
      type: vizType,
      config: {
        title: vizName,
        showLegend: true,
        legendPosition: 'right',
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        showTooltip: true,
      },
      dataConfig: {
        dimensions: vizDimensions,
        metrics: vizMetrics,
        filters: [],
      },
      order: visualizations.length,
    };
    
    setVisualizations([...visualizations, newVisualization]);
    setIsAddVisualizationModalOpen(false);
    
    // Reset form
    setVizName('');
    setVizType('table');
    setVizDimensions([]);
    setVizMetrics([]);
    setSelectedDimension('');
    setSelectedMetric('');
    setError(null);
  };
  
  // Handle remove visualization
  const handleRemoveVisualization = (vizId: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== vizId));
  };
  
  // Handle save report
  const handleSaveReport = () => {
    if (!reportName.trim() || !selectedDataSourceId) {
      setError('Report name and data source are required');
      return;
    }
    
    // In a real app, this would save the report to the server
    // For now, we'll just show a success message and navigate back
    alert('Report saved successfully!');
    navigate('/reporting/reports');
  };
  
  // Get visualization icon
  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <BarChart2 size={20} />;
      case 'pie':
        return <PieChart size={20} />;
      case 'line':
        return <LineChart size={20} />;
      case 'table':
        return <Table size={20} />;
      default:
        return <BarChart2 size={20} />;
    }
  };

  return (
    <PageLayout
      title="Report Builder"
      subtitle="Create a new report by selecting data sources and adding visualizations"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Link to="/reporting/reports">
            <GlassButton variant="ghost">
              <ChevronLeft size={18} style={{ marginRight: spacing.sm }} />
              Back to Reports
            </GlassButton>
          </Link>
          <GlassButton 
            variant="ghost"
            onClick={() => setIsPreviewModalOpen(true)}
            disabled={visualizations.length === 0}
          >
            <Eye size={18} style={{ marginRight: spacing.sm }} />
            Preview
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => setIsSaveModalOpen(true)}
          >
            <Save size={18} style={{ marginRight: spacing.sm }} />
            Save Report
          </GlassButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Report Info */}
        <GlassCard variant="primary" padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
            Report Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.lg }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Report Name *
              </label>
              <GlassInput
                value={reportName}
                onChange={setReportName}
                placeholder="Enter report name"
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
                Data Source *
              </label>
              <GlassDropdown
                options={mockDataSources.map(ds => ({ value: ds.id, label: ds.name }))}
                value={selectedDataSourceId}
                onChange={setSelectedDataSourceId}
                placeholder="Select data source"
              />
            </div>
          </div>
          <div style={{ marginTop: spacing.lg }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Description
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              style={{
                width: '100%',
                height: '80px',
                padding: spacing.md,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                color: colors.text.primary,
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
              placeholder="Enter report description"
            />
          </div>
        </GlassCard>
        
        {/* Visualizations */}
        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary }}>
              Visualizations
            </h3>
            <GlassButton 
              variant="primary" 
              size="sm"
              onClick={() => setIsAddVisualizationModalOpen(true)}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Visualization
            </GlassButton>
          </div>
          
          {visualizations.length === 0 ? (
            <div style={{
              padding: spacing.xl,
              textAlign: 'center',
              color: colors.text.secondary,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px dashed ${colors.border.light}`,
            }}>
              <BarChart2 size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Visualizations Added
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
                Add visualizations to your report to display your data in different ways.
              </p>
              <GlassButton 
                variant="primary"
                onClick={() => setIsAddVisualizationModalOpen(true)}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Your First Visualization
              </GlassButton>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: spacing.lg }}>
              {visualizations.map(viz => (
                <GlassCard key={viz.id} variant="secondary" padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
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
                    <GlassButton 
                      variant="error" 
                      size="sm"
                      onClick={() => handleRemoveVisualization(viz.id)}
                    >
                      <Trash2 size={14} />
                    </GlassButton>
                  </div>
                  
                  <div style={{
                    padding: spacing.md,
                    background: colors.glass.secondary,
                    borderRadius: borderRadius.md,
                    marginBottom: spacing.md,
                  }}>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      <strong>Type:</strong> {viz.type}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                      <strong>Dimensions:</strong> {viz.dataConfig.dimensions.join(', ')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                      <strong>Metrics:</strong> {viz.dataConfig.metrics.join(', ') || 'None'}
                    </div>
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
          )}
        </GlassCard>
      </div>

      {/* Add Visualization Modal */}
      <GlassModal
        isOpen={isAddVisualizationModalOpen}
        onClose={() => {
          setIsAddVisualizationModalOpen(false);
          setVizName('');
          setVizType('table');
          setVizDimensions([]);
          setVizMetrics([]);
          setSelectedDimension('');
          setSelectedMetric('');
          setError(null);
        }}
        title="Add Visualization"
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
              Visualization Name *
            </label>
            <GlassInput
              value={vizName}
              onChange={setVizName}
              placeholder="Enter visualization name"
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
              Visualization Type *
            </label>
            <GlassDropdown
              options={[
                { value: 'table', label: 'Table' },
                { value: 'bar', label: 'Bar Chart' },
                { value: 'line', label: 'Line Chart' },
                { value: 'pie', label: 'Pie Chart' },
              ]}
              value={vizType}
              onChange={setVizType}
              placeholder="Select visualization type"
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
              Dimensions *
            </label>
            <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
              <div style={{ flex: 1 }}>
                <GlassDropdown
                  options={getAvailableColumns()
                    .filter(col => !col.isNumeric && !vizDimensions.includes(col.name))
                    .map(col => ({ value: col.name, label: col.displayName }))}
                  value={selectedDimension}
                  onChange={setSelectedDimension}
                  placeholder="Select dimension"
                />
              </div>
              <GlassButton 
                variant="primary" 
                size="sm"
                onClick={handleAddDimension}
                disabled={!selectedDimension}
              >
                <Plus size={16} />
              </GlassButton>
            </div>
            
            {/* Selected dimensions */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: spacing.sm,
              marginBottom: spacing.sm
            }}>
              {vizDimensions.map(dimension => (
                <div key={dimension} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                  fontSize: '0.75rem',
                  color: colors.text.primary,
                }}>
                  <span>{getAvailableColumns().find(col => col.name === dimension)?.displayName || dimension}</span>
                  <button
                    onClick={() => handleRemoveDimension(dimension)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.text.secondary,
                      padding: '2px',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              Dimensions are categorical fields used for grouping data.
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
              Metrics
            </label>
            <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
              <div style={{ flex: 1 }}>
                <GlassDropdown
                  options={getAvailableColumns()
                    .filter(col => col.isNumeric && !vizMetrics.includes(col.name))
                    .map(col => ({ value: col.name, label: col.displayName }))}
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  placeholder="Select metric"
                />
              </div>
              <GlassButton 
                variant="primary" 
                size="sm"
                onClick={handleAddMetric}
                disabled={!selectedMetric}
              >
                <Plus size={16} />
              </GlassButton>
            </div>
            
            {/* Selected metrics */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: spacing.sm,
              marginBottom: spacing.sm
            }}>
              {vizMetrics.map(metric => (
                <div key={metric} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                  fontSize: '0.75rem',
                  color: colors.text.primary,
                }}>
                  <span>{getAvailableColumns().find(col => col.name === metric)?.displayName || metric}</span>
                  <button
                    onClick={() => handleRemoveMetric(metric)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.text.secondary,
                      padding: '2px',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              Metrics are numerical fields used for measuring data.
            </div>
          </div>
          
          {error && (
            <div style={{
              marginBottom: spacing.xl,
              padding: spacing.md,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: borderRadius.md,
              color: '#ef4444',
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.sm,
            }}>
              <Trash2 size={16} style={{ marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => {
                setIsAddVisualizationModalOpen(false);
                setVizName('');
                setVizType('table');
                setVizDimensions([]);
                setVizMetrics([]);
                setSelectedDimension('');
                setSelectedMetric('');
                setError(null);
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleAddVisualization}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Visualization
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Save Report Modal */}
      <GlassModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Report"
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
              Report Name *
            </label>
            <GlassInput
              value={reportName}
              onChange={setReportName}
              placeholder="Enter report name"
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
              Description
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              style={{
                width: '100%',
                height: '80px',
                padding: spacing.md,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                color: colors.text.primary,
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
              placeholder="Enter report description"
            />
          </div>
          
          {error && (
            <div style={{
              marginBottom: spacing.xl,
              padding: spacing.md,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: borderRadius.md,
              color: '#ef4444',
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.sm,
            }}>
              <Trash2 size={16} style={{ marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => setIsSaveModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleSaveReport}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Save Report
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Preview Modal */}
      <GlassModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Report Preview"
      >
        <div style={{ padding: spacing.xl }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
            {reportName || 'Untitled Report'}
          </h2>
          
          {reportDescription && (
            <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xl }}>
              {reportDescription}
            </p>
          )}
          
          <div style={{ marginBottom: spacing.xl }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
              Visualizations
            </h3>
            
            {visualizations.length === 0 ? (
              <div style={{
                padding: spacing.xl,
                textAlign: 'center',
                color: colors.text.secondary,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
              }}>
                <p>No visualizations added yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {visualizations.map(viz => (
                  <GlassCard key={viz.id} variant="secondary" padding="md">
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
                      {viz.name}
                    </h4>
                    <div style={{
                      height: '300px',
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
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => setIsPreviewModalOpen(false)}
            >
              Close
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={() => {
                setIsPreviewModalOpen(false);
                setIsSaveModalOpen(true);
              }}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Save Report
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </PageLayout>
  );
};