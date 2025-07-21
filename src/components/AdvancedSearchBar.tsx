import React, { useState, useRef, useEffect } from 'react';
import { Search, X, User, FileText, Settings, Calendar, Shield, Building } from 'lucide-react';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '../ui';
import { GlassModal } from '../ui/components/GlassModal';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'users' | 'documents' | 'settings' | 'events' | 'security' | 'departments';
  icon: React.ReactNode;
  url?: string;
}

interface AdvancedSearchBarProps {
  minSearchLength?: number;
  placeholder?: string;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

// Mock search data
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Sarah Johnson',
    subtitle: 'Senior Software Engineer • Engineering',
    category: 'users',
    icon: <User size={16} />,
    url: '/identity/1',
  },
  {
    id: '2',
    title: 'Michael Rodriguez',
    subtitle: 'Security Manager • Security',
    category: 'users',
    icon: <User size={16} />,
    url: '/identity/2',
  },
  {
    id: '3',
    title: 'Emily Chen',
    subtitle: 'Marketing Coordinator • Marketing',
    category: 'users',
    icon: <User size={16} />,
    url: '/identity/3',
  },
  {
    id: '4',
    title: 'Security Policy Document',
    subtitle: 'Updated 2 days ago • 15 pages',
    category: 'documents',
    icon: <FileText size={16} />,
    url: '/documents/security-policy',
  },
  {
    id: '5',
    title: 'Access Control Settings',
    subtitle: 'System Configuration • Security',
    category: 'settings',
    icon: <Settings size={16} />,
    url: '/settings/access-control',
  },
  {
    id: '6',
    title: 'Team Meeting',
    subtitle: 'Tomorrow at 2:00 PM • Conference Room A',
    category: 'events',
    icon: <Calendar size={16} />,
    url: '/events/team-meeting',
  },
  {
    id: '7',
    title: 'Security Audit Report',
    subtitle: 'Quarterly Review • Completed',
    category: 'security',
    icon: <Shield size={16} />,
    url: '/reports/security-audit',
  },
  {
    id: '8',
    title: 'Engineering Department',
    subtitle: '45 members • Building A, Floor 3',
    category: 'departments',
    icon: <Building size={16} />,
    url: '/departments/engineering',
  },
  {
    id: '9',
    title: 'Lisa Thompson',
    subtitle: 'Chief Security Officer • Executive',
    category: 'users',
    icon: <User size={16} />,
    url: '/identity/5',
  },
  {
    id: '10',
    title: 'Identity Management Guide',
    subtitle: 'User Manual • 32 pages',
    category: 'documents',
    icon: <FileText size={16} />,
    url: '/documents/identity-guide',
  },
];

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  minSearchLength = 7,
  placeholder = 'Search users, documents, settings...',
  onResultClick,
  className = '',
}) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px', width: '500px' });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate modal position based on search bar position
  const updateModalPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setModalPosition({
        top: `${rect.bottom + 8}px`, // 8px below the search bar
        left: `${rect.left}px`,
        width: `${Math.max(rect.width, 500)}px`, // At least 500px wide, or match search bar width
      });
    }
  };

  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.length >= minSearchLength) {
      setIsSearching(true);
      updateModalPosition(); // Update position when opening

      // Simulate search delay
      const searchTimeout = setTimeout(() => {
        const filtered = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResults(filtered);
        setIsModalOpen(true);
        setSelectedIndex(-1);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setFilteredResults([]);
      setIsModalOpen(false);
      setSelectedIndex(-1);
      setIsSearching(false);
    }
  }, [searchTerm, minSearchLength]);

  // Update modal position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isModalOpen) {
        updateModalPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isModalOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isModalOpen || filteredResults.length === 0) {
      if (e.key === 'Enter' && searchTerm.length >= minSearchLength) {
        updateModalPosition();
        setIsModalOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
          handleResultClick(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsModalOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchTerm('');
    setIsModalOpen(false);
    setSelectedIndex(-1);
    onResultClick?.(result);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsModalOpen(false);
    setSelectedIndex(-1);
    setIsSearching(false);
    inputRef.current?.focus();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIndex(-1);
  };

  const getCategoryColor = (category: SearchResult['category']) => {
    const categoryColors = {
      users: '#6366f1',
      documents: '#10b981',
      settings: '#f59e0b',
      events: '#8b5cf6',
      security: '#ef4444',
      departments: '#06b6d4',
    };
    return categoryColors[category];
  };

  const getCategoryLabel = (category: SearchResult['category']) => {
    const categoryLabels = {
      users: t('search.categories.user'),
      documents: t('search.categories.document'),
      settings: t('search.categories.setting'),
      events: t('search.categories.event'),
      security: t('search.categories.security'),
      departments: t('search.categories.department'),
    };
    return categoryLabels[category];
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: colors.glass.primary,
    border: `2px solid ${isModalOpen ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    height: '48px',
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: `${spacing.md} ${spacing.lg}`,
    paddingLeft: '3rem',
    paddingRight: searchTerm ? '3rem' : spacing.lg,
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.text.primary,
    height: '100%',
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.lg,
    color: isSearching ? colors.text.primary : colors.text.secondary, // Theme-aware icon color
    zIndex: 2,
    animation: isSearching ? 'spin 1s linear infinite' : 'none',
  };

  const clearButtonStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.lg,
    background: 'none',
    border: 'none',
    color: colors.text.secondary, // Theme-aware button color
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  };

  const resultItemStyles = (index: number): React.CSSProperties => ({
    padding: `${spacing.lg} ${spacing.xl}`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    // THEME-AWARE BACKGROUNDS WITH ENHANCED VISIBILITY
    background: selectedIndex === index
      ? 'rgba(99, 102, 241, 0.3)' // Selection background (theme-independent for consistency)
      : colors.glass.secondary, // Theme-aware default background
    borderRadius: borderRadius.lg,
    margin: `0 ${spacing.md}`,
    marginBottom: spacing.sm,
    // THEME-AWARE BORDERS
    border: selectedIndex === index
      ? `2px solid rgba(99, 102, 241, 0.8)` // Selection border
      : `2px solid ${colors.border.light}`, // Theme-aware default border
    minHeight: '70px',
    // ENHANCED BOX SHADOW
    boxShadow: selectedIndex === index
      ? '0 8px 32px rgba(99, 102, 241, 0.4)'
      : shadows.glass,
  });

  const categoryBadgeStyles = (category: SearchResult['category']): React.CSSProperties => ({
    padding: `${spacing.sm} ${spacing.md}`,
    background: `${getCategoryColor(category)}E6`, // Enhanced opacity for better visibility
    color: 'white', // Pure white text for maximum contrast
    fontSize: '0.75rem',
    fontWeight: '800',
    borderRadius: borderRadius.md,
    border: `2px solid ${getCategoryColor(category)}`,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)', // Strong text shadow for contrast
    boxShadow: `0 4px 16px ${getCategoryColor(category)}40`, // Glow effect
  });

  const searchInfoStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    borderBottom: `1px solid ${colors.border.light}`, // Theme-aware border
    color: colors.text.primary, // Theme-aware text color
    fontSize: '0.875rem',
    textAlign: 'center',
    background: colors.glass.primary, // Theme-aware background
    fontWeight: '600',
    marginBottom: spacing.lg,
  };

  const noResultsStyles: React.CSSProperties = {
    padding: `${spacing['3xl']} ${spacing.xl}`,
    textAlign: 'center',
    color: colors.text.primary, // Theme-aware text color
  };

  const loadingStyles: React.CSSProperties = {
    padding: `${spacing['3xl']} ${spacing.xl}`,
    textAlign: 'center',
    color: colors.text.primary, // Theme-aware text color
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.lg,
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .search-input::placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .search-input::-webkit-input-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .search-input::-moz-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .search-input:-ms-input-placeholder {
            color: ${colors.text.secondary} !important;
            opacity: 0.8 !important;
            font-weight: 500 !important;
          }
          
          .search-input {
            -webkit-text-fill-color: ${colors.text.primary} !important;
            -webkit-opacity: 1 !important;
          }
          
          .search-clear-btn:hover {
            background: ${colors.glass.secondary} !important;
            color: ${colors.text.primary} !important;
            transform: scale(1.1) !important;
          }
          
          .search-result-item:hover {
            background: ${colors.glass.primary} !important;
            transform: translateX(6px) !important;
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .search-input-container:focus-within {
            border-color: ${colors.border.medium} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          /* Enhanced category-specific hover effects */
          .search-result-item[data-category="users"]:hover {
            border-left: 4px solid #6366f1 !important;
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4) !important;
          }
          
          .search-result-item[data-category="documents"]:hover {
            border-left: 4px solid #10b981 !important;
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4) !important;
          }
          
          .search-result-item[data-category="settings"]:hover {
            border-left: 4px solid #f59e0b !important;
            box-shadow: 0 8px 32px rgba(245, 158, 11, 0.4) !important;
          }
          
          .search-result-item[data-category="events"]:hover {
            border-left: 4px solid #8b5cf6 !important;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4) !important;
          }
          
          .search-result-item[data-category="security"]:hover {
            border-left: 4px solid #ef4444 !important;
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4) !important;
          }
          
          .search-result-item[data-category="departments"]:hover {
            border-left: 4px solid #06b6d4 !important;
            box-shadow: 0 8px 32px rgba(6, 182, 212, 0.4) !important;
          }
          
          /* Enhanced modal content styling */
          .search-modal-content {
            max-height: 70vh;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            background: ${colors.glass.secondary} !important;
          }
          
          .search-modal-content::-webkit-scrollbar {
            display: none;
          }
          
          /* Keyboard navigation highlight */
          .search-result-item.selected {
            background: rgba(99, 102, 241, 0.4) !important;
            border-color: rgba(99, 102, 241, 0.8) !important;
            transform: translateX(8px) !important;
            box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5) !important;
          }
          
          /* Enhanced result item text with theme awareness */
          .search-result-item .result-title {
            color: ${colors.text.primary} !important;
            font-weight: 700 !important;
          }
          
          .search-result-item .result-subtitle {
            color: ${colors.text.secondary} !important;
            font-weight: 500 !important;
          }
          
          /* Loading spinner with theme colors */
          .loading-spinner {
            border: 3px solid ${colors.glass.secondary} !important;
            border-top: 3px solid ${colors.text.primary} !important;
          }
          
          @media (max-width: 768px) {
            .search-result-item {
              padding: ${spacing.md} ${spacing.lg} !important;
              min-height: 60px !important;
              margin: 0 ${spacing.sm} ${spacing.sm} ${spacing.sm} !important;
            }
            
            .search-modal-content {
              max-height: 60vh !important;
            }
          }
          
          @media (max-width: 480px) {
            .search-result-item {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: ${spacing.sm} !important;
              min-height: auto !important;
            }
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .search-result-item {
              border: 3px solid ${colors.border.medium} !important;
            }
            
            .search-result-item .result-title,
            .search-result-item .result-subtitle {
              font-weight: 900 !important;
              text-shadow: none !important;
            }
            
            .category-badge {
              border: 3px solid white !important;
              font-weight: 900 !important;
            }
          }
        `}
      </style>

      <div ref={containerRef} style={containerStyles} className={className}>
        <div style={inputContainerStyles} className="search-input-container">
          <Search size={18} style={iconStyles} />

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inputStyles}
            className="search-input"
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              style={clearButtonStyles}
              className="search-clear-btn"
              title={t('common.clear')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Modal - Positioned below search bar */}
        <GlassModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={`${t('search.results')}${filteredResults.length > 0 ? ` (${filteredResults.length})` : ''}`}
          customPosition={{
            top: modalPosition.top,
            left: modalPosition.left,
            width: modalPosition.width,
          }}
        >
          <div className="search-modal-content">
            {/* Search Info */}
            <div style={searchInfoStyles} className="search-info">
              {isSearching ? (
                `🔍 ${t('common.loading')}`
              ) : filteredResults.length > 0 ? (
                `${t('search.found')} ${filteredResults.length} ${filteredResults.length !== 1 ? t('search.results') : t('search.result')} ${t('search.for')} "${searchTerm}"`
              ) : (
                `${t('search.noResults')} "${searchTerm}"`
              )}
              <div style={{ fontSize: '0.75rem', marginTop: spacing.sm, opacity: 0.8 }}>
                {t('search.keyboardNavigation')}
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div style={loadingStyles} className="loading-state">
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${colors.glass.secondary}`,
                  borderTop: `3px solid ${colors.text.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} className="loading-spinner" />
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  {t('search.searching')}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {t('search.lookingThrough')}
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && filteredResults.length > 0 && (
              <div style={{ padding: spacing.lg }}>
                {filteredResults.map((result, index) => (
                  <div
                    key={result.id}
                    style={resultItemStyles(index)}
                    onClick={() => handleResultClick(result)}
                    className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                    data-category={result.category}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `${getCategoryColor(result.category)}40`,
                      borderRadius: borderRadius.lg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                      border: `2px solid ${getCategoryColor(result.category)}80`,
                      boxShadow: `0 4px 16px ${getCategoryColor(result.category)}40`,
                    }}>
                      {result.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="result-title" style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: colors.text.primary, // Theme-aware
                        marginBottom: spacing.sm,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {result.title}
                      </div>
                      <div className="result-subtitle" style={{
                        fontSize: '0.875rem',
                        color: colors.text.secondary, // Theme-aware
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: '500',
                      }}>
                        {result.subtitle}
                      </div>
                    </div>

                    <div style={categoryBadgeStyles(result.category)} className="category-badge">
                      {getCategoryLabel(result.category)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && searchTerm.length >= minSearchLength && filteredResults.length === 0 && (
              <div style={noResultsStyles} className="no-results">
                <div style={{ marginBottom: spacing.xl, fontSize: '3rem' }}>🔍</div>
                <div style={{ fontWeight: '700', marginBottom: spacing.lg, fontSize: '1.25rem', color: colors.text.primary }}>
                  {t('search.noResultsFound')}
                </div>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto', color: colors.text.secondary }}>
                  {t('search.couldntFind')} "<strong>{searchTerm}</strong>".
                  <br /><br />
                  {t('search.trySearchingFor')}:
                  <br />• {t('search.suggestions.users')}
                  <br />• {t('search.suggestions.documents')}
                  <br />• {t('search.suggestions.settings')}
                  <br />• {t('search.suggestions.events')}
                </div>
              </div>
            )}
          </div>
        </GlassModal>
      </div>
    </>
  );
};
