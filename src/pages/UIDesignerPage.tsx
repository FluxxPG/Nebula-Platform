import React, { useState, useEffect } from 'react';
import { Save, Play, Eye, Code, Download, Upload, Trash2, Plus } from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassInput, GlassDropdown, GlassModal, GlassStatusBadge } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../ui';
import { WidgetLibrary } from '../components/designer/WidgetLibrary';
import { DesignCanvas } from '../components/designer/DesignCanvas';
import { PropertyPanel } from '../components/designer/PropertyPanel';
import { FormWidget, FormField, PageDesign, JsonModel, FormData, ValidationError } from '../types/designer';

export const UIDesignerPage: React.FC = () => {
  const colors = useThemeColors();
  const [currentDesign, setCurrentDesign] = useState<PageDesign | null>(null);
  const [widgets, setWidgets] = useState<FormWidget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<JsonModel[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isModelSelectModalOpen, setIsModelSelectModalOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<PageDesign[]>([]);
  const [designName, setDesignName] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  // Load saved designs and models from localStorage
  useEffect(() => {
    const savedDesignsData = localStorage.getItem('nebula-ui-designs');
    if (savedDesignsData) {
      try {
        setSavedDesigns(JSON.parse(savedDesignsData));
      } catch (error) {
        console.error('Failed to load saved designs:', error);
      }
    }

    const savedModelsData = localStorage.getItem('nebula-json-models');
    if (savedModelsData) {
      try {
        setAvailableModels(JSON.parse(savedModelsData));
      } catch (error) {
        console.error('Failed to load saved models:', error);
      }
    }
  }, []);

  // Check if there are models available and prompt to select one if none is selected
  useEffect(() => {
    if (availableModels.length > 0 && !selectedModelId && !currentDesign) {
      setIsModelSelectModalOpen(true);
    }
  }, [availableModels, selectedModelId, currentDesign]);

  // Reset validation errors when switching to design mode
  useEffect(() => {
    if (!isPreviewMode) {
      setValidationErrors([]);
      setIsSubmitSuccessful(false);
    }
  }, [isPreviewMode]);

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId) || null;
  const selectedField = selectedWidget?.fields.find(f => f.id === selectedFieldId) || null;

  const handleWidgetAdd = (widget: FormWidget) => {
    // If a model is selected, set the widget's modelBinding
    const updatedWidget = selectedModelId ? {
      ...widget,
      modelBinding: selectedModelId
    } : widget;
    
    setWidgets([...widgets, updatedWidget]);
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<FormWidget>) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    ));
  };

  const handleWidgetDelete = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
    if (selectedWidgetId === widgetId) {
      setSelectedWidgetId(null);
      setSelectedFieldId(null);
    }
  };

  const handleFieldUpdate = (widgetId: string, fieldId: string, updates: Partial<FormField>) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? {
            ...widget,
            fields: widget.fields.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : widget
    ));
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    widgets.forEach(widget => {
      widget.fields.forEach(field => {
        const value = formData[field.id];
        
        if (field.validations && field.validations.length > 0) {
          field.validations.forEach(validation => {
            if (!validation.enabled) return;

            switch (validation.type) {
              case 'required':
                if (value === undefined || value === null || value === '') {
                  errors.push({ fieldId: field.id, message: validation.message || 'This field is required' });
                }
                break;
              case 'minLength':
                if (value && typeof value === 'string' && validation.value && value.length < Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Minimum length is ${validation.value} characters` });
                }
                break;
              case 'maxLength':
                if (value && typeof value === 'string' && validation.value && value.length > Number(validation.value)) {
                  errors.push({ fieldId: field.id, message: validation.message || `Maximum length is ${validation.value} characters` });
                }
                break;
              case 'email':
                if (value && typeof value === 'string') {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid email address' });
                  }
                }
                break;
              case 'number':
                if (value && isNaN(Number(value))) {
                  errors.push({ fieldId: field.id, message: validation.message || 'Please enter a valid number' });
                }
                break;
              case 'pattern':
                if (value && typeof value === 'string' && validation.value) {
                  try {
                    const regex = new RegExp(validation.value);
                    if (!regex.test(value)) {
                      errors.push({ fieldId: field.id, message: validation.message || 'Value does not match the required pattern' });
                    }
                  } catch (error) {
                    console.error('Invalid regex pattern:', validation.value);
                  }
                }
                break;
              case 'custom':
                // Custom validation would go here
                break;
            }
          });
        }

        // Also check required flag even if no validations are defined
        if (field.required && (value === undefined || value === null || value === '')) {
          // Only add this error if there isn't already a required validation error for this field
          if (!errors.some(error => error.fieldId === field.id)) {
            errors.push({ fieldId: field.id, message: 'This field is required' });
          }
        }
      });
    });

    return errors;
  };

  const handleSave = () => {
    if (!designName.trim()) {
      alert('Please enter a design name');
      return;
    }

    const design: PageDesign = {
      id: currentDesign?.id || `design-${Date.now()}`,
      name: designName,
      description: designDescription,
      type: 'view',
      widgets,
      settings: {
        layout: 'single',
        maxWidth: '1200px',
        padding: '2rem',
      },
      modelId: selectedModelId || undefined,
      createdAt: currentDesign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDesigns = currentDesign 
      ? savedDesigns.map(d => d.id === currentDesign.id ? design : d)
      : [...savedDesigns, design];

    setSavedDesigns(updatedDesigns);
    localStorage.setItem('nebula-ui-designs', JSON.stringify(updatedDesigns));
    setCurrentDesign(design);
    setIsSaveModalOpen(false);
    
    alert('Design saved successfully!');
  };

  const handleLoad = (design: PageDesign) => {
    setCurrentDesign(design);
    setWidgets(design.widgets);
    setDesignName(design.name);
    setDesignDescription(design.description);
    setSelectedWidgetId(null);
    setSelectedFieldId(null);
    setSelectedModelId(design.modelId || null);
    setIsLoadModalOpen(false);
  };

  const handleDeleteDesign = (designId: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      const updatedDesigns = savedDesigns.filter(d => d.id !== designId);
      setSavedDesigns(updatedDesigns);
      localStorage.setItem('nebula-ui-designs', JSON.stringify(updatedDesigns));
      
      if (currentDesign?.id === designId) {
        setCurrentDesign(null);
        setWidgets([]);
        setDesignName('');
        setDesignDescription('');
      }
    }
  };

  const handleFormSubmit = () => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length === 0) {
      // Save form data to localStorage
      const submissionData = {
        designId: currentDesign?.id,
        designName: currentDesign?.name,
        data: formData,
        submittedAt: new Date().toISOString(),
      };

      const existingSubmissions = JSON.parse(localStorage.getItem('nebula-form-submissions') || '[]');
      existingSubmissions.push(submissionData);
      localStorage.setItem('nebula-form-submissions', JSON.stringify(existingSubmissions));

      setIsSubmitSuccessful(true);
      console.log('Form Data:', formData);
    } else {
      setIsSubmitSuccessful(false);
      console.log(`Form has ${errors.length} validation error(s):`, errors);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.fieldId !== fieldId));
    
    // Reset success state when form is modified
    if (isSubmitSuccessful) {
      setIsSubmitSuccessful(false);
    }
  };

  const getFieldError = (fieldId: string) => {
    return validationErrors.find(error => error.fieldId === fieldId)?.message || '';
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelSelectModalOpen(false);
    
    // Update existing widgets to use this model
    if (widgets.length > 0) {
      const updatedWidgets = widgets.map(widget => ({
        ...widget,
        modelBinding: modelId
      }));
      setWidgets(updatedWidgets);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    height: 'calc(100vh - 200px)',
    gap: spacing.lg,
    padding: spacing.xl,
    background: colors.glass.primary,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    border: 'none',
  };

  const toolbarStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    background: colors.glass.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    border: 'none',
  };

  const leftToolbarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const rightToolbarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const successMessageStyles: React.CSSProperties = {
    padding: spacing.lg,
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: borderRadius.lg,
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  };

  return (
    <PageLayout
      title="UI Designer"
      subtitle="Create and customize forms with drag-and-drop widgets, validation rules, and data binding"
    >
      {/* Toolbar */}
      <div style={toolbarStyles}>
        <div style={leftToolbarStyles}>
          <GlassInput
            placeholder="Design name..."
            value={designName}
            onChange={setDesignName}
          />
          <GlassStatusBadge
            status={currentDesign ? 'success' : 'warning'}
            label={currentDesign ? 'Saved' : 'Unsaved'}
            size="sm"
          />
          {widgets.length > 0 && (
            <GlassStatusBadge
              status="info"
              label={`${widgets.length} widget${widgets.length !== 1 ? 's' : ''}`}
              size="sm"
            />
          )}
          {selectedModelId && (
            <GlassStatusBadge
              status="success"
              label={`Model: ${availableModels.find(m => m.id === selectedModelId)?.name || 'Selected'}`}
              size="sm"
            />
          )}
        </div>

        <div style={rightToolbarStyles}>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setIsModelSelectModalOpen(true)}
          >
            <Code size={16} style={{ marginRight: spacing.sm }} />
            Select Model
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setIsLoadModalOpen(true)}
          >
            <Upload size={16} style={{ marginRight: spacing.sm }} />
            Load
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <Code size={16} /> : <Eye size={16} />}
            <span style={{ marginLeft: spacing.sm }}>
              {isPreviewMode ? 'Design' : 'Preview'}
            </span>
          </GlassButton>

          {isPreviewMode && (
            <GlassButton
              variant="success"
              size="sm"
              onClick={handleFormSubmit}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Submit Form
            </GlassButton>
          )}

          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setIsSaveModalOpen(true)}
          >
            <Save size={16} style={{ marginRight: spacing.sm }} />
            Save Design
          </GlassButton>
        </div>
      </div>

      {/* Success Message */}
      {isPreviewMode && isSubmitSuccessful && (
        <div style={successMessageStyles}>
          <CheckCircle size={20} />
          <div>
            <strong>Form submitted successfully!</strong>
            <div style={{ fontSize: '0.875rem', marginTop: spacing.xs }}>
              The form data has been saved and validated without errors.
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Summary */}
      {isPreviewMode && validationErrors.length > 0 && (
        <div style={{
          padding: spacing.lg,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: borderRadius.lg,
          color: '#ef4444',
          marginBottom: spacing.xl,
        }}>
          <div style={{ fontWeight: '600', marginBottom: spacing.sm }}>
            Please fix the following validation errors:
          </div>
          <ul style={{ paddingLeft: spacing.xl, margin: 0 }}>
            {validationErrors.map((error, index) => {
              // Find the field with this error
              let fieldLabel = 'Field';
              widgets.forEach(widget => {
                const field = widget.fields.find(f => f.id === error.fieldId);
                if (field) {
                  fieldLabel = field.label;
                }
              });
              
              return (
                <li key={index} style={{ marginBottom: spacing.xs }}>
                  <strong>{fieldLabel}:</strong> {error.message}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Main Designer Interface */}
      <div style={containerStyles}>
        {!isPreviewMode && (
          <WidgetLibrary
            onWidgetDrag={(widgetType) => {
              // This will be handled by the canvas drop event
              console.log('Widget dragged:', widgetType);
            }}
          />
        )}

        <DesignCanvas
          widgets={widgets}
          onWidgetAdd={handleWidgetAdd}
          onWidgetUpdate={handleWidgetUpdate}
          onWidgetDelete={handleWidgetDelete}
          onWidgetSelect={setSelectedWidgetId}
          selectedWidgetId={selectedWidgetId}
          onFieldSelect={setSelectedFieldId}
          selectedFieldId={selectedFieldId}
          isPreviewMode={isPreviewMode}
          formData={formData}
          onFieldChange={handleFieldChange}
          getFieldError={getFieldError}
        />

        {!isPreviewMode && (
          <PropertyPanel
            selectedWidget={selectedWidget}
            selectedField={selectedField}
            onWidgetUpdate={handleWidgetUpdate}
            onFieldUpdate={handleFieldUpdate}
            availableModels={availableModels}
          />
        )}
      </div>

      {/* Save Modal */}
      <GlassModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Design"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Design Name
            </label>
            <GlassInput
              value={designName}
              onChange={setDesignName}
              placeholder="Enter design name"
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
              Description
            </label>
            <GlassInput
              value={designDescription}
              onChange={setDesignDescription}
              placeholder="Enter design description"
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.md,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.border.light}`,
          }}>
            <GlassButton
              variant="ghost"
              onClick={() => setIsSaveModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleSave}
            >
              Save Design
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Load Modal */}
      <GlassModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        title="Load Design"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {savedDesigns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: spacing['3xl'],
              color: colors.text.secondary,
            }}>
              <Code size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Saved Designs
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Create and save your first design to see it here.
              </p>
            </div>
          ) : (
            savedDesigns.map((design) => (
              <div
                key={design.id}
                style={{
                  padding: spacing.lg,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${colors.border.light}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}>
                    {design.name}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: colors.text.secondary,
                    marginBottom: spacing.sm,
                  }}>
                    {design.description || 'No description'}
                  </p>
                  <div style={{ display: 'flex', gap: spacing.sm }}>
                    <GlassStatusBadge
                      status="info"
                      label={`${design.widgets.length} widgets`}
                      size="sm"
                    />
                    <GlassStatusBadge
                      status="success"
                      label={new Date(design.updatedAt).toLocaleDateString()}
                      size="sm"
                    />
                    {design.modelId && (
                      <GlassStatusBadge
                        status="warning"
                        label={`Model: ${availableModels.find(m => m.id === design.modelId)?.name || 'Linked'}`}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleLoad(design)}
                  >
                    Load
                  </GlassButton>
                  <GlassButton
                    variant="error"
                    size="sm"
                    onClick={() => handleDeleteDesign(design.id)}
                  >
                    <Trash2 size={14} />
                  </GlassButton>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassModal>

      {/* Model Selection Modal */}
      <GlassModal
        isOpen={isModelSelectModalOpen}
        onClose={() => setIsModelSelectModalOpen(false)}
        title="Select Data Model"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div style={{
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`,
          }}>
            <p style={{ 
              color: colors.text.primary, 
              fontSize: '0.875rem',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Select a data model to bind your form fields to. This will allow you to map form fields to specific properties in your data model.
            </p>
          </div>

          {availableModels.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: spacing['3xl'],
              color: colors.text.secondary,
            }}>
              <Code size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.text.primary, 
                marginBottom: spacing.md 
              }}>
                No Models Available
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                lineHeight: '1.5',
                marginBottom: spacing.xl,
              }}>
                Create a data model in the Model Manager first to enable data binding.
              </p>
              <GlassButton
                variant="primary"
                onClick={() => setIsModelSelectModalOpen(false)}
              >
                Continue Without Model
              </GlassButton>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    style={{
                      padding: spacing.lg,
                      background: colors.glass.secondary,
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.border.light}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => handleModelSelect(model.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.glass.primary;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = shadows.glassHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.glass.secondary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}>
                          {model.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: colors.text.secondary,
                          marginBottom: spacing.sm,
                        }}>
                          {model.description || 'No description'}
                        </p>
                      </div>
                      <GlassStatusBadge
                        status="info"
                        label={`v${model.version}`}
                        size="sm"
                      />
                    </div>
                    
                    <div style={{
                      fontSize: '0.75rem',
                      color: colors.text.secondary,
                      fontWeight: '600',
                      marginBottom: spacing.xs,
                    }}>
                      Schema Preview:
                    </div>
                    <div style={{
                      padding: spacing.sm,
                      background: colors.glass.primary,
                      borderRadius: borderRadius.md,
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      maxHeight: '80px',
                      overflowY: 'auto',
                    }}>
                      {Object.keys(model.schema).map(key => (
                        <div key={key} style={{ marginBottom: '2px' }}>
                          {key}: <span style={{ color: colors.text.secondary }}>{model.schema[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: spacing.md,
                paddingTop: spacing.lg,
                borderTop: `1px solid ${colors.border.light}`,
              }}>
                <GlassButton
                  variant="ghost"
                  onClick={() => setIsModelSelectModalOpen(false)}
                >
                  Continue Without Model
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={() => window.location.href = '#/model-manager'}
                >
                  Create New Model
                </GlassButton>
              </div>
            </>
          )}
        </div>
      </GlassModal>
    </PageLayout>
  );
};