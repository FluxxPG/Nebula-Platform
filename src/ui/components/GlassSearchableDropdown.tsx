import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, X, Loader2, Check } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassSearchableDropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  serverSideSearch?: boolean;
  onSearch?: (query: string) => Promise<DropdownOption[]> | void;
  debounceMs?: number;
  minSearchLength?: number;
  maxItems?: number;
}

export const GlassSearchableDropdown: React.FC<GlassSearchableDropdownProps> = ({
  options: initialOptions,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  multiple = false,
  className = '',
  error,
  label,
  required = false,
  searchPlaceholder = 'Search...',
  noOptionsMessage = 'No options found',
  loadingMessage = 'Loading...',
  serverSideSearch = false,
  onSearch,
  debounceMs = 300,
  minSearchLength = 0,
  maxItems = 100
}) => {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<DropdownOption[]>(initialOptions);
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : (value ? [value] : [])
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update options when initialOptions change
  useEffect(() => {
    setOptions(initialOptions);
    if (!serverSideSearch || !searchTerm) {
      setFilteredOptions(initialOptions);
    }
  }, [initialOptions, serverSideSearch, searchTerm]);

  // Update selected values when value prop changes
  useEffect(() => {
    if (multiple) {
      setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
    } else {
      setSelectedValues(value ? [value] : []);
    }
  }, [value, multiple]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Filter options based on search term
  const filterOptions = useCallback(async (query: string) => {
    if (serverSideSearch && onSearch) {
      if (query.length >= minSearchLength) {
        setIsLoading(true);
        try {
          const result = await onSearch(query);
          if (result) {
            setOptions(result);
            setFilteredOptions(result);
          }
        } catch (error) {
          console.error('Error searching options:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (query.length === 0) {
        setOptions(initialOptions);
        setFilteredOptions(initialOptions);
      }
    } else {
      // Client-side filtering
      const filtered = initialOptions.filter(option =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [serverSideSearch, onSearch, initialOptions, minSearchLength]);

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      filterOptions(query);
    }, debounceMs);
  }, [filterOptions, debounceMs]);

  // Toggle dropdown
  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
        setFilteredOptions(options);
        setHighlightedIndex(-1);
      }
    }
  };

  // Select an option
  const handleSelectOption = (option: DropdownOption) => {
    if (multiple) {
      const isSelected = selectedValues.includes(option.value);
      let newValues: string[];
      
      if (isSelected) {
        newValues = selectedValues.filter(val => val !== option.value);
      } else {
        newValues = [...selectedValues, option.value];
      }
      
      setSelectedValues(newValues);
      onChange?.(newValues);
      
      // Keep dropdown open for multiple selection
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      setSelectedValues([option.value]);
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Remove a selected value (for multiple select)
  const handleRemoveValue = (valueToRemove: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    const newValues = selectedValues.filter(val => val !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(multiple ? newValues : '');
  };

  // Clear all selected values
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.(multiple ? [] : '');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  // Get selected option labels
  const getSelectedLabels = () => {
    return selectedValues.map(val => {
      const option = [...options, ...initialOptions].find(opt => opt.value === val);
      return option ? option.label : val;
    });
  };

  // Styles
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
  };

  const triggerStyles: React.CSSProperties = {
    width: '100%',
    minHeight: '48px',
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.glass.primary,
    border: `2px solid ${error ? '#ef4444' : isOpen ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: selectedValues.length > 0 ? colors.text.primary : colors.text.secondary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    boxShadow: isOpen ? shadows.glassHover : shadows.glass,
    opacity: disabled ? 0.7 : 1,
    flexWrap: 'wrap',
    gap: spacing.sm,
  };

  const selectedItemsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  };

  const selectedItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.glass.secondary,
    borderRadius: borderRadius.md,
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.text.primary,
  };

  const removeButtonStyles: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: colors.glass.primary,
    border: `2px solid ${colors.border.medium}`,
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    boxShadow: shadows.dropdown,
    zIndex: 1000,
    maxHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    overflow: 'hidden',
  };

  const searchContainerStyles: React.CSSProperties = {
    padding: spacing.sm,
    borderBottom: `1px solid ${colors.border.light}`,
    position: 'relative',
  };

  const searchInputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    paddingLeft: '2.5rem',
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.md,
    fontSize: '0.875rem',
    color: colors.text.primary,
    outline: 'none',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const searchIconStyles: React.CSSProperties = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.secondary,
    pointerEvents: 'none',
  };

  const optionsContainerStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const optionStyles = (isSelected: boolean, isHighlighted: boolean): React.CSSProperties => ({
    padding: `${spacing.md} ${spacing.lg}`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    background: isHighlighted ? colors.glass.secondary : 'transparent',
    borderLeft: isSelected ? `3px solid ${colors.text.violet}` : '3px solid transparent',
    color: isSelected ? colors.text.violet : colors.text.primary,
    fontWeight: isSelected ? '600' : '400',
  });

  const optionContentStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const noOptionsStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    color: colors.text.secondary,
    fontSize: '0.875rem',
    textAlign: 'center',
    fontStyle: 'italic',
  };

  const loadingStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    color: colors.text.secondary,
    fontSize: '0.875rem',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: spacing.xs,
  };

  const chevronStyles: React.CSSProperties = {
    transition: `transform ${animations.duration.normal} ${animations.easing.smooth}`,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    color: colors.text.secondary,
  };

  return (
    <>
      <style>
        {`
          .searchable-dropdown-container {
            position: relative;
            width: 100%;
          }
          
          .searchable-dropdown-trigger:hover {
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .searchable-dropdown-trigger:focus {
            outline: none !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover}, 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
          }
          
          .searchable-dropdown-options {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .searchable-dropdown-options::-webkit-scrollbar {
            display: none !important;
          }
          
          .searchable-dropdown-option:hover {
            background: ${colors.glass.secondary} !important;
            color: ${colors.text.primary} !important;
          }
          
          .searchable-dropdown-option.selected {
            color: ${colors.text.violet} !important;
            font-weight: 600 !important;
            border-left: 3px solid ${colors.text.violet} !important;
          }
          
          .searchable-dropdown-option.highlighted {
            background: ${colors.glass.secondary} !important;
          }
          
          .searchable-dropdown-search:focus {
            border-color: ${colors.border.medium} !important;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
          }
          
          .searchable-dropdown-remove:hover {
            background: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
          }
          
          .searchable-dropdown-clear:hover {
            background: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .searchable-dropdown-spinner {
            animation: spin 1s linear infinite;
          }
          
          /* Responsive styles */
          @media (max-width: 640px) {
            .searchable-dropdown-trigger {
              min-height: 40px !important;
              padding: ${spacing.sm} ${spacing.md} !important;
            }
            
            .searchable-dropdown-search {
              padding: ${spacing.sm} ${spacing.md} !important;
              padding-left: 2.5rem !important;
            }
            
            .searchable-dropdown-option {
              padding: ${spacing.sm} ${spacing.md} !important;
            }
          }
        `}
      </style>
      
      <div style={containerStyles} className={`searchable-dropdown-container ${className}`} ref={dropdownRef}>
        {label && (
          <label style={labelStyles}>
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        
        <div
          style={triggerStyles}
          className="searchable-dropdown-trigger"
          onClick={handleToggleDropdown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
        >
          <div style={selectedItemsContainerStyles}>
            {selectedValues.length > 0 ? (
              multiple ? (
                selectedValues.map(val => {
                  const option = [...options, ...initialOptions].find(opt => opt.value === val);
                  return (
                    <div key={val} style={selectedItemStyles}>
                      {option?.icon}
                      <span>{option?.label || val}</span>
                      <button
                        type="button"
                        style={removeButtonStyles}
                        onClick={(e) => handleRemoveValue(val, e)}
                        className="searchable-dropdown-remove"
                        aria-label={`Remove ${option?.label || val}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <span>{getSelectedLabels()[0]}</span>
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {selectedValues.length > 0 && multiple && (
              <button
                type="button"
                style={{
                  ...removeButtonStyles,
                  padding: spacing.xs,
                }}
                onClick={handleClearAll}
                className="searchable-dropdown-clear"
                aria-label="Clear all"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown size={16} style={chevronStyles} />
          </div>
        </div>
        
        {error && (
          <div style={errorStyles}>
            {error}
          </div>
        )}
        
        <div style={dropdownStyles} className="searchable-dropdown">
          <div style={searchContainerStyles}>
            <div style={searchIconStyles}>
              <Search size={16} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              style={searchInputStyles}
              className="searchable-dropdown-search"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              aria-autocomplete="list"
            />
          </div>
          
          <div style={optionsContainerStyles} className="searchable-dropdown-options" role="listbox">
            {isLoading ? (
              <div style={loadingStyles}>
                <Loader2 size={16} className="searchable-dropdown-spinner" />
                <span>{loadingMessage}</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div style={noOptionsStyles}>
                {noOptionsMessage}
              </div>
            ) : (
              filteredOptions.slice(0, maxItems).map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={option.value}
                    style={optionStyles(isSelected, isHighlighted)}
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`searchable-dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div style={optionContentStyles}>
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check size={16} />
                    )}
                  </div>
                );
              })
            )}
            
            {filteredOptions.length > maxItems && (
              <div style={noOptionsStyles}>
                {`Showing ${maxItems} of ${filteredOptions.length} options. Please refine your search.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};