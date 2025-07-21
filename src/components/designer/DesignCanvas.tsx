import React, { useState, useRef } from 'react';
import { Plus, Settings, Trash2, Move, Copy } from 'lucide-react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { FormWidget, FormField, FormData, ValidationError } from '../../types/designer';
import { FieldRenderer } from './FieldRenderer';
import { GlassButton } from '../../ui/components';

interface DesignCanvasProps {
  widgets: FormWidget[];
  onWidgetAdd: (widget: FormWidget) => void;
  onWidgetUpdate: (widgetId: string, updates: Partial<FormWidget>) => void;
  onWidgetDelete: (widgetId: string) => void;
  onWidgetSelect: (widgetId: string | null) => void;
  selectedWidgetId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  selectedFieldId: string | null;
  isPreviewMode?: boolean;
  formData?: FormData;
  onFieldChange?: (fieldId: string, value: any) => void;
  getFieldError?: (fieldId: string) => string;
  className?: string;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  widgets,
  onWidgetAdd,
  onWidgetUpdate,
  onWidgetDelete,
  onWidgetSelect,
  selectedWidgetId,
  onFieldSelect,
  selectedFieldId,
  isPreviewMode = false,
  formData = {},
  onFieldChange,
  getFieldError,
  className = '',
}) => {
  const colors = useThemeColors();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const containerStyles: React.CSSProperties = {
    flex: 1,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px',
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.light}`,
    background: colors.glass.secondary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const canvasAreaStyles: React.CSSProperties = {
    flex: 1,
    padding: spacing.xl,
    overflowY: 'auto',
    position: 'relative',
    minHeight: '400px',
    border: isDragOver ? `2px dashed ${colors.border.medium}` : 'none',
    background: isDragOver ? colors.glass.secondary : 'transparent',
    transition: 'all 0.3s ease',
  };

  const emptyStateStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px',
    color: colors.text.secondary,
    textAlign: 'center',
  };

  const widgetContainerStyles = (widget: FormWidget, isSelected: boolean): React.CSSProperties => ({
    marginBottom: spacing.lg,
    padding: spacing.lg,
    background: isSelected ? colors.glass.secondary : colors.glass.primary,
    border: `2px solid ${isSelected ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    position: 'relative',
    transition: 'all 0.2s ease',
    cursor: isPreviewMode ? 'default' : 'pointer',
  });

  const widgetHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
    background: colors.glass.secondary,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border.light}`,
  };

  const fieldGridStyles = (columns: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: spacing.lg,
    marginTop: spacing.lg,
  });

  const dropZoneStyles = (isActive: boolean): React.CSSProperties => ({
    minHeight: '60px',
    border: `2px dashed ${isActive ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: '500',
    background: isActive ? colors.glass.secondary : 'transparent',
    transition: 'all 0.2s ease',
    marginBottom: spacing.lg,
  });

  // Enhanced drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the canvas entirely
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
    
    console.log('Drop event triggered');
    
    try {
      const widgetData = e.dataTransfer.getData('application/json');
      console.log('Widget data received:', widgetData);
      
      if (!widgetData) {
        console.error('No widget data found in drop event');
        return;
      }
      
      const parsedWidget = JSON.parse(widgetData);
      console.log('Parsed widget:', parsedWidget);
      
      // Create new widget from dropped data
      const newWidget: FormWidget = {
        id: `widget-${Date.now()}`,
        type: 'form',
        title: `${parsedWidget.name} Widget`,
        fields: [{
          id: `field-${Date.now()}`,
          ...parsedWidget.defaultConfig,
          order: 0,
        }],
        settings: {
          columns: 1,
          spacing: 'normal',
          showBorder: true,
          showShadow: false,
        },
        order: widgets.length,
      };
      
      console.log('Creating new widget:', newWidget);
      onWidgetAdd(newWidget);
      
    } catch (error) {
      console.error('Failed to parse dropped widget data:', error);
    }
  };

  const handleZoneDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverIndex(index);
  };

  const handleZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
  };

  const handleZoneDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    
    try {
      const widgetData = e.dataTransfer.getData('application/json');
      if (!widgetData) return;
      
      const parsedWidget = JSON.parse(widgetData);
      
      // Create new widget from dropped data
      const newWidget: FormWidget = {
        id: `widget-${Date.now()}`,
        type: 'form',
        title: `${parsedWidget.name} Widget`,
        fields: [{
          id: `field-${Date.now()}`,
          ...parsedWidget.defaultConfig,
          order: 0,
        }],
        settings: {
          columns: 1,
          spacing: 'normal',
          showBorder: true,
          showShadow: false,
        },
        order: index,
      };
      
      onWidgetAdd(newWidget);
      
    } catch (error) {
      console.error('Failed to parse dropped widget data:', error);
    }
  };

  const handleWidgetClick = (widgetId: string, e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    onWidgetSelect(widgetId);
    onFieldSelect(null);
  };

  const handleFieldClick = (fieldId: string, e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    onFieldSelect(fieldId);
  };

  const handleCanvasClick = () => {
    if (isPreviewMode) return;
    onWidgetSelect(null);
    onFieldSelect(null);
  };

  const duplicateWidget = (widget: FormWidget) => {
    const duplicatedWidget: FormWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      title: `${widget.title} (Copy)`,
      fields: widget.fields.map(field => ({
        ...field,
        id: `field-${Date.now()}-${field.id}`,
      })),
      order: widgets.length,
    };
    onWidgetAdd(duplicatedWidget);
  };

  const getFieldWidth = (width: string) => {
    switch (width) {
      case 'full': return '1';
      case 'half': return '1 / span 6';
      case 'third': return '1 / span 4';
      case 'quarter': return '1 / span 3';
      default: return '1';
    }
  };

  return (
    <>
      <style>
        {`
          .widget-container:hover {
            box-shadow: ${shadows.glassHover} !important;
            transform: translateY(-1px) !important;
          }
          
          .widget-container.selected {
            box-shadow: 0 0 0 3px rgba(74, 45, 133, 0.3) !important;
          }
          
          .field-container {
            transition: all 0.2s ease;
            border-radius: ${borderRadius.md};
            padding: ${spacing.md};
            border: 2px solid transparent;
          }
          
          .field-container:hover {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.light} !important;
          }
          
          .field-container.selected {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: 0 0 0 2px rgba(74, 45, 133, 0.2) !important;
          }
          
          .canvas-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .canvas-content::-webkit-scrollbar {
            display: none;
          }
          
          .preview-mode .widget-container {
            cursor: default !important;
          }
          
          .preview-mode .widget-container:hover {
            transform: none !important;
            box-shadow: ${shadows.glass} !important;
          }
          
          .preview-mode .field-container {
            cursor: default !important;
          }
          
          .preview-mode .field-container:hover {
            background: transparent !important;
            border-color: transparent !important;
          }
          
          /* Enhanced drop zone styling */
          .drop-zone {
            transition: all 0.3s ease;
          }
          
          .drop-zone.active {
            background: ${colors.glass.secondary} !important;
            border-color: ${colors.border.medium} !important;
            transform: scale(1.02) !important;
          }
          
          .canvas-area.drag-over {
            background: ${colors.glass.secondary} !important;
            border: 2px dashed ${colors.border.medium} !important;
          }
          
          .canvas-area.drag-over::before {
            content: 'Drop widget here to add to form';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${colors.text.primary};
            font-size: 1.25rem;
            font-weight: 700;
            pointer-events: none;
            z-index: 10;
          }
        `}
      </style>
      
      <div style={containerStyles} className={`${className} ${isPreviewMode ? 'preview-mode' : ''}`}>
        <div style={headerStyles}>
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: colors.text.primary,
              margin: 0,
              marginBottom: spacing.xs,
            }}>
              {isPreviewMode ? 'Form Preview' : 'Design Canvas'}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              margin: 0,
            }}>
              {isPreviewMode 
                ? 'Test your form and validate inputs'
                : `${widgets.length} widget${widgets.length !== 1 ? 's' : ''} • ${!isPreviewMode ? 'Drag widgets here or click to select and configure' : ''}`
              }
            </p>
          </div>
          
          {!isPreviewMode && (
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <GlassButton variant="ghost" size="sm" onClick={handleCanvasClick}>
                Clear Selection
              </GlassButton>
            </div>
          )}
        </div>

        <div 
          ref={canvasRef}
          style={canvasAreaStyles}
          className={`canvas-content ${isDragOver ? 'drag-over' : ''}`}
          onClick={handleCanvasClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {widgets.length === 0 ? (
            <div style={emptyStateStyles}>
              <Plus size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
              <h4 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}>
                {isPreviewMode ? 'No Form to Preview' : 'Start Building Your Form'}
              </h4>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                maxWidth: '400px',
                marginBottom: spacing.xl,
              }}>
                {isPreviewMode 
                  ? 'Switch to design mode to create your form first.'
                  : 'Drag widgets from the library to create your custom form. You can add input fields, display elements, and layout components.'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Drop zone at the beginning */}
              {!isPreviewMode && (
                <div
                  className={`drop-zone ${dragOverIndex === 0 ? 'active' : ''}`}
                  style={dropZoneStyles(dragOverIndex === 0)}
                  onDragOver={(e) => handleZoneDragOver(e, 0)}
                  onDragLeave={handleZoneDragLeave}
                  onDrop={(e) => handleZoneDrop(e, 0)}
                >
                  Drop widget here
                </div>
              )}

              {widgets.map((widget, index) => (
                <React.Fragment key={widget.id}>
                  <div
                    style={widgetContainerStyles(widget, selectedWidgetId === widget.id)}
                    className={`widget-container ${selectedWidgetId === widget.id ? 'selected' : ''}`}
                    onClick={(e) => handleWidgetClick(widget.id, e)}
                  >
                    {/* Widget Header */}
                    {!isPreviewMode && (
                      <div style={widgetHeaderStyles}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                          <Move size={16} style={{ color: colors.text.secondary, cursor: 'grab' }} />
                          <div>
                            <div style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: colors.text.primary,
                            }}>
                              {widget.title}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: colors.text.secondary,
                            }}>
                              {widget.fields.length} field{widget.fields.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: spacing.xs }}>
                          <button
                            style={{
                              padding: spacing.sm,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: borderRadius.md,
                              color: colors.text.secondary,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateWidget(widget);
                            }}
                            title="Duplicate widget"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            style={{
                              padding: spacing.sm,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: borderRadius.md,
                              color: colors.text.secondary,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onWidgetSelect(widget.id);
                            }}
                            title="Configure widget"
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            style={{
                              padding: spacing.sm,
                              background: 'transparent',
                              border: 'none',
                              borderRadius: borderRadius.md,
                              color: '#ef4444',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onWidgetDelete(widget.id);
                            }}
                            title="Delete widget"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Widget Title in Preview Mode */}
                    {isPreviewMode && widget.title && (
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: colors.text.primary,
                        marginBottom: spacing.lg,
                        paddingBottom: spacing.md,
                        borderBottom: `1px solid ${colors.border.light}`,
                      }}>
                        {widget.title}
                      </div>
                    )}

                    {/* Widget Fields */}
                    <div style={fieldGridStyles(widget.settings.columns)}>
                      {widget.fields.map((field) => (
                        <div
                          key={field.id}
                          className={`field-container ${selectedFieldId === field.id ? 'selected' : ''}`}
                          onClick={(e) => handleFieldClick(field.id, e)}
                          style={{
                            gridColumn: getFieldWidth(field.width),
                          }}
                        >
                          <FieldRenderer
                            field={field}
                            value={formData[field.id] || field.defaultValue || ''}
                            onChange={isPreviewMode ? (value) => onFieldChange?.(field.id, value) : () => {}}
                            error={isPreviewMode ? getFieldError?.(field.id) || '' : ''}
                            preview={!isPreviewMode}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drop zone after each widget */}
                  {!isPreviewMode && (
                    <div
                      className={`drop-zone ${dragOverIndex === index + 1 ? 'active' : ''}`}
                      style={dropZoneStyles(dragOverIndex === index + 1)}
                      onDragOver={(e) => handleZoneDragOver(e, index + 1)}
                      onDragLeave={handleZoneDragLeave}
                      onDrop={(e) => handleZoneDrop(e, index + 1)}
                    >
                      Drop widget here
                    </div>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};