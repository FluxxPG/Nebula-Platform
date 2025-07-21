import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Filter, 
  Table, 
  FileText, 
  BarChart2, 
  Code, 
  Eye, 
  Clock,
  Users,
  Calendar,
  Briefcase
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal, GlassDataTable } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockDataSources, getDataSourceById } from '../../data/reportingMockData';
import { DataSource, DataSourceColumn } from '../../types/reporting';

export const DataSourcesPage: React.FC = () => {
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Filter data sources based on search term
  const filteredDataSources = mockDataSources.filter(ds => 
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePreviewDataSource = (dataSourceId: string) => {
    const dataSource = getDataSourceById(dataSourceId);
    if (dataSource) {
      setSelectedDataSource(dataSource);
      setIsPreviewModalOpen(true);
    }
  };
  
  const getDataSourceIcon = (name: string) => {
    if (name === 'Persons') {
      return <Users size={24} style={{ color: 'white' }} />;
    } else if (name === 'Visitors') {
      return <Briefcase size={24} style={{ color: 'white' }} />;
    } else {
      return <Calendar size={24} style={{ color: 'white' }} />;
    }
  };
  
  // Table columns for data preview
  const getPreviewColumns = (dataSource: DataSource) => {
    return dataSource.schema.columns.map(col => ({
      key: col.name,
      label: col.displayName,
      sortable: true,
    }));
  };
  
  // Transform rows for data table
  const getPreviewData = (dataSource: DataSource) => {
    if (!dataSource.schema.rows) return [];
    
    return dataSource.schema.rows.map((row, rowIndex) => {
      const rowData: Record<string, any> = {};
      dataSource.schema.columns.forEach((col, colIndex) => {
        rowData[col.name] = row[colIndex];
      });
      return rowData;
    });
  };

  return (
    <PageLayout
      title="Data Sources"
      subtitle="Explore and manage data sources for reporting and analytics"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost">
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            Filters
          </GlassButton>
          <GlassButton variant="primary">
            <Plus size={18} style={{ marginRight: spacing.sm }} />
            Add Data Source
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
          placeholder="Search data sources..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Data Sources Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: spacing.xl,
      }}>
        {filteredDataSources.map(dataSource => (
          <GlassCard key={dataSource.id} variant="primary" padding="lg" hoverable>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.lg }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: colors.gradients.primary,
                borderRadius: borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getDataSourceIcon(dataSource.name)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
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
                  {dataSource.schema.rows && (
                    <GlassStatusBadge 
                      status="warning" 
                      label={`${dataSource.schema.rows.length} rows`} 
                      size="sm" 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Schema Preview */}
            <div style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              background: colors.glass.secondary,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.border.light}`,
              maxHeight: '150px',
              overflowY: 'auto',
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>
                Schema Preview
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                {dataSource.schema.columns.slice(0, 5).map(column => (
                  <div key={column.id} style={{ display: 'flex', fontSize: '0.75rem' }}>
                    <div style={{ width: '40%', fontWeight: '600', color: colors.text.primary }}>
                      {column.displayName}
                    </div>
                    <div style={{ width: '30%', color: colors.text.secondary }}>
                      {column.type}
                    </div>
                    <div style={{ width: '30%', color: colors.text.secondary }}>
                      {column.isPrimaryKey ? 'Primary Key' : column.isForeignKey ? 'Foreign Key' : ''}
                    </div>
                  </div>
                ))}
                {dataSource.schema.columns.length > 5 && (
                  <div style={{ fontSize: '0.75rem', color: colors.text.secondary, fontStyle: 'italic' }}>
                    ...and {dataSource.schema.columns.length - 5} more columns
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                <Clock size={14} />
                Updated {new Date(dataSource.lastUpdated).toLocaleDateString()}
              </div>
              
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlePreviewDataSource(dataSource.id)}
                >
                  <Eye size={14} style={{ marginRight: spacing.xs }} />
                  Preview
                </GlassButton>
                <GlassButton variant="ghost" size="sm">
                  <Code size={14} style={{ marginRight: spacing.xs }} />
                  SQL Editor
                </GlassButton>
                <GlassButton variant="primary" size="sm">
                  <BarChart2 size={14} style={{ marginRight: spacing.xs }} />
                  Create Report
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Data Preview Modal */}
      <GlassModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={selectedDataSource ? `${selectedDataSource.name} Preview` : 'Data Preview'}
      >
        {selectedDataSource && (
          <div style={{ padding: spacing.lg }}>
            <div style={{ marginBottom: spacing.xl }}>
              <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                {selectedDataSource.description}
              </p>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="info" 
                  label={`${selectedDataSource.schema.columns.length} columns`} 
                  size="sm" 
                />
                <GlassStatusBadge 
                  status="success" 
                  label={selectedDataSource.type} 
                  size="sm" 
                />
                {selectedDataSource.schema.rows && (
                  <GlassStatusBadge 
                    status="warning" 
                    label={`${selectedDataSource.schema.rows.length} rows`} 
                    size="sm" 
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.75rem', color: colors.text.secondary }}>
                  <Clock size={14} />
                  Updated {new Date(selectedDataSource.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Data Table */}
            {selectedDataSource.schema.rows && (
              <GlassDataTable
                columns={getPreviewColumns(selectedDataSource)}
                data={getPreviewData(selectedDataSource)}
                pagination={true}
                pageSize={10}
                searchable={true}
                showPageSizeSelector={true}
              />
            )}
            
            <div style={{ marginTop: spacing.xl, display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton variant="ghost" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </GlassButton>
              <GlassButton variant="primary">
                <BarChart2 size={16} style={{ marginRight: spacing.sm }} />
                Create Report
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};