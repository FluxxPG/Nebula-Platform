import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, List, Filter, SortAsc, SortDesc, Search, RefreshCw, Download, Settings, X, Check, ChevronDown, Eye } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';
import { GlassButton } from './GlassButton';
import { GlassInput } from './GlassInput';
import { GlassDropdown } from './GlassDropdown';
import { GlassStatusBadge } from './GlassStatusBadge';
import { GlassModal } from './GlassModal';
import { DocumentNode, useQuery } from '@apollo/client';

export type ViewMode = 'grid' | 'list' | 'card';
export type SortOrder = 'asc' | 'desc';

interface SortOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface GlassListControlProps {
  // View controls
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Sorting
  sortBy?: string;
  sortOrder?: SortOrder;
  onSortChange?: (sortBy: string, order: SortOrder) => void;
  sortOptions?: SortOption[];
  showSort?: boolean;

  // Filtering
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  filterOptions?: FilterOption[];
  showFilter?: boolean;

  // Actions
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  showRefresh?: boolean;
  showExport?: boolean;
  showSettings?: boolean;
  loading?: boolean;

  // Status
  totalItems?: number;
  filteredItems?: number;

  // New preview functionality
  showPreview?: boolean;
  onPreviewItem?: (item: any) => void;
  selectedItem?: any;

  className?: string;
}

