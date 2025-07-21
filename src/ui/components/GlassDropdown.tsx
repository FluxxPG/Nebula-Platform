import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { colors, spacing, borderRadius, shadows, animations } from '..';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
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

  const handleSelect = (option: DropdownOption) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <style>
        {animations.keyframes.slideDown}
        {animations.keyframes.scaleIn}
        {`
          .glass-dropdown-option:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            transform: translateX(4px) !important;
            color: ${colors.text.primary} !important;
          }
          
          .glass-dropdown-option:last-child {
            border-bottom: none !important;
          }
          
          .glass-dropdown-search {
            color: ${colors.text.primary} !important;
            -webkit-text-fill-color: ${colors.text.primary} !important;
          }
          
          .glass-dropdown-search::placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
          }
          
          .glass-dropdown-search:focus {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: ${colors.border.medium} !important;
          }
          
          .glass-dropdown-list {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            background: rgba(0, 0, 0, 0.95) !important;
          }
          
          .glass-dropdown-list::-webkit-scrollbar {
            display: none !important;
          }
          
          /* Ensure dropdown appears above everything */
          .glass-dropdown-container {
            position: relative;
          }
          
          .glass-dropdown-container.open {
            z-index: 100000 !important;
          }
          
          .glass-dropdown-list {
            z-index: 100001 !important;
            position: absolute !important;
            isolation: isolate !important;
          }
          
          .glass-dropdown-trigger:hover {
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .glass-dropdown-trigger:focus {
            outline: none !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover}, 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
          }
          
          /* Enhanced visibility for options */
          .glass-dropdown-option {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
          }
          
          .glass-dropdown-option:hover {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
          }
          
          /* Ensure proper stacking context */
          .glass-dropdown-container.open .glass-dropdown-list {
            z-index: 100001 !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Override any parent z-index constraints */
          .glass-dropdown-container.open {
            position: relative !important;
            z-index: 100000 !important;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .glass-dropdown-list {
              max-height: 250px !important;
              font-size: 0.875rem !important;
            }
            
            .glass-dropdown-option {
              padding: ${spacing.lg} !important;
            }
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .glass-dropdown-list {
              background: rgba(0, 0, 0, 0.98) !important;
              border: 3px solid ${colors.border.medium} !important;
            }
            
            .glass-dropdown-option {
              color: white !important;
              font-weight: 700 !important;
            }
            
            .glass-dropdown-option:hover {
              background: rgba(255, 255, 255, 0.3) !important;
            }
          }
        `}
      </style>
      
      <div 
        ref={dropdownRef} 
        style={containerStyles} 
        className={`glass-dropdown-container ${isOpen ? 'open' : ''} ${className}`}
      >
        <div 
          style={triggerStyles} 
          onClick={handleTriggerClick}
          className="glass-dropdown-trigger"
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

        <div style={dropdownStyles} className="glass-dropdown-list">
          {searchable && (
            <input
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyles}
              className="glass-dropdown-search"
              onClick={(e) => e.stopPropagation()}
              autoFocus={isOpen}
            />
          )}
          
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              style={optionStyles}
              onClick={() => handleSelect(option)}
              className="glass-dropdown-option"
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </div>
          ))}
          
          {filteredOptions.length === 0 && (
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