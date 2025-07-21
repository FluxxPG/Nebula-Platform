import { useState } from 'react';
import { colors } from '../tokens/colors'
import { borderRadius, shadows, spacing } from '../tokens/spacing'
import { useThemeColors } from '../hooks/useThemeColors';
import { animations } from '../tokens/animations';
import { GlassButton, GlassModal, GlassPaginationControl, GlassStatusBadge } from '..';
import { Eye } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    visible?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

interface GlassListDataTableProps {
    data?: any[];
    className?: string;
    columns: Column[];
    onRowClick?: (row: any) => void;
    showPreview?: boolean;
    showColumnToggle?: boolean;
    loading?: boolean;
    renderPreview?: (row: any) => React.ReactNode;
    emptyMessage?: string;
    pagination?: boolean;
    previewTitle?: string;
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalRows?: number;
    showPageSizeSelector?: boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (newSize: number) => void;
    onReset?: () => void;
    onExport?: () => void;
}

const GlassListDataTable: React.FC<GlassListDataTableProps> = ({
    data,
    className,
    columns: initialColumns,
    onRowClick,
    showPreview = false,
    loading,
    emptyMessage = 'No data available',
    renderPreview,
    pagination = false,
    previewTitle = 'Preview',
    currentPage = 1,
    totalPages = 0,
    pageSize = 10,
    totalRows = 0,
    showPageSizeSelector = true,
    showColumnToggle = true,
    onExport,
    onPageChange,
    onReset,
    onPageSizeChange
}) => {
    const colors = useThemeColors();
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [previewRow, setPreviewRow] = useState<any | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        initialColumns.filter(col => col.visible !== false).map(col => col.key)
    );

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

    const actionColumnStyles: React.CSSProperties = {
        width: '80px',
        textAlign: 'center',
    };

    const visibleColumnsData = initialColumns.filter(col => visibleColumns.includes(col.key));


    const handleSort = (columnKey: string) => {
        const column = initialColumns.find(col => col.key === columnKey);
        if (!column?.sortable) return;

        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const handlePreviewClick = (row: any, e: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setPreviewRow(row);
        setIsPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewRow(null);
    };

    const columnData = initialColumns.map(col => ({
        key: col.key,
        label: col.label,
        visible: visibleColumns.includes(col.key),
    }));

    const toggleColumnVisibility = (columnKey: string, visible: boolean) => {
        setVisibleColumns(prev =>
            visible
                ? [...prev, columnKey]
                : prev.filter(key => key !== columnKey)
        );
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    }

    const handlePageSizeChange = (newSize: number) => {
        if (onPageSizeChange) {
            onPageSizeChange(newSize);
        }
    }

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

                {/* Table */}
                <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="table-wrapper">
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
                                    <th style={{ ...thStyles, ...actionColumnStyles }}>
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
                            ) : data?.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumnsData.length + (showPreview ? 1 : 0)} style={emptyStateStyles}>
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data?.map((row, index) => (
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
                                            <td style={{ ...tdStyles, ...actionColumnStyles }}>
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
                        totalItems={totalRows}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        showPageSizeSelector={showPageSizeSelector}
                        showColumnSelector={showColumnToggle}
                        showRefresh={true}
                        showExport={true}
                        onRefresh={onReset}
                        onExport={onExport}
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
    )
}

export default GlassListDataTable