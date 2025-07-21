import React, { useState } from 'react';
import { 
  Grid, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  ChevronLeft,
  BarChart2,
  FileText,
  Layout,
  Move,
  Eye,
  Filter
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassCard, GlassDropdown, GlassInput, GlassModal } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockReports, getReportById } from '../../data/reportingMockData';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardBuilderPage: React.FC = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [widgets, setWidgets] = useState<any[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Widget form state
  const [widgetType, setWidgetType] = useState('visualization');
  const [widgetTitle, setWidgetTitle] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [selectedVisualizationId, setSelectedVisualizationId] = useState('');
  const [widgetContent, setWidgetContent] = useState('');
  const [widgetPosition, setWidgetPosition] = useState({ x: 0, y: 0, w: 6, h: 6 });
  
  // Get available visualizations for selected report
  const getAvailableVisualizations = () => {
    const report = getReportById(selectedReportId);
    return report?.visualizations || [];
  };
  
  // Handle add widget
  const handleAddWidget = () => {
    if (widgetType === 'visualization' && (!selectedReportId || !selectedVisualizationId)) {
      setError('Report and visualization are required for visualization widgets');
      return;
    }
    
    if (widgetType === 'text' && !widgetContent.trim()) {
      setError('Content is required for text widgets');
      return;
    }
    
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: widgetTitle || (widgetType === 'visualization' ? 'Visualization' : widgetType === 'text' ? 'Text' : 'Filter'),
      reportId: widgetType === 'visualization' ? selectedReportId : undefined,
      visualizationId: widgetType === 'visualization' ? selectedVisualizationId : undefined,
      content: widgetType === 'text' ? widgetContent : undefined,
      position: widgetPosition,
    };
    
    setWidgets([...widgets, newWidget]);
    setIsAddWidgetModalOpen(false);
    
    // Reset form
    setWidgetType('visualization');
    setWidgetTitle('');
    setSelectedReportId('');
    setSelectedVisualizationId('');
    setWidgetContent('');
    setWidgetPosition({ x: 0, y: 0, w: 6, h: 6 });
    setError(null);
  };
  
  // Handle remove widget
  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };
  
  // Handle save dashboard
  const handleSaveDashboard = () => {
    if (!dashboardName.trim()) {
      setError('Dashboard name is required');
      return;
    }
    
    // In a real app, this would save the dashboard to the server
    // For now, we'll just show a success message and navigate back
    alert('Dashboard saved successfully!');
    navigate('/reporting/dashboards');
  };
  
  // Get widget icon
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'visualization':
        return <BarChart2 size={20} />;
      case 'text':
        return <FileText size={20} />;
      case 'filter':
        return <Filter size={20} />;
      default:
        return <Grid size={20} />;
    }
  };

  return (
    <PageLayout
      title="Dashboard Builder"
      subtitle="Create a new dashboard by adding widgets and arranging them on the grid"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Link to="/reporting/dashboards">
            <GlassButton variant="ghost">
              <ChevronLeft size={18} style={{ marginRight: spacing.sm }} />
              Back to Dashboards
            </GlassButton>
          </Link>
          <GlassButton 
            variant="ghost"
            onClick={() => setIsPreviewModalOpen(true)}
            disabled={widgets.length === 0}
          >
            <Eye size={18} style={{ marginRight: spacing.sm }} />
            Preview
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => setIsSaveModalOpen(true)}
          >
            <Save size={18} style={{ marginRight: spacing.sm }} />
            Save Dashboard
          </GlassButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Dashboard Info */}
        <GlassCard variant="primary" padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
            Dashboard Information
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
                Dashboard Name *
              </label>
              <GlassInput
                value={dashboardName}
                onChange={setDashboardName}
                placeholder="Enter dashboard name"
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
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
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
              placeholder="Enter dashboard description"
            />
          </div>
        </GlassCard>
        
        {/* Dashboard Layout */}
        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary }}>
              Dashboard Layout
            </h3>
            <GlassButton 
              variant="primary" 
              size="sm"
              onClick={() => setIsAddWidgetModalOpen(true)}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Widget
            </GlassButton>
          </div>
          
          {widgets.length === 0 ? (
            <div style={{
              padding: spacing.xl,
              textAlign: 'center',
              color: colors.text.secondary,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px dashed ${colors.border.light}`,
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Layout size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Widgets Added
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
                Add widgets to your dashboard to display visualizations, text, and filters.
              </p>
              <GlassButton 
                variant="primary"
                onClick={() => setIsAddWidgetModalOpen(true)}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Your First Widget
              </GlassButton>
            </div>
          ) : (
            <div style={{
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              minHeight: '600px',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'repeat(12, 50px)',
              gap: spacing.md,
              position: 'relative',
            }}>
              {widgets.map(widget => (
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
                  }}
                >
                  <div style={{
                    padding: spacing.md,
                    background: colors.glass.secondary,
                    borderBottom: `1px solid ${colors.border.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.text.primary,
                      }}>
                        {getWidgetIcon(widget.type)}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary }}>
                        {widget.title}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                      <GlassButton 
                        variant="ghost" 
                        size="sm"
                      >
                        <Move size={14} />
                      </GlassButton>
                      <GlassButton 
                        variant="error" 
                        size="sm"
                        onClick={() => handleRemoveWidget(widget.id)}
                      >
                        <Trash2 size={14} />
                      </GlassButton>
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: spacing.md, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.secondary }}>
                    {widget.type === 'visualization' ? (
                      <div style={{ textAlign: 'center' }}>
                        <BarChart2 size={32} style={{ marginBottom: spacing.sm, opacity: 0.5 }} />
                        <div style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                          Visualization Preview
                        </div>
                      </div>
                    ) : widget.type === 'text' ? (
                      <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                        {widget.content}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Filter size={32} style={{ marginBottom: spacing.sm, opacity: 0.5 }} />
                        <div style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                          Filter Widget
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Add Widget Modal */}
      <GlassModal
        isOpen={isAddWidgetModalOpen}
        onClose={() => {
          setIsAddWidgetModalOpen(false);
          setWidgetType('visualization');
          setWidgetTitle('');
          setSelectedReportId('');
          setSelectedVisualizationId('');
          setWidgetContent('');
          setWidgetPosition({ x: 0, y: 0, w: 6, h: 6 });
          setError(null);
        }}
        title="Add Widget"
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
              Widget Type *
            </label>
            <GlassDropdown
              options={[
                { value: 'visualization', label: 'Visualization' },
                { value: 'text', label: 'Text' },
                { value: 'filter', label: 'Filter' },
              ]}
              value={widgetType}
              onChange={setWidgetType}
              placeholder="Select widget type"
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
              Widget Title
            </label>
            <GlassInput
              value={widgetTitle}
              onChange={setWidgetTitle}
              placeholder="Enter widget title (optional)"
            />
          </div>
          
          {widgetType === 'visualization' && (
            <>
              <div style={{ marginBottom: spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  Report *
                </label>
                <GlassDropdown
                  options={mockReports.map(report => ({ value: report.id, label: report.name }))}
                  value={selectedReportId}
                  onChange={(value) => {
                    setSelectedReportId(value);
                    setSelectedVisualizationId('');
                  }}
                  placeholder="Select report"
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
                  Visualization *
                </label>
                <GlassDropdown
                  options={getAvailableVisualizations().map(viz => ({ value: viz.id, label: viz.name }))}
                  value={selectedVisualizationId}
                  onChange={setSelectedVisualizationId}
                  placeholder="Select visualization"
                  disabled={!selectedReportId}
                />
              </div>
            </>
          )}
          
          {widgetType === 'text' && (
            <div style={{ marginBottom: spacing.xl }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Content *
              </label>
              <textarea
                value={widgetContent}
                onChange={(e) => setWidgetContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '150px',
                  padding: spacing.md,
                  background: colors.glass.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.lg,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
                placeholder="Enter text content"
              />
              <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
                You can use Markdown formatting.
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Position and Size
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  X Position
                </label>
                <GlassInput
                  type="number"
                  value={widgetPosition.x.toString()}
                  onChange={(value) => setWidgetPosition({ ...widgetPosition, x: parseInt(value) || 0 })}
                  placeholder="X position"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  Y Position
                </label>
                <GlassInput
                  type="number"
                  value={widgetPosition.y.toString()}
                  onChange={(value) => setWidgetPosition({ ...widgetPosition, y: parseInt(value) || 0 })}
                  placeholder="Y position"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  Width
                </label>
                <GlassInput
                  type="number"
                  value={widgetPosition.w.toString()}
                  onChange={(value) => setWidgetPosition({ ...widgetPosition, w: parseInt(value) || 1 })}
                  placeholder="Width"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}>
                  Height
                </label>
                <GlassInput
                  type="number"
                  value={widgetPosition.h.toString()}
                  onChange={(value) => setWidgetPosition({ ...widgetPosition, h: parseInt(value) || 1 })}
                  placeholder="Height"
                />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
              Position is 0-based. Grid is 12 columns wide and 12 rows tall.
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
                setIsAddWidgetModalOpen(false);
                setWidgetType('visualization');
                setWidgetTitle('');
                setSelectedReportId('');
                setSelectedVisualizationId('');
                setWidgetContent('');
                setWidgetPosition({ x: 0, y: 0, w: 6, h: 6 });
                setError(null);
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleAddWidget}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Widget
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Save Dashboard Modal */}
      <GlassModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Dashboard"
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
              Dashboard Name *
            </label>
            <GlassInput
              value={dashboardName}
              onChange={setDashboardName}
              placeholder="Enter dashboard name"
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
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
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
              placeholder="Enter dashboard description"
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
              onClick={handleSaveDashboard}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Save Dashboard
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Preview Modal */}
      <GlassModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Dashboard Preview"
      >
        <div style={{ padding: spacing.xl }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
            {dashboardName || 'Untitled Dashboard'}
          </h2>
          
          {dashboardDescription && (
            <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xl }}>
              {dashboardDescription}
            </p>
          )}
          
          <div style={{ marginBottom: spacing.xl }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
              Dashboard Layout
            </h3>
            
            {widgets.length === 0 ? (
              <div style={{
                padding: spacing.xl,
                textAlign: 'center',
                color: colors.text.secondary,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
              }}>
                <p>No widgets added yet.</p>
              </div>
            ) : (
              <div style={{
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                minHeight: '400px',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(12, 30px)',
                gap: spacing.md,
                position: 'relative',
              }}>
                {widgets.map(widget => (
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
                    }}
                  >
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
                        {widget.title}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: spacing.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.secondary, fontSize: '0.75rem' }}>
                      {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
                    </div>
                  </div>
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
              Save Dashboard
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </PageLayout>
  );
};