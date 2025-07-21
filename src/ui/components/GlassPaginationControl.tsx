import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns, Eye, EyeOff, RotateCcw, Download } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { GlassButton } from './GlassButton';
import { GlassModal } from './GlassModal';
import { GlassStatusBadge } from './GlassStatusBadge';

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface GlassPaginationControlProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPageSizeSelector?: boolean;
  showColumnSelector?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  columns?: Column[];
  onColumnVisibilityChange?: (columnKey: string, visible: boolean) => void;
  className?: string;
}

export const GlassPaginationControl: React.FC<GlassPaginationControlProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showColumnSelector = false,
  showRefresh = false,
  showExport = false,
  onRefresh,
  onExport,
  columns = [],
  onColumnVisibilityChange,
  className = '',
}) => {
  const colors = useThemeColors();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  const pageSizeOptions = [5, 10, 25, 50, 100];
  const visibleColumnsCount = columns.filter(col => col.visible).length;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    borderTop: `1px solid ${colors.border.light}`,
    flexWrap: 'wrap',
    background: colors.glass.secondary,
  };

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  };

  const infoStyles: React.CSSProperties = {
    color: colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  };

  const centerSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
  };

  const rightSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const pageSizeSelectorStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  };

  const pageSizeButtonStyles = (size: number, isActive: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    background: isActive ? colors.gradients.primary : 'transparent',
    color: isActive ? colors.text.primary : colors.text.secondary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    minWidth: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const paginationControlsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
  };

  const actionButtonsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    borderLeft: `1px solid ${colors.border.light}`,
    paddingLeft: spacing.md,
    marginLeft: spacing.md,
  };

  const columnBadgeStyles: React.CSSProperties = {
    position: 'relative',
  };

  const columnCountStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: colors.gradients.accent,
    color: colors.text.primary,
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: borderRadius.full,
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.soft,
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show 5 page numbers at most
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis and first/last pages if needed
      if (start > 1) {
        if (start > 2) {
          pages.unshift('...');
        }
        pages.unshift(1);
      }
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    onColumnVisibilityChange?.(columnKey, visible);
  };

  const handlePageJump = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <>
      <style>
        {`
          .page-size-button:hover {
            background: ${colors.glass.secondary} !important;
            color: ${colors.text.primary} !important;
          }
          
          .pagination-button {
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }
          
          .pagination-button.active {
            background: ${colors.gradients.primary} !important;
            color: ${colors.text.primary} !important;
            box-shadow: ${shadows.glass} !important;
          }
          
          .pagination-button.ellipsis {
            cursor: default !important;
            opacity: 0.6;
          }
          
          .pagination-button.ellipsis:hover {
            background: transparent !important;
            transform: none !important;
          }
          
          .column-item {
            transition: background ${animations.duration.fast} ${animations.easing.smooth};
          }
          
          .column-item:hover {
            background: ${colors.glass.primary} !important;
          }
          
          @media (max-width: 1024px) {
            .pagination-container {
              flex-direction: column !important;
              gap: ${spacing.lg} !important;
              text-align: center !important;
            }
            
            .left-section {
              flex-direction: column !important;
              gap: ${spacing.md} !important;
              align-items: center !important;
            }
            
            .center-section {
              order: 3 !important;
            }
            
            .right-section {
              order: 2 !important;
              border-left: none !important;
              border-top: 1px solid ${colors.border.light} !important;
              padding-left: 0 !important;
              padding-top: ${spacing.md} !important;
              margin-left: 0 !important;
              margin-top: ${spacing.md} !important;
            }
            
            .pagination-controls {
              justify-content: center !important;
            }
            
            .page-size-selector {
              justify-content: center !important;
            }
          }
          
          @media (max-width: 640px) {
            .pagination-controls {
              flex-wrap: wrap !important;
              justify-content: center !important;
            }
            
            .pagination-button {
              min-width: 36px !important;
              height: 36px !important;
              font-size: 0.875rem !important;
            }
            
            .page-size-selector {
              flex-wrap: wrap !important;
            }
            
            .left-section {
              gap: ${spacing.sm} !important;
            }
            
            .info-text {
              font-size: 0.75rem !important;
            }
          }
        `}
      </style>
      
      <div style={containerStyles} className={`pagination-container ${className}`}>
        {/* Left Section - Results Info */}
        <div style={leftSectionStyles} className="left-section">
          <div style={infoStyles} className="info-text">
            Showing <strong>{startIndex.toLocaleString()}</strong> to <strong>{endIndex.toLocaleString()}</strong> of <strong>{totalItems.toLocaleString()}</strong> results
          </div>

          {/* Page Size Selector */}
          {showPageSizeSelector && (
            <div style={pageSizeSelectorStyles} className="page-size-selector">
              <span style={{ 
                fontSize: '0.875rem', 
                color: colors.text.secondary,
                marginRight: spacing.xs,
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}>
                Show:
              </span>
              {pageSizeOptions.map((size) => (
                <button
                  key={size}
                  style={pageSizeButtonStyles(size, size === pageSize)}
                  onClick={() => onPageSizeChange(size)}
                  className="page-size-button"
                  title={`Show ${size} items per page`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Section - Pagination Controls */}
        <div style={centerSectionStyles} className="center-section">
          <div style={paginationControlsStyles} className="pagination-controls">
            {/* First page */}
            <GlassButton
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
              className="pagination-button"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </GlassButton>
            
            {/* Previous page */}
            <GlassButton
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="pagination-button"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </GlassButton>
            
            {/* Page numbers with ellipsis */}
            {getPageNumbers().map((pageNum, index) => (
              <GlassButton
                key={`${pageNum}-${index}`}
                variant={pageNum === currentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => handlePageJump(pageNum)}
                className={`pagination-button ${pageNum === currentPage ? 'active' : ''} ${pageNum === '...' ? 'ellipsis' : ''}`}
                disabled={pageNum === '...'}
                title={pageNum === '...' ? 'More pages' : `Go to page ${pageNum}`}
              >
                {pageNum}
              </GlassButton>
            ))}
            
            {/* Next page */}
            <GlassButton
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="pagination-button"
              title="Next page"
            >
              <ChevronRight size={16} />
            </GlassButton>
            
            {/* Last page */}
            <GlassButton
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className="pagination-button"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </GlassButton>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div style={rightSectionStyles} className="right-section">
          {showRefresh && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              title="Refresh data"
            >
              <RotateCcw size={16} />
            </GlassButton>
          )}
          
          {showExport && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onExport}
              title="Export data"
            >
              <Download size={16} />
            </GlassButton>
          )}

          {/* Column Selector */}
          {showColumnSelector && columns.length > 0 && (
            <div style={columnBadgeStyles}>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setIsColumnModalOpen(true)}
                title="Manage columns"
              >
                <Columns size={16} />
              </GlassButton>
              <div style={columnCountStyles}>
                {visibleColumnsCount}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column Selection Modal */}
      <GlassModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title="Manage Table Columns"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <p style={{ 
            color: colors.text.secondary, 
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.5',
          }}>
            Select which columns to display in the table. You can show or hide columns to customize your view and improve readability.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.md,
            background: colors.glass.secondary,
            borderRadius: borderRadius.md,
            border: 'none',
          }}>
            <span style={{ 
              color: colors.text.primary, 
              fontSize: '0.875rem',
              fontWeight: '600',
            }}>
              {visibleColumnsCount} of {columns.length} columns visible
            </span>
            <GlassStatusBadge
              status={visibleColumnsCount === columns.length ? 'success' : 'warning'}
              label={visibleColumnsCount === columns.length ? 'All visible' : 'Some hidden'}
              size="sm"
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, maxHeight: '400px', overflowY: 'auto' }}>
            {columns.map((column) => (
              <label
                key={column.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  cursor: 'pointer',
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  background: colors.glass.secondary,
                  border: 'none',
                  transition: `background ${animations.duration.fast}`,
                }}
                className="column-item"
              >
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={(e) => handleColumnToggle(column.key, e.target.checked)}
                  style={{ 
                    margin: 0,
                    width: '18px',
                    height: '18px',
                    accentColor: colors.text.primary,
                  }}
                />
                
                <div style={{ 
                  color: column.visible ? colors.text.primary : colors.text.secondary,
                  marginRight: spacing.sm,
                }}>
                  {column.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
                
                <span style={{ 
                  color: colors.text.primary, 
                  fontSize: '0.875rem',
                  flex: 1,
                  fontWeight: '500',
                }}>
                  {column.label}
                </span>
                
                <GlassStatusBadge
                  status={column.visible ? 'success' : 'inactive'}
                  label={column.visible ? 'Visible' : 'Hidden'}
                  size="sm"
                />
              </label>
            ))}
          </div>
          
          <div style={{ 
            paddingTop: spacing.lg, 
            borderTop: `1px solid ${colors.border.light}`,
            display: 'flex',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <GlassButton
                variant="ghost"
                size="md"
                onClick={() => {
                  // Show all columns
                  columns.forEach(col => handleColumnToggle(col.key, true));
                }}
              >
                Show All
              </GlassButton>
              
              <GlassButton
                variant="ghost"
                size="md"
                onClick={() => {
                  // Hide all but first column
                  columns.forEach((col, index) => handleColumnToggle(col.key, index === 0));
                }}
              >
                Reset
              </GlassButton>
            </div>
            
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setIsColumnModalOpen(false)}
            >
              Apply Changes
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </>
  );
};