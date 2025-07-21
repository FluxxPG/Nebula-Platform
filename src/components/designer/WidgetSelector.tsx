import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Eye, Code, Check } from 'lucide-react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { GlassButton, GlassInput, GlassStatusBadge } from '../../ui/components';
import { PageDesign, FormWidget } from '../../types/designer';

interface WidgetSelectorProps {
  onWidgetSelect: (widget: FormWidget) => void;
  onClose: () => void;
  className?: string;
}

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  onWidgetSelect,
  onClose,
  className = '',
}) => {
  const colors = useThemeColors();
  const [savedDesigns, setSavedDesigns] = useState<PageDesign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Load saved designs from localStorage
  useEffect(() => {
    const savedDesignsData = localStorage.getItem('nebula-ui-designs');
    if (savedDesignsData) {
      try {
        setSavedDesigns(JSON.parse(savedDesignsData));
      } catch (error) {
        console.error('Failed to load saved designs:', error);
      }
    }
  }, []);

  // Filter designs based on search term
  const filteredDesigns = savedDesigns.filter(design => 
    design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected design
  const selectedDesign = selectedDesignId 
    ? savedDesigns.find(d => d.id === selectedDesignId) 
    : null;

  // Get widgets from selected design
  const availableWidgets = selectedDesign?.widgets || [];

  // Filter widgets based on search term
  const filteredWidgets = availableWidgets.filter(widget => 
    widget.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectWidget = (widget: FormWidget) => {
    // Create a deep copy of the widget to avoid reference issues
    const widgetCopy: FormWidget = JSON.parse(JSON.stringify(widget));
    
    // Generate new IDs for the widget and its fields to avoid conflicts
    const newWidgetId = `widget-${Date.now()}`;
    widgetCopy.id = newWidgetId;
    
    widgetCopy.fields = widgetCopy.fields.map(field => ({
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));
    
    onWidgetSelect(widgetCopy);
    onClose();
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
    height: '100%',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  };

  const searchStyles: React.CSSProperties = {
    marginBottom: spacing.xl,
  };

  const designListStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  };

  const designCardStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.lg,
    background: isSelected ? colors.gradients.primary : colors.glass.secondary,
    color: isSelected ? 'white' : colors.text.primary,
    border: `1px solid ${isSelected ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const widgetListStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  };

  const widgetCardStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.lg,
    background: isSelected ? colors.gradients.primary : colors.glass.secondary,
    color: isSelected ? 'white' : colors.text.primary,
    border: `1px solid ${isSelected ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing['3xl'],
    color: colors.text.secondary,
  };

  return (
    <div style={containerStyles} className={className}>
      {/* Header */}
      <div style={headerStyles}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: colors.text.primary,
          margin: 0,
        }}>
          {selectedDesignId ? 'Select Widget' : 'Select Design'}
        </h3>
        
        {selectedDesignId && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDesignId(null)}
          >
            Back to Designs
          </GlassButton>
        )}
      </div>

      {/* Search */}
      <div style={searchStyles}>
        <GlassInput
          placeholder={selectedDesignId ? "Search widgets..." : "Search designs..."}
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Design Selection */}
      {!selectedDesignId && (
        <>
          {filteredDesigns.length === 0 ? (
            <div style={emptyStateStyles}>
              <Eye size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Saved Designs Found
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                {searchTerm 
                  ? `No designs match "${searchTerm}". Try a different search term.` 
                  : 'Create and save designs in the UI Designer first.'}
              </p>
            </div>
          ) : (
            <div style={designListStyles}>
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  style={designCardStyles(false)}
                  onClick={() => setSelectedDesignId(design.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = shadows.glassHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: spacing.sm,
                  }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      margin: 0,
                      marginBottom: spacing.xs,
                    }}>
                      {design.name}
                    </h4>
                    <GlassStatusBadge
                      status="info"
                      label={`${design.widgets.length} widgets`}
                      size="sm"
                    />
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: colors.text.secondary,
                    margin: 0,
                    marginBottom: spacing.md,
                  }}>
                    {design.description || 'No description'}
                  </p>
                  
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.text.secondary,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Updated: {new Date(design.updatedAt).toLocaleDateString()}</span>
                    <span>{design.type.charAt(0).toUpperCase() + design.type.slice(1)} Form</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Widget Selection */}
      {selectedDesignId && (
        <>
          {filteredWidgets.length === 0 ? (
            <div style={emptyStateStyles}>
              <Code size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Widgets Found
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                {searchTerm 
                  ? `No widgets match "${searchTerm}". Try a different search term.` 
                  : 'This design does not contain any widgets.'}
              </p>
            </div>
          ) : (
            <div style={widgetListStyles}>
              {filteredWidgets.map(widget => (
                <div
                  key={widget.id}
                  style={widgetCardStyles(selectedWidgetId === widget.id)}
                  onClick={() => setSelectedWidgetId(widget.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = shadows.glassHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: spacing.sm,
                  }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      margin: 0,
                      marginBottom: spacing.xs,
                      color: selectedWidgetId === widget.id ? 'white' : colors.text.primary,
                    }}>
                      {widget.title}
                    </h4>
                    <GlassStatusBadge
                      status={selectedWidgetId === widget.id ? 'success' : 'info'}
                      label={`${widget.fields.length} fields`}
                      size="sm"
                    />
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: selectedWidgetId === widget.id ? 'rgba(255, 255, 255, 0.8)' : colors.text.secondary,
                    margin: 0,
                    marginBottom: spacing.md,
                  }}>
                    <div style={{ marginBottom: spacing.sm }}>
                      {widget.fields.slice(0, 3).map(field => field.label).join(', ')}
                      {widget.fields.length > 3 && `, +${widget.fields.length - 3} more`}
                    </div>
                    <div>
                      {widget.settings.columns} column{widget.settings.columns !== 1 ? 's' : ''} • {widget.settings.spacing} spacing
                    </div>
                  </div>
                  
                  {selectedWidgetId === widget.id && (
                    <GlassButton
                      variant="success"
                      size="sm"
                      onClick={() => handleSelectWidget(widget)}
                      style={{ width: '100%' }}
                    >
                      <Check size={16} style={{ marginRight: spacing.sm }} />
                      Use This Widget
                    </GlassButton>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: spacing.md,
        marginTop: 'auto',
        paddingTop: spacing.lg,
        borderTop: `1px solid ${colors.border.light}`,
      }}>
        <GlassButton
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </GlassButton>
        
        {selectedWidgetId && (
          <GlassButton
            variant="primary"
            onClick={() => {
              const widget = availableWidgets.find(w => w.id === selectedWidgetId);
              if (widget) {
                handleSelectWidget(widget);
              }
            }}
          >
            <Plus size={16} style={{ marginRight: spacing.sm }} />
            Add Widget
          </GlassButton>
        )}
      </div>
    </div>
  );
};