export const GlassListControl: React.FC<GlassListControlProps> = ({
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = true,

  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showSearch = true,

  sortBy,
  sortOrder = 'asc',
  onSortChange,
  sortOptions = [],
  showSort = true,

  activeFilters = [],
  onFilterChange,
  filterOptions = [],
  showFilter = true,

  onRefresh,
  onExport,
  onSettings,
  showRefresh = true,
  showExport = true,
  showSettings = true,
  loading,

  totalItems = 0,
  filteredItems,

  // New preview functionality
  showPreview = false,
  onPreviewItem,
  selectedItem,

  className = ''

}) => {
  const colors = useThemeColors();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [searchDebounceTimeout, setSearchDebounceTimeout] = useState<any | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Update local search value when prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchValue(value);

    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    const timeout = setTimeout(() => {
      onSearchChange?.(value);
    }, 300); // 300ms debounce

    setSearchDebounceTimeout(timeout);
  }, [onSearchChange, searchDebounceTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }
    };
  }, [searchDebounceTimeout]);

  // Memoized filter counts
  const filterOptionsWithCounts = useMemo(() => {
    return filterOptions.map(option => ({
      ...option,
      isActive: activeFilters.includes(option.value)
    }));
  }, [filterOptions, activeFilters]);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    padding: spacing.xl,
    background: colors.glass.primary,
    border: 'none',
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1, // Ensure it stays below modals
  };

  const leftControlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: '300px',
  };

  const rightControlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  };

  const statusStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    color: colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: '500',
  };

  const viewToggleStyles: React.CSSProperties = {
    display: 'flex',
    background: colors.glass.secondary,
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    gap: spacing.xs,
  };

  const viewButtonStyles = (mode: ViewMode, isActive: boolean): React.CSSProperties => ({
    padding: `${spacing.sm} ${spacing.md}`,
    background: isActive ? colors.gradients.primary : 'transparent',
    color: isActive ? 'white' : colors.text.secondary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
    height: '36px',
    fontWeight: '600',
  });

  const filterBadgeStyles: React.CSSProperties = {
    position: 'relative',
  };

  const filterCountStyles: React.CSSProperties = {
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

  const handleViewModeChange = (mode: ViewMode) => {
    onViewModeChange?.(mode);
  };

  const handleSortToggle = () => {
    if (sortBy && onSortChange) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      onSortChange(sortBy, newOrder);
    }
  };

  const handleSortByChange = (newSortBy: string) => {
    if (onSortChange) {
      onSortChange(newSortBy, sortOrder);
    }
  };

  const displayedItems = filteredItems !== undefined ? filteredItems : totalItems;

  // Filter chip styles
  const filterChipStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.glass.secondary,
    borderRadius: borderRadius.md,
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.text.primary,
    border: `1px solid ${colors.border.light}`,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  // Toggle preview mode
  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Handle preview item click
  const handlePreviewClick = (item: any, e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent other click handlers
    }
    setPreviewItem(item);
    setIsPreviewModalOpen(true);
    onPreviewItem?.(item);
  };

  // Close preview modal
  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewItem(null);
  };

  // Render active filter chips
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.sm,
      }}>
        {activeFilters.map(filter => {
          const filterOption = filterOptions.find(opt => opt.value === filter);
          return (
            <div key={filter} style={filterChipStyles}>
              {filterOption?.label || filter}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newFilters = activeFilters.filter(f => f !== filter);
                  onFilterChange?.(newFilters);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  color: colors.text.secondary,
                }}
                title={`Remove ${filterOption?.label || filter} filter`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        {activeFilters.length > 0 && (
          <button
            onClick={() => onFilterChange?.([])}
            style={{
              ...filterChipStyles,
              background: colors.glass.primary,
              cursor: 'pointer',
            }}
            title="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .list-control-container {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
            position: relative;
            z-index: 1;
          }
          
          /* Ensure the container doesn't get darkened by modal overlays */
          .list-control-container:not(.modal-open) {
            background: ${colors.glass.primary} !important;
            opacity: 1 !important;
          }
          
          .view-button:hover {
            background: ${colors.glass.primary} !important;
            color: ${colors.text.primary} !important;
          }
          
          .filter-item {
            transition: background ${animations.duration.fast} ${animations.easing.smooth};
          }
          
          .filter-item:hover {
            background: ${colors.glass.primary} !important;
          }
          
          .filter-chip:hover {
            background: ${colors.glass.primary} !important;
            transform: translateY(-1px) !important;
          }
          
          .filter-chip-clear:hover {
            background: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
          }
          
          .search-input {
            transition: all ${animations.duration.normal} ${animations.easing.smooth};
          }
          
          .search-input:focus {
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .preview-button {
            position: relative;
          }
          
          .preview-button.active {
            background: ${colors.gradients.primary} !important;
            color: white !important;
          }
          
          .preview-button:hover {
            transform: translateY(-1px) !important;
          }
          
          @media (max-width: 1023px) {
            .list-control-container {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: ${spacing.lg} !important;
            }
            
            .left-controls {
              min-width: auto !important;
            }
            
            .right-controls {
              justify-content: center !important;
            }
            
            .status-info {
              justify-content: center !important;
              text-align: center !important;
            }
          }
          
          @media (max-width: 480px) {
            .view-toggle {
              width: 100% !important;
              justify-content: center !important;
            }
            
            .right-controls {
              gap: ${spacing.xs} !important;
            }
          }
        `}
      </style>

      <div
        style={containerStyles}
        className={`list-control-container ${isFilterModalOpen ? 'modal-open' : ''} ${className}`}
      >
        {/* Left Controls */}
        <div style={leftControlsStyles} className="left-controls">
          {showSearch && (
            <div style={{ flex: 1, minWidth: '250px' }}>
              <GlassInput
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={handleSearchChange}
                className="search-input"
              />

              {/* Active Filter Chips */}
              {renderActiveFilters()}
            </div>
          )}

          {showViewToggle && (
            <div style={viewToggleStyles} className="view-toggle">
              <button
                style={viewButtonStyles('grid', viewMode === 'grid')}
                onClick={() => handleViewModeChange('grid')}
                className="view-button"
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                style={viewButtonStyles('list', viewMode === 'list')}
                onClick={() => handleViewModeChange('list')}
                className="view-button"
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          )}

          {/* Status Info */}
          <div style={statusStyles} className="status-info">
            {loading ? (
              <GlassStatusBadge status="info" label="Loading..." size="sm" />
            ) : (
              <>
                <span>{displayedItems.toLocaleString()} items</span>
                {filteredItems !== undefined && filteredItems !== totalItems && (
                  <span>(filtered from {totalItems.toLocaleString()})</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div style={rightControlsStyles} className="right-controls">
          {/* Preview Toggle Button */}
          {showPreview && onPreviewItem && (
            <GlassButton
              variant={isPreviewMode ? "primary" : "ghost"}
              size="sm"
              onClick={handleTogglePreview}
              className={`preview-button ${isPreviewMode ? 'active' : ''}`}
            >
              <Eye size={16} />
            </GlassButton>
          )}

          {showSort && sortOptions.length > 0 && (
            <>
              <GlassDropdown
                options={sortOptions}
                value={sortBy}
                onChange={handleSortByChange}
                placeholder="Sort by"
              />

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleSortToggle}
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </GlassButton>
            </>
          )}

          {showFilter && filterOptions.length > 0 && (
            <div style={filterBadgeStyles}>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter size={16} />
              </GlassButton>
              {activeFilters.length > 0 && (
                <div style={filterCountStyles}>
                  {activeFilters.length}
                </div>
              )}
            </div>
          )}

          {showRefresh && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              loading={loading}
            >
              <RefreshCw size={16} />
            </GlassButton>
          )}

          {showExport && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onExport}
            >
              <Download size={16} />
            </GlassButton>
          )}

          {showSettings && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onSettings}
            >
              <Settings size={16} />
            </GlassButton>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <GlassModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Options"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <p style={{
            color: colors.text.secondary,
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.5',
          }}>
            Select multiple filters to refine your results. Active filters will be applied immediately.
          </p>

          {/* Filter Categories */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.sm,
            marginBottom: spacing.md,
          }}>
            {['Status', 'Department', 'Access Level'].map(category => (
              <GlassButton
                key={category}
                variant="ghost"
                size="sm"
              >
                {category}
                <ChevronDown size={14} style={{ marginLeft: spacing.xs }} />
              </GlassButton>
            ))}
          </div>

          {/* Filter Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: spacing.md,
            maxHeight: '400px',
            overflowY: 'auto',
            padding: spacing.sm,
          }}>
            {filterOptionsWithCounts.map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  cursor: 'pointer',
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  background: option.isActive ? colors.glass.primary : colors.glass.secondary,
                  border: `1px solid ${option.isActive ? colors.border.medium : colors.border.light}`,
                  transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
                  boxShadow: option.isActive ? shadows.glass : 'none',
                }}
                className="filter-item"
              >
                <input
                  type="checkbox"
                  checked={option.isActive}
                  onChange={(e) => {
                    const newFilters = e.target.checked
                      ? [...activeFilters, option.value]
                      : activeFilters.filter(f => f !== option.value);
                    onFilterChange?.(newFilters);
                  }}
                  style={{
                    margin: 0,
                    width: '18px',
                    height: '18px',
                    accentColor: colors.text.primary,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{
                    color: colors.text.primary,
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}>
                    {option.label}
                  </span>
                </div>
                {option.count !== undefined && (
                  <GlassStatusBadge
                    status="info"
                    label={option.count.toString()}
                    size="sm"
                  />
                )}
                {option.isActive && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: colors.gradients.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}>
                    <Check size={12} />
                  </div>
                )}
              </label>
            ))}
          </div>

          {/* Summary and Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.md,
            background: colors.glass.secondary,
            borderRadius: borderRadius.md,
            marginTop: spacing.md,
          }}>
            <span style={{
              color: colors.text.primary,
              fontSize: '0.875rem',
              fontWeight: '600',
            }}>
              {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} selected
            </span>

            {activeFilters.length > 0 && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange?.([])}>
                Clear All
              </GlassButton>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.border.light}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.md,
          }}>
            <GlassButton
              variant="ghost"
              size="md"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Cancel
            </GlassButton>

            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Preview Modal */}
      {showPreview && onPreviewItem && (
        <GlassModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreviewModal}
          title="Design Page"
        >
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {previewItem && (
              <div>
                {/* This is where the preview content would be rendered */}
                {/* We'll use the onPreviewItem callback to get the content */}
                <div style={{ padding: spacing.xl }}>
                  {/* The actual content would be provided by the parent component */}
                  {/* through the renderPreview prop */}
                  {/* {typeof onPreviewItem === 'function' && onPreviewItem(previewItem)} */}
                </div>
              </div>
            )}
          </div>
        </GlassModal>
      )}
    </>
  );
};