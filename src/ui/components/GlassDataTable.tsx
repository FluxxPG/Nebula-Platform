import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, Eye, EyeOff, ChevronDown, X } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { GlassButton } from './GlassButton';
import { GlassInput } from './GlassInput';
import { GlassDropdown } from './GlassDropdown';
import { GlassStatusBadge } from './GlassStatusBadge';
import { GlassPaginationControl } from './GlassPaginationControl';
import { GlassModal } from './GlassModal';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  visible?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface GlassDataTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  showPageSizeSelector?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onExport?: (data: any[]) => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  // New props for preview functionality
  showPreview?: boolean;
  renderPreview?: (row: any) => React.ReactNode;
  previewTitle?: string;
}

export const GlassDataTable: React.FC<GlassDataTableProps> = ({
  data,
  columns: initialColumns,
  onRowClick,
  searchable = true,
  filterable = true,
  pagination = true,
  pageSize: initialPageSize = 10,
  showPageSizeSelector = true,
  showColumnToggle = true,
  showExport = false, // Disabled by default - handled by pagination control
  showRefresh = false, // Disabled by default - handled by pagination control
  onRefresh,
  onExport,
  className = '',
  loading = false,
  emptyMessage = 'No data available',
  // New props for preview functionality
  showPreview = false,
  renderPreview,
  previewTitle = 'Preview',
}) => {
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialColumns.filter(col => col.visible !== false).map(col => col.key)
  );
  // New state for preview functionality
  const [previewRow, setPreviewRow] = useState<any | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort data
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        
        return String(aVal).localeCompare(String(bVal)) * modifier;
      });
    }

    return result;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, processedData.length);
  const paginatedData = pagination ? processedData.slice(startIndex, endIndex) : processedData;

  // Visible columns
  const visibleColumnsData = initialColumns.filter(col => visibleColumns.includes(col.key));

  // Column data for pagination control
  const columnData = initialColumns.map(col => ({
    key: col.key,
    label: col.label,
    visible: visibleColumns.includes(col.key),
  }));

  const containerStyles: React.CSSProperties = {
    width: '100%',
    background: colors.glass.primary,
    border: 'none',
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    overflow: 'hidden',
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap',
  };

  const controlsLeftStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
    flex: 1,
    minWidth: '300px',
  };

  const controlsRightStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    flexShrink: 0,
  };

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: colors.text.primary,
    borderBottom: 'none',
    background: colors.glass.secondary,
    cursor: 'pointer',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    position: 'relative',
  };

  const tdStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    fontSize: '0.875rem',
    color: colors.text.primary,
    borderBottom: 'none',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const rowStyles: React.CSSProperties = {
    cursor: onRowClick ? 'pointer' : 'default',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const loadingOverlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  const emptyStateStyles: React.CSSProperties = {
    padding: spacing['3xl'],
    textAlign: 'center',
    color: colors.text.secondary,
  };

  // New styles for action column
  const actionColumnStyles: React.CSSProperties = {
    width: '80px',
    textAlign: 'center',
  };

  const handleSort = (columnKey: string) => {
    const column = initialColumns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const toggleColumnVisibility = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => 
      visible
        ? [...prev, columnKey]
        : prev.filter(key => key !== columnKey)
    );
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
    onRefresh?.();
  };

  const handleExport = () => {
    onExport?.(processedData);
  };

  // New handlers for preview functionality
  const handlePreviewClick = (row: any, e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent row click
    }
    setPreviewRow(row);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewRow(null);
  };

  return (
    <>
      <style>
        {`
          .data-table-container {
            position: relative;
          }
          
          .table-row:hover {
            background: ${colors.glass.secondary} !important;
          }
          
          .table-header:hover {
            background: ${colors.glass.primary} !important;
          }
          
          .sort-indicator {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.75rem;
            color: ${colors.text.secondary};
          }
          
          .preview-button {
            opacity: 0.7;
            transition: all 0.2s ease;
          }
          
          .preview-button:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          
          .table-row:hover .preview-button {
            opacity: 1;
          }
          
          @media (max-width: 768px) {
            .table-controls {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: ${spacing.lg} !important;
            }
            
            .controls-left {
              min-width: auto !important;
            }
            
            .controls-right {
              justify-content: center !important;
            }
            
            .table-wrapper {
              overflow-x: auto !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            
            .table-wrapper::-webkit-scrollbar {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div style={containerStyles} className={`data-table-container ${className}`}>
        {/* Simplified Header with only search and basic controls */}
        {(searchable || filterable) && (
          <div style={headerStyles} className="table-controls">
            <div style={controlsLeftStyles} className="controls-left">
              {searchable && (
                <div style={{ minWidth: '300px', flex: 1 }}>
                  <GlassInput
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
              )}
            </div>
            
            <div style={controlsRightStyles} className="controls-right">
              {filterable && (
                <GlassButton variant="ghost" size="sm">
                  <Filter size={16} />
                </GlassButton>
              )}
              
              <GlassButton variant="ghost" size="sm">
                <MoreVertical size={16} />
              </GlassButton>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ 
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }} className="table-wrapper">
          <table style={tableStyles}>
            <thead>
              <tr>
                {visibleColumnsData.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      ...thStyles,
                      width: column.width,
                      cursor: column.sortable ? 'pointer' : 'default',
                    }}
                    onClick={() => column.sortable && handleSort(column.key)}
                    className="table-header"
                  >
                    {column.label}
                    {column.sortable && (
                      <span className="sort-indicator">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </th>
                ))}
                {/* Add preview column if showPreview is true */}
                {showPreview && renderPreview && (
                  <th style={{...thStyles, ...actionColumnStyles}}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleColumnsData.length + (showPreview ? 1 : 0)} style={{ padding: 0, position: 'relative', height: '200px' }}>
                    <div style={loadingOverlayStyles}>
                      <GlassStatusBadge status="info" label="Loading..." />
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumnsData.length + (showPreview ? 1 : 0)} style={emptyStateStyles}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    style={rowStyles}
                    onClick={() => onRowClick?.(row)}
                    className="table-row"
                  >
                    {visibleColumnsData.map((column) => (
                      <td key={column.key} style={tdStyles}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </td>
                    ))}
                    {/* Add preview button if showPreview is true */}
                    {showPreview && renderPreview && (
                      <td style={{...tdStyles, ...actionColumnStyles}}>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handlePreviewClick(row, e)}
                          className="preview-button"
                        >
                          <Eye size={16} />
                        </GlassButton>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination with All Controls - ALWAYS SHOW when pagination is enabled */}
        {pagination && !loading && (
          <GlassPaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={processedData.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={showPageSizeSelector}
            showColumnSelector={showColumnToggle}
            showRefresh={true}
            showExport={true}
            onRefresh={handleRefresh}
            onExport={handleExport}
            columns={columnData}
            onColumnVisibilityChange={toggleColumnVisibility}
          />
        )}

        {/* Preview Modal */}
        {showPreview && renderPreview && (
          <GlassModal
            isOpen={isPreviewModalOpen}
            onClose={closePreviewModal}
            title={previewTitle}
          >
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {previewRow && renderPreview(previewRow)}
            </div>
          </GlassModal>
        )}
      </div>
    </>
  );
};