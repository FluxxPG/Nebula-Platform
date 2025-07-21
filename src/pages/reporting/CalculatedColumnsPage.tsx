import React, { useState } from 'react';
import { 
  Columns, 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Code, 
  Check, 
  X, 
  AlertTriangle,
  Database,
  Clock
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal, GlassDropdown } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockCalculatedColumns, mockDataSources, getDataSourceById } from '../../data/reportingMockData';
import { CalculatedColumn } from '../../types/reporting';

export const CalculatedColumnsPage: React.FC = () => {
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculatedColumn, setSelectedCalculatedColumn] = useState<CalculatedColumn | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [columnName, setColumnName] = useState('');
  const [columnDisplayName, setColumnDisplayName] = useState('');
  const [columnFormula, setColumnFormula] = useState('');
  const [columnDescription, setColumnDescription] = useState('');
  const [columnDataSourceId, setColumnDataSourceId] = useState(mockDataSources[0]?.id || '');
  const [error, setError] = useState<string | null>(null);
  
  // Filter calculated columns based on search term
  const filteredCalculatedColumns = mockCalculatedColumns.filter(column => 
    column.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Reset form
  const resetForm = () => {
    setColumnName('');
    setColumnDisplayName('');
    setColumnFormula('');
    setColumnDescription('');
    setColumnDataSourceId(mockDataSources[0]?.id || '');
    setError(null);
  };
  
  // Handle add calculated column
  const handleAddCalculatedColumn = () => {
    if (!columnName.trim() || !columnDisplayName.trim() || !columnFormula.trim() || !columnDataSourceId) {
      setError('Name, display name, formula, and data source are required');
      return;
    }
    
    // In a real app, this would add the calculated column to the server
    // For now, we'll just close the modal
    setIsAddModalOpen(false);
    resetForm();
    
    // Show success message (in a real app)
    alert('Calculated column added successfully!');
  };
  
  // Handle edit calculated column
  const handleEditCalculatedColumn = (column: CalculatedColumn) => {
    setSelectedCalculatedColumn(column);
    setColumnName(column.name);
    setColumnDisplayName(column.displayName);
    setColumnFormula(column.formula);
    setColumnDescription(column.description || '');
    setColumnDataSourceId(column.dataSourceId);
    setIsEditModalOpen(true);
  };
  
  // Handle update calculated column
  const handleUpdateCalculatedColumn = () => {
    if (!columnName.trim() || !columnDisplayName.trim() || !columnFormula.trim() || !columnDataSourceId) {
      setError('Name, display name, formula, and data source are required');
      return;
    }
    
    // In a real app, this would update the calculated column on the server
    // For now, we'll just close the modal
    setIsEditModalOpen(false);
    setSelectedCalculatedColumn(null);
    resetForm();
    
    // Show success message (in a real app)
    alert('Calculated column updated successfully!');
  };
  
  // Handle delete calculated column
  const handleDeleteCalculatedColumn = (column: CalculatedColumn) => {
    setSelectedCalculatedColumn(column);
    setIsDeleteModalOpen(true);
  };
  
  // Confirm delete calculated column
  const confirmDeleteCalculatedColumn = () => {
    // In a real app, this would delete the calculated column from the server
    // For now, we'll just close the modal
    setIsDeleteModalOpen(false);
    setSelectedCalculatedColumn(null);
    
    // Show success message (in a real app)
    alert('Calculated column deleted successfully!');
  };

  return (
    <PageLayout
      title="Calculated Columns"
      subtitle="Create and manage calculated columns for your reports"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost">
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            Filters
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={18} style={{ marginRight: spacing.sm }} />
            Add Column
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
          placeholder="Search calculated columns..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Calculated Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: spacing.xl,
      }}>
        {filteredCalculatedColumns.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: spacing.xl,
            textAlign: 'center',
            color: colors.text.secondary,
          }}>
            <Columns size={48} style={{ marginBottom: spacing.lg, opacity: 0.5 }} />
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.text.primary, 
              marginBottom: spacing.md 
            }}>
              No Calculated Columns Found
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: spacing.xl }}>
              {searchTerm 
                ? `No calculated columns match "${searchTerm}". Try adjusting your search terms.` 
                : 'Create your first calculated column to enhance your reports.'}
            </p>
            <GlassButton 
              variant="primary"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Your First Column
            </GlassButton>
          </div>
        ) : (
          filteredCalculatedColumns.map(column => (
            <GlassCard key={column.id} variant="primary" padding="lg" hoverable>
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
                  <Columns size={24} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                    {column.displayName}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                    <code style={{ 
                      fontFamily: 'monospace', 
                      background: colors.glass.secondary,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.sm,
                    }}>
                      {column.name}
                    </code>
                  </div>
                  <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <GlassStatusBadge 
                      status="info" 
                      label={`Data Source: ${getDataSourceById(column.dataSourceId)?.name || 'Unknown'}`} 
                      size="sm" 
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                      <Clock size={12} />
                      {new Date(column.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                marginBottom: spacing.lg,
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.border.light}`,
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
                  Formula
                </h4>
                <pre style={{ 
                  margin: 0, 
                  fontSize: '0.75rem', 
                  fontFamily: 'monospace',
                  color: colors.text.primary,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {column.formula}
                </pre>
              </div>
              
              {column.description && (
                <div style={{ marginBottom: spacing.lg, fontSize: '0.875rem', color: colors.text.secondary }}>
                  {column.description}
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditCalculatedColumn(column)}
                >
                  <Edit size={14} style={{ marginRight: spacing.xs }} />
                  Edit
                </GlassButton>
                <GlassButton 
                  variant="error" 
                  size="sm"
                  onClick={() => handleDeleteCalculatedColumn(column)}
                >
                  <Trash2 size={14} />
                </GlassButton>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Add Calculated Column Modal */}
      <GlassModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Calculated Column"
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
              Column Name *
            </label>
            <GlassInput
              value={columnName}
              onChange={setColumnName}
              placeholder="Enter column name (e.g., full_name)"
            />
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
              This is the internal name used in formulas. Use lowercase and underscores.
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
              Display Name *
            </label>
            <GlassInput
              value={columnDisplayName}
              onChange={setColumnDisplayName}
              placeholder="Enter display name (e.g., Full Name)"
            />
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
              This is the name shown in reports and visualizations.
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
              Data Source *
            </label>
            <GlassDropdown
              options={mockDataSources.map(ds => ({ value: ds.id, label: ds.name }))}
              value={columnDataSourceId}
              onChange={setColumnDataSourceId}
              placeholder="Select data source"
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
              Formula *
            </label>
            <textarea
              value={columnFormula}
              onChange={(e) => setColumnFormula(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                padding: spacing.md,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                color: colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
              placeholder="Enter formula (e.g., CONCAT(first_name, ' ', last_name))"
            />
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary, marginTop: spacing.xs }}>
              Use SQL functions and column names from the selected data source.
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
              Description
            </label>
            <textarea
              value={columnDescription}
              onChange={(e) => setColumnDescription(e.target.value)}
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
              placeholder="Enter description"
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
              <AlertTriangle size={16} style={{ marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleAddCalculatedColumn}
            >
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Add Column
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Edit Calculated Column Modal */}
      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCalculatedColumn(null);
          resetForm();
        }}
        title="Edit Calculated Column"
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
              Column Name *
            </label>
            <GlassInput
              value={columnName}
              onChange={setColumnName}
              placeholder="Enter column name (e.g., full_name)"
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
              Display Name *
            </label>
            <GlassInput
              value={columnDisplayName}
              onChange={setColumnDisplayName}
              placeholder="Enter display name (e.g., Full Name)"
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
              Data Source *
            </label>
            <GlassDropdown
              options={mockDataSources.map(ds => ({ value: ds.id, label: ds.name }))}
              value={columnDataSourceId}
              onChange={setColumnDataSourceId}
              placeholder="Select data source"
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
              Formula *
            </label>
            <textarea
              value={columnFormula}
              onChange={(e) => setColumnFormula(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                padding: spacing.md,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                color: colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
              placeholder="Enter formula (e.g., CONCAT(first_name, ' ', last_name))"
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
              value={columnDescription}
              onChange={(e) => setColumnDescription(e.target.value)}
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
              placeholder="Enter description"
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
              <AlertTriangle size={16} style={{ marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCalculatedColumn(null);
                resetForm();
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleUpdateCalculatedColumn}
            >
              <Check size={16} style={{ marginRight: spacing.sm }} />
              Update Column
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCalculatedColumn(null);
        }}
        title="Delete Calculated Column"
      >
        {selectedCalculatedColumn && (
          <div style={{ padding: spacing.xl }}>
            <p style={{ fontSize: '1rem', color: colors.text.primary, marginBottom: spacing.xl }}>
              Are you sure you want to delete the calculated column "{selectedCalculatedColumn.displayName}"? This action cannot be undone.
            </p>
            
            <div style={{ 
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.xl,
            }}>
              <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.sm }}>
                <strong>Name:</strong> {selectedCalculatedColumn.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.sm }}>
                <strong>Formula:</strong> {selectedCalculatedColumn.formula}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                <strong>Data Source:</strong> {getDataSourceById(selectedCalculatedColumn.dataSourceId)?.name || 'Unknown'}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton 
                variant="ghost" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedCalculatedColumn(null);
                }}
              >
                Cancel
              </GlassButton>
              <GlassButton 
                variant="error" 
                onClick={confirmDeleteCalculatedColumn}
              >
                <Trash2 size={16} style={{ marginRight: spacing.sm }} />
                Delete Column
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};