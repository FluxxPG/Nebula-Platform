import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  Copy, 
  Trash2, 
  Database,
  Table,
  FileText,
  Clock,
  AlertTriangle,
  Check,
  HelpCircle
} from 'lucide-react';
import { PageLayout } from '../../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal, GlassDataTable, GlassDropdown } from '../../ui/components';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';
import { mockDataSources, getDataSourceById, executeSQL } from '../../data/reportingMockData';
import { format } from 'sql-formatter';

export const SQLEditorPage: React.FC = () => {
  const colors = useThemeColors();
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>(mockDataSources[0]?.id || '');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryName, setQueryName] = useState<string>('');
  const [queryDescription, setQueryDescription] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  
  // Sample queries for different data sources
  const sampleQueries: Record<string, string> = {
    'ds-001': `SELECT 
  department, 
  COUNT(*) as user_count,
  AVG(DATEDIFF('day', join_date, CURRENT_DATE)) as avg_tenure_days
FROM 
  persons
WHERE 
  status = 'active'
GROUP BY 
  department
ORDER BY 
  user_count DESC`,
    'ds-002': `SELECT 
  DATE_TRUNC('day', check_in_time) as check_in_date,
  COUNT(*) as visitor_count,
  COUNT(DISTINCT company) as unique_companies
FROM 
  visitors
WHERE 
  check_in_time >= '2024-01-01'
GROUP BY 
  check_in_date
ORDER BY 
  check_in_date`,
    'ds-003': `SELECT 
  room,
  COUNT(*) as meeting_count,
  SUM(attendee_count) as total_attendees,
  AVG(DATEDIFF('minute', start_time, end_time)) as avg_duration_minutes
FROM 
  meetings
WHERE 
  start_time >= '2024-01-01'
GROUP BY 
  room
ORDER BY 
  meeting_count DESC`
  };
  
  // Update SQL query when data source changes
  useEffect(() => {
    if (selectedDataSourceId && sampleQueries[selectedDataSourceId]) {
      setSqlQuery(sampleQueries[selectedDataSourceId]);
    }
  }, [selectedDataSourceId]);
  
  const handleDataSourceChange = (dataSourceId: string) => {
    setSelectedDataSourceId(dataSourceId);
    setQueryResults(null);
    setError(null);
  };
  
  const handleExecuteQuery = () => {
    if (!sqlQuery.trim()) {
      setError('SQL query cannot be empty');
      return;
    }
    
    setIsExecuting(true);
    setError(null);
    
    try {
      // In a real app, this would send the query to the server
      // For now, we'll use our mock function
      setTimeout(() => {
        try {
          const results = executeSQL(sqlQuery, selectedDataSourceId);
          setQueryResults(results);
          setIsExecuting(false);
        } catch (err) {
          setError('Error executing query: ' + (err instanceof Error ? err.message : String(err)));
          setIsExecuting(false);
        }
      }, 1000); // Simulate network delay
    } catch (err) {
      setError('Error executing query: ' + (err instanceof Error ? err.message : String(err)));
      setIsExecuting(false);
    }
  };
  
  const handleFormatQuery = () => {
    try {
      const formattedQuery = format(sqlQuery, {
        language: 'postgresql',
        keywordCase: 'upper',
        indentStyle: 'standard',
        logicalOperatorNewline: 'before',
      });
      setSqlQuery(formattedQuery);
    } catch (err) {
      setError('Error formatting query: ' + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  const handleSaveQuery = () => {
    if (!queryName.trim()) {
      setError('Query name cannot be empty');
      return;
    }
    
    // In a real app, this would save the query to the server
    // For now, we'll just close the modal
    setIsSaveModalOpen(false);
    
    // Reset form
    setQueryName('');
    setQueryDescription('');
  };
  
  const handleCopyQuery = () => {
    navigator.clipboard.writeText(sqlQuery)
      .then(() => {
        // Show success message (in a real app)
      })
      .catch(err => {
        setError('Error copying query: ' + (err instanceof Error ? err.message : String(err)));
      });
  };
  
  const getTableColumns = () => {
    if (!queryResults || queryResults.length === 0) return [];
    
    const firstRow = queryResults[0];
    return Object.keys(firstRow).map(key => ({
      key,
      label: key,
      sortable: true,
    }));
  };

  return (
    <PageLayout
      title="SQL Editor"
      subtitle="Write and execute custom SQL queries for advanced reporting and analysis"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton 
            variant="ghost"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle size={18} style={{ marginRight: spacing.sm }} />
            Help
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => setIsSaveModalOpen(true)}
            disabled={!sqlQuery.trim()}
          >
            <Save size={18} style={{ marginRight: spacing.sm }} />
            Save Query
          </GlassButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Data Source Selector */}
        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
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
              <Database size={24} style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm }}>
                Select Data Source
              </h3>
              <GlassDropdown
                options={mockDataSources.map(ds => ({ value: ds.id, label: ds.name }))}
                value={selectedDataSourceId}
                onChange={handleDataSourceChange}
                placeholder="Select a data source"
              />
            </div>
          </div>
        </GlassCard>
        
        {/* SQL Editor */}
        <GlassCard variant="primary" padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary }}>
              SQL Query
            </h3>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <GlassButton 
                variant="ghost" 
                size="sm"
                onClick={handleFormatQuery}
                disabled={!sqlQuery.trim()}
              >
                <Code size={14} style={{ marginRight: spacing.xs }} />
                Format
              </GlassButton>
              <GlassButton 
                variant="ghost" 
                size="sm"
                onClick={handleCopyQuery}
                disabled={!sqlQuery.trim()}
              >
                <Copy size={14} style={{ marginRight: spacing.xs }} />
                Copy
              </GlassButton>
              <GlassButton 
                variant="ghost" 
                size="sm"
                onClick={() => setSqlQuery('')}
                disabled={!sqlQuery.trim()}
              >
                <Trash2 size={14} style={{ marginRight: spacing.xs }} />
                Clear
              </GlassButton>
            </div>
          </div>
          
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            style={{
              width: '100%',
              height: '300px',
              padding: spacing.lg,
              background: colors.glass.secondary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.lg,
              color: colors.text.primary,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              resize: 'vertical',
            }}
            placeholder="Enter your SQL query here..."
          />
          
          {error && (
            <div style={{
              marginTop: spacing.md,
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
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.lg }}>
            <GlassButton 
              variant="primary"
              onClick={handleExecuteQuery}
              loading={isExecuting}
              disabled={!sqlQuery.trim()}
            >
              <Play size={16} style={{ marginRight: spacing.sm }} />
              Execute Query
            </GlassButton>
          </div>
        </GlassCard>
        
        {/* Query Results */}
        {queryResults && (
          <GlassCard variant="primary" padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary }}>
                Query Results
              </h3>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <GlassStatusBadge 
                  status="success" 
                  label={`${queryResults.length} rows`} 
                  size="sm" 
                />
                <GlassStatusBadge 
                  status="info" 
                  label={`${Object.keys(queryResults[0] || {}).length} columns`} 
                  size="sm" 
                />
                <GlassButton variant="ghost" size="sm">
                  <Download size={14} style={{ marginRight: spacing.xs }} />
                  Export
                </GlassButton>
              </div>
            </div>
            
            <GlassDataTable
              columns={getTableColumns()}
              data={queryResults}
              pagination={true}
              pageSize={10}
              searchable={true}
              showPageSizeSelector={true}
            />
          </GlassCard>
        )}
      </div>

      {/* Save Query Modal */}
      <GlassModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save SQL Query"
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
              Query Name *
            </label>
            <GlassInput
              value={queryName}
              onChange={setQueryName}
              placeholder="Enter a name for your query"
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
              value={queryDescription}
              onChange={(e) => setQueryDescription(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                padding: spacing.md,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.lg,
                color: colors.text.primary,
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
              placeholder="Enter a description for your query"
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
              Data Source
            </label>
            <GlassDropdown
              options={mockDataSources.map(ds => ({ value: ds.id, label: ds.name }))}
              value={selectedDataSourceId}
              onChange={setSelectedDataSourceId}
              placeholder="Select a data source"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton variant="ghost" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton 
              variant="primary" 
              onClick={handleSaveQuery}
              disabled={!queryName.trim()}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Save Query
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Help Modal */}
      <GlassModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="SQL Editor Help"
      >
        <div style={{ padding: spacing.xl }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
            Getting Started
          </h3>
          <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.lg, lineHeight: '1.6' }}>
            The SQL Editor allows you to write and execute custom SQL queries against your data sources. 
            Follow these steps to get started:
          </p>
          
          <ol style={{ marginBottom: spacing.xl, paddingLeft: spacing.xl }}>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Select a data source from the dropdown menu.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Write your SQL query in the editor. You can use the Format button to format your query.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Click "Execute Query" to run your query and see the results.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Save your query for future use by clicking the "Save Query" button.
            </li>
          </ol>
          
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
            Available Data Sources
          </h3>
          
          <div style={{ marginBottom: spacing.xl }}>
            {mockDataSources.map(ds => (
              <div key={ds.id} style={{
                marginBottom: spacing.md,
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.border.light}`,
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  {ds.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: colors.text.secondary, marginBottom: spacing.sm }}>
                  {ds.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                  <strong>Schema:</strong> {ds.schema.columns.slice(0, 3).map(col => col.name).join(', ')}
                  {ds.schema.columns.length > 3 && ', ...'}
                </div>
              </div>
            ))}
          </div>
          
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md }}>
            SQL Tips
          </h3>
          
          <ul style={{ marginBottom: spacing.xl, paddingLeft: spacing.xl }}>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Use <code style={{ background: colors.glass.secondary, padding: '2px 4px', borderRadius: '4px' }}>SELECT</code> to retrieve data from tables.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Use <code style={{ background: colors.glass.secondary, padding: '2px 4px', borderRadius: '4px' }}>WHERE</code> to filter data based on conditions.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Use <code style={{ background: colors.glass.secondary, padding: '2px 4px', borderRadius: '4px' }}>GROUP BY</code> to group data for aggregation.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Use <code style={{ background: colors.glass.secondary, padding: '2px 4px', borderRadius: '4px' }}>ORDER BY</code> to sort results.
            </li>
            <li style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: '1.6' }}>
              Use <code style={{ background: colors.glass.secondary, padding: '2px 4px', borderRadius: '4px' }}>LIMIT</code> to restrict the number of results.
            </li>
          </ul>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <GlassButton variant="primary" onClick={() => setIsHelpModalOpen(false)}>
              <Check size={16} style={{ marginRight: spacing.sm }} />
              Got It
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </PageLayout>
  );
};