import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Trash2, Edit, Code, FileText, Check, X } from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassInput, GlassModal, GlassStatusBadge } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../ui';
import { JsonModel } from '../types/designer';

export const ModelManagerPage: React.FC = () => {
  const colors = useThemeColors();
  const [models, setModels] = useState<JsonModel[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<JsonModel | null>(null);
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [modelSchema, setModelSchema] = useState('');
  const [schemaError, setSchemaError] = useState('');

  // Load models from localStorage
  useEffect(() => {
    const savedModels = localStorage.getItem('nebula-json-models');
    if (savedModels) {
      try {
        setModels(JSON.parse(savedModels));
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    }
  }, []);

  const saveModels = (updatedModels: JsonModel[]) => {
    setModels(updatedModels);
    localStorage.setItem('nebula-json-models', JSON.stringify(updatedModels));
  };

  const validateSchema = (schemaText: string): boolean => {
    try {
      const parsed = JSON.parse(schemaText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setSchemaError('Schema must be a valid JSON object');
        return false;
      }
      setSchemaError('');
      return true;
    } catch (error) {
      setSchemaError('Invalid JSON format');
      return false;
    }
  };

  const handleCreateModel = () => {
    if (!modelName.trim()) {
      alert('Please enter a model name');
      return;
    }

    if (!validateSchema(modelSchema)) {
      return;
    }

    const newModel: JsonModel = {
      id: `model-${Date.now()}`,
      name: modelName,
      description: modelDescription,
      version: '1.0.0',
      schema: JSON.parse(modelSchema),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveModels([...models, newModel]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEditModel = () => {
    if (!selectedModel || !modelName.trim()) {
      alert('Please enter a model name');
      return;
    }

    if (!validateSchema(modelSchema)) {
      return;
    }

    const updatedModel: JsonModel = {
      ...selectedModel,
      name: modelName,
      description: modelDescription,
      schema: JSON.parse(modelSchema),
      updatedAt: new Date().toISOString(),
    };

    const updatedModels = models.map(model => 
      model.id === selectedModel.id ? updatedModel : model
    );

    saveModels(updatedModels);
    resetForm();
    setIsEditModalOpen(false);
    setSelectedModel(null);
  };

  const handleDeleteModel = (modelId: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      const updatedModels = models.filter(model => model.id !== modelId);
      saveModels(updatedModels);
    }
  };

  const handleImportModel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const importedData = JSON.parse(content);
            
            if (importedData.name && importedData.schema) {
              const newModel: JsonModel = {
                id: `model-${Date.now()}`,
                name: importedData.name,
                description: importedData.description || '',
                version: importedData.version || '1.0.0',
                schema: importedData.schema,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              saveModels([...models, newModel]);
              alert('Model imported successfully!');
            } else {
              alert('Invalid model file format');
            }
          } catch (error) {
            alert('Failed to import model: Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportModel = (model: JsonModel) => {
    const dataStr = JSON.stringify(model, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${model.name.replace(/\s+/g, '_')}_model.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openEditModal = (model: JsonModel) => {
    setSelectedModel(model);
    setModelName(model.name);
    setModelDescription(model.description);
    setModelSchema(JSON.stringify(model.schema, null, 2));
    setIsEditModalOpen(true);
  };

  const openViewModal = (model: JsonModel) => {
    setSelectedModel(model);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setModelName('');
    setModelDescription('');
    setModelSchema('');
    setSchemaError('');
  };

  const getDefaultSchema = () => {
    return JSON.stringify({
      "id": "string",
      "name": "string",
      "email": "string",
      "age": "number",
      "isActive": "boolean",
      "createdAt": "date"
    }, null, 2);
  };

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: spacing.xl,
    marginTop: spacing.xl,
  };

  const cardStyles: React.CSSProperties = {
    padding: spacing.xl,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    transition: 'all 0.3s ease',
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing['3xl'],
    color: colors.text.secondary,
    gridColumn: '1 / -1',
  };

  return (
    <PageLayout
      title="JSON Model Manager"
      subtitle="Create and manage JSON data models for your UI components"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton
            variant="ghost"
            size="lg"
            onClick={handleImportModel}
          >
            <Upload size={20} style={{ marginRight: spacing.sm }} />
            Import Model
          </GlassButton>
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => {
              resetForm();
              setModelSchema(getDefaultSchema());
              setIsCreateModalOpen(true);
            }}
          >
            <Plus size={20} style={{ marginRight: spacing.sm }} />
            Create Model
          </GlassButton>
        </div>
      }
    >
      {models.length === 0 ? (
        <div style={emptyStateStyles}>
          <FileText size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: colors.text.primary, 
            marginBottom: spacing.lg 
          }}>
            No Models Created Yet
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            maxWidth: '500px', 
            margin: '0 auto',
            marginBottom: spacing.xl,
          }}>
            Create your first JSON model to define data structures for your UI components. 
            Models can be used to bind form fields and validate data.
          </p>
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => {
              resetForm();
              setModelSchema(getDefaultSchema());
              setIsCreateModalOpen(true);
            }}
          >
            <Plus size={20} style={{ marginRight: spacing.sm }} />
            Create Your First Model
          </GlassButton>
        </div>
      ) : (
        <div style={containerStyles}>
          {models.map((model) => (
            <div
              key={model.id}
              style={cardStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = shadows.glassHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = shadows.glass;
              }}
            >
              <div style={{ marginBottom: spacing.lg }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  {model.name}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: colors.text.secondary,
                  lineHeight: '1.5',
                  marginBottom: spacing.md,
                }}>
                  {model.description || 'No description provided'}
                </p>
                <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg }}>
                  <GlassStatusBadge
                    status="info"
                    label={`v${model.version}`}
                    size="sm"
                  />
                  <GlassStatusBadge
                    status="success"
                    label={`${Object.keys(model.schema).length} fields`}
                    size="sm"
                  />
                </div>
              </div>

              <div style={{
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
                marginBottom: spacing.lg,
                maxHeight: '150px',
                overflowY: 'auto',
              }}>
                <h4 style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Schema Preview
                </h4>
                <pre style={{
                  fontSize: '0.75rem',
                  color: colors.text.primary,
                  margin: 0,
                  fontFamily: 'monospace',
                  lineHeight: '1.4',
                }}>
                  {JSON.stringify(model.schema, null, 2)}
                </pre>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: spacing.md,
                borderTop: `1px solid ${colors.border.light}`,
              }}>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                  Updated {new Date(model.updatedAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewModal(model)}
                    title="View details"
                  >
                    <Code size={14} />
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(model)}
                    title="Edit model"
                  >
                    <Edit size={14} />
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportModel(model)}
                    title="Export model"
                  >
                    <Download size={14} />
                  </GlassButton>
                  <GlassButton
                    variant="error"
                    size="sm"
                    onClick={() => handleDeleteModel(model.id)}
                    title="Delete model"
                  >
                    <Trash2 size={14} />
                  </GlassButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Model Modal */}
      <GlassModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Model"
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
              Model Name *
            </label>
            <GlassInput
              value={modelName}
              onChange={setModelName}
              placeholder="Enter model name (e.g., User, Product, Order)"
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
              value={modelDescription}
              onChange={setModelDescription}
              placeholder="Describe what this model represents"
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
              JSON Schema *
            </label>
            <textarea
              value={modelSchema}
              onChange={(e) => {
                setModelSchema(e.target.value);
                if (schemaError) {
                  validateSchema(e.target.value);
                }
              }}
              placeholder="Enter JSON schema..."
              style={{
                width: '100%',
                height: '300px',
                padding: spacing.lg,
                background: colors.glass.secondary,
                border: `2px solid ${schemaError ? '#ef4444' : colors.border.light}`,
                borderRadius: borderRadius.lg,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: colors.text.primary,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            {schemaError && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.875rem',
                marginTop: spacing.sm,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}>
                <X size={16} />
                {schemaError}
              </div>
            )}
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
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleCreateModel}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Create Model
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Edit Model Modal */}
      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedModel(null);
        }}
        title="Edit Model"
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
              Model Name *
            </label>
            <GlassInput
              value={modelName}
              onChange={setModelName}
              placeholder="Enter model name"
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
              value={modelDescription}
              onChange={setModelDescription}
              placeholder="Describe what this model represents"
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
              JSON Schema *
            </label>
            <textarea
              value={modelSchema}
              onChange={(e) => {
                setModelSchema(e.target.value);
                if (schemaError) {
                  validateSchema(e.target.value);
                }
              }}
              style={{
                width: '100%',
                height: '300px',
                padding: spacing.lg,
                background: colors.glass.secondary,
                border: `2px solid ${schemaError ? '#ef4444' : colors.border.light}`,
                borderRadius: borderRadius.lg,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: colors.text.primary,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            {schemaError && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.875rem',
                marginTop: spacing.sm,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}>
                <X size={16} />
                {schemaError}
              </div>
            )}
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
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
                setSelectedModel(null);
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleEditModel}
            >
              <Check size={16} style={{ marginRight: spacing.sm }} />
              Save Changes
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* View Model Modal */}
      <GlassModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedModel(null);
        }}
        title={selectedModel ? `Model: ${selectedModel.name}` : 'Model Details'}
      >
        {selectedModel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div style={{
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.border.light}`,
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}>
                Model Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
                    Name
                  </span>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary, fontWeight: '500' }}>
                    {selectedModel.name}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
                    Version
                  </span>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary, fontWeight: '500' }}>
                    {selectedModel.version}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
                    Created
                  </span>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary, fontWeight: '500' }}>
                    {new Date(selectedModel.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
                    Updated
                  </span>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary, fontWeight: '500' }}>
                    {new Date(selectedModel.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {selectedModel.description && (
                <div style={{ marginTop: spacing.md }}>
                  <span style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
                    Description
                  </span>
                  <div style={{ fontSize: '0.875rem', color: colors.text.primary, fontWeight: '500' }}>
                    {selectedModel.description}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}>
                JSON Schema
              </h4>
              <pre style={{
                padding: spacing.lg,
                background: colors.glass.secondary,
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.border.light}`,
                fontSize: '0.875rem',
                color: colors.text.primary,
                fontFamily: 'monospace',
                lineHeight: '1.5',
                overflow: 'auto',
                maxHeight: '400px',
              }}>
                {JSON.stringify(selectedModel.schema, null, 2)}
              </pre>
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
                onClick={() => handleExportModel(selectedModel)}
              >
                <Download size={16} style={{ marginRight: spacing.sm }} />
                Export
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedModel);
                }}
              >
                <Edit size={16} style={{ marginRight: spacing.sm }} />
                Edit Model
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};