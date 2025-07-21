import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  children?: DropdownOption[];
}

interface GlassCascadingDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string, path?: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

export const GlassCascadingDropdown: React.FC<GlassCascadingDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  searchable = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [activePath, setActivePath] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option and its label
  const findSelectedOption = (opts: DropdownOption[], val: string): { option: DropdownOption | null, path: string[] } => {
    for (const opt of opts) {
      if (opt.value === val) {
        return { option: opt, path: [opt.value] };
      }
      if (opt.children) {
        const result = findSelectedOption(opt.children, val);
        if (result.option) {
          return { option: result.option, path: [opt.value, ...result.path] };
        }
      }
    }
    return { option: null, path: [] };
  };

  const { option: selectedOption } = findSelectedOption(options, selectedValue);

  // Filter options based on search term
  const filterOptions = (opts: DropdownOption[], term: string): DropdownOption[] => {
    if (!term) return opts;
    
    return opts.reduce<DropdownOption[]>((filtered, opt) => {
      const matchesSearch = opt.label.toLowerCase().includes(term.toLowerCase());
      
      let filteredChildren: DropdownOption[] = [];
      if (opt.children) {
        filteredChildren = filterOptions(opt.children, term);
      }
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...opt,
          children: filteredChildren.length > 0 ? filteredChildren : opt.children
        });
      }
      
      return filtered;
    }, []);
  };

  const filteredOptions = searchable && searchTerm
    ? filterOptions(options, searchTerm)
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setActivePath([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    zIndex: isOpen ? 100000 : 100, // Extremely high z-index when open
  };

  const triggerStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.glass.primary,
    border: `2px solid ${isOpen ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    fontSize: '1rem',
    fontWeight: '600',
    color: selectedOption ? colors.text.primary : colors.text.secondary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    boxShadow: isOpen ? shadows.glassHover : shadows.glass,
    opacity: disabled ? 0.5 : 1,
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    background: 'rgba(0, 0, 0, 0.95)', // Much darker background for better contrast
    border: `2px solid ${colors.border.medium}`,
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    boxShadow: `${shadows.dropdown}, 0 0 0 1px rgba(255, 255, 255, 0.1)`, // Enhanced shadow with border
    zIndex: 100001, // Extremely high z-index for dropdown content
    maxHeight: '300px', // Increased height
    overflowY: 'auto',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const searchInputStyles: React.CSSProperties = {
    width: '100%',
    padding: spacing.md,
    background: 'rgba(255, 255, 255, 0.1)', // Light background for contrast
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.text.primary,
    outline: 'none',
    marginBottom: spacing.sm,
  };

  const optionStyles: React.CSSProperties = {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: '0.875rem',
    fontWeight: '600', // Increased weight for better visibility
    color: colors.text.primary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    background: 'transparent',
    borderBottom: `1px solid rgba(255, 255, 255, 0.05)`, // Subtle separator
  };

  const chevronStyles: React.CSSProperties = {
    transition: `transform ${animations.duration.normal} ${animations.easing.smooth}`,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    color: colors.text.primary,
  };

  const breadcrumbStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    fontSize: '0.75rem',
    color: colors.text.secondary,
    fontWeight: '600',
  };

  const breadcrumbItemStyles: React.CSSProperties = {
    cursor: 'pointer',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setActivePath([]);
      }
    }
  };

  const handleOptionClick = (option: DropdownOption, currentPath: string[] = []) => {
    if (option.children && option.children.length > 0) {
      setActivePath([...currentPath, option.value]);
    } else {
      setSelectedValue(option.value);
      onChange?.(option.value, [...currentPath, option.value]);
      setIsOpen(false);
      setSearchTerm('');
      setActivePath([]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setActivePath(activePath.slice(0, index + 1));
  };

  const renderOptions = (opts: DropdownOption[], currentPath: string[] = []) => {
    return opts.map((option) => (
      <div
        key={option.value}
        style={optionStyles}
        onClick={() => handleOptionClick(option, currentPath)}
        className="glass-dropdown-option"
        role="option"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOptionClick(option, currentPath);
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          {option.icon}
          <span>{option.label}</span>
        </div>
        {option.children && option.children.length > 0 && (
          <ChevronRight size={16} />
        )}
      </div>
    ));
  };

  const getCurrentOptions = () => {
    if (searchTerm) {
      return filteredOptions;
    }
    
    let currentOptions = options;
    let currentPath: string[] = [];
    
    for (const segment of activePath) {
      currentPath.push(segment);
      const foundOption = currentOptions.find(opt => opt.value === segment);
      if (foundOption && foundOption.children) {
        currentOptions = foundOption.children;
      } else {
        break;
      }
    }
    
    return currentOptions;
  };

  const renderBreadcrumbs = () => {
    if (activePath.length === 0 || searchTerm) return null;
    
    const breadcrumbs = [];
    let currentOptions = options;
    
    // Add root
    breadcrumbs.push(
      <div
        key="root"
        style={breadcrumbItemStyles}
        onClick={() => setActivePath([])}
        className="breadcrumb-item"
      >
        Root
      </div>
    );
    
    // Add path segments
    for (let i = 0; i < activePath.length; i++) {
      const segment = activePath[i];
      const option = currentOptions.find(opt => opt.value === segment);
      
      if (option) {
        breadcrumbs.push(
          <ChevronRight key={`separator-${i}`} size={12} />
        );
        
        breadcrumbs.push(
          <div
            key={segment}
            style={breadcrumbItemStyles}
            onClick={() => handleBreadcrumbClick(i)}
            className="breadcrumb-item"
          >
            {option.label}
          </div>
        );
        
        if (option.children) {
          currentOptions = option.children;
        }
      }
    }
    
    return (
      <div style={breadcrumbStyles}>
        {breadcrumbs}
      </div>
    );
  };

  const colors = useThemeColors();

  return (
    <>
      <style>
        {`
          .glass-cascading-dropdown-option:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            transform: translateX(4px) !important;
            color: ${colors.text.primary} !important;
          }
          
          .glass-cascading-dropdown-option:last-child {
            border-bottom: none !important;
          }
          
          .glass-cascading-dropdown-search {
            color: ${colors.text.primary} !important;
            -webkit-text-fill-color: ${colors.text.primary} !important;
          }
          
          .glass-cascading-dropdown-search::placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
          }
          
          .glass-cascading-dropdown-search:focus {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: ${colors.border.medium} !important;
          }
          
          .glass-cascading-dropdown-list {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            background: rgba(0, 0, 0, 0.95) !important;
          }
          
          .glass-cascading-dropdown-list::-webkit-scrollbar {
            display: none !important;
          }
          
          .breadcrumb-item {
            transition: all 0.2s ease;
          }
          
          .breadcrumb-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }
        `}
      </style>
      
      <div 
        ref={dropdownRef} 
        style={containerStyles} 
        className={`glass-cascading-dropdown-container ${isOpen ? 'open' : ''} ${className}`}
      >
        <div 
          style={triggerStyles} 
          onClick={handleTriggerClick}
          className="glass-cascading-dropdown-trigger"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerClick();
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {selectedOption?.icon}
            <span>{selectedOption?.label || placeholder}</span>
          </div>
          <ChevronDown size={18} style={chevronStyles} />
        </div>

        <div style={dropdownStyles} className="glass-cascading-dropdown-list">
          {searchable && (
            <input
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyles}
              className="glass-cascading-dropdown-search"
              onClick={(e) => e.stopPropagation()}
              autoFocus={isOpen}
            />
          )}
          
          {renderBreadcrumbs()}
          
          {renderOptions(getCurrentOptions(), activePath)}
          
          {getCurrentOptions().length === 0 && (
            <div style={{
              ...optionStyles,
              color: colors.text.tertiary,
              cursor: 'default',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: spacing.xl,
            }}>
              {searchTerm ? 'No matching options found' : 'No options available'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};