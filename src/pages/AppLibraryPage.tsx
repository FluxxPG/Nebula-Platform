import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Users, 
  Settings, 
  Grid3X3, 
  List, 
  Filter,
  ArrowLeft,
  Download,
  Star,
  Clock,
  Shield,
  Grip,
  ChevronRight,
  Library,
  Heart,
  BookmarkPlus,
  BookmarkMinus
} from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassInput, GlassCard, GlassStatusBadge, GlassModal, GlassDropdown } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useAppearance } from '../ui/hooks/useAppearance';
import { spacing, borderRadius, shadows, animations } from '../ui';
import { mockAppModules, getAllApps, searchApps, getAppsByModule, toggleFavoriteApp, getFavoriteApps, type AppModule, type App } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

interface AppLibraryPageProps {
  onAppClick: (appId: string) => void;
}

type ViewMode = 'modules' | 'module-detail' | 'all-apps' | 'favorites';

export const AppLibraryPage: React.FC<AppLibraryPageProps> = ({ onAppClick }) => {
  const colors = useThemeColors();
  const { iconColors, tileSizes } = useAppearance();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<ViewMode>('modules');
  const [selectedModule, setSelectedModule] = useState<AppModule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favoriteApps, setFavoriteApps] = useState<App[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [appToToggle, setAppToToggle] = useState<App | null>(null);
  const [isManageAppsModalOpen, setIsManageAppsModalOpen] = useState(false);
  const [isInstallAppModalOpen, setIsInstallAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('📱');
  const [newAppModule, setNewAppModule] = useState('');
  const [installError, setInstallError] = useState('');

  // Initialize favorites module
  useEffect(() => {
    // Update favorites list
    const favorites = getFavoriteApps();
    setFavoriteApps(favorites);
    
    // Update the favorites module in mockAppModules
    const favoritesModule = mockAppModules.find(m => m.id === 'favorites');
    if (favoritesModule) {
      favoritesModule.apps = favorites;
    }
  }, []);

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return getAllApps();
    return searchApps(searchQuery);
  }, [searchQuery]);

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return mockAppModules;
    return mockAppModules.filter(module => 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.apps.some(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const handleModuleClick = (module: AppModule) => {
    setSelectedModule(module);
    setViewMode(module.id === 'favorites' ? 'favorites' : 'module-detail');
  };

  const handleBackToModules = () => {
    setViewMode('modules');
    setSelectedModule(null);
    setSearchQuery('');
  };

  const handleViewAllApps = () => {
    setViewMode('all-apps');
    setSelectedModule(null);
  };

  const handleViewFavorites = () => {
    setViewMode('favorites');
    setSelectedModule(mockAppModules.find(m => m.id === 'favorites') || null);
  };

  const handleToggleFavorite = (app: App, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent app click
    setAppToToggle(app);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleFavorite = () => {
    if (appToToggle) {
      toggleFavoriteApp(appToToggle.id);
      
      // Update favorites list
      const updatedFavorites = getFavoriteApps();
      setFavoriteApps(updatedFavorites);
      
      // Update the favorites module in mockAppModules
      const favoritesModule = mockAppModules.find(m => m.id === 'favorites');
      if (favoritesModule) {
        favoritesModule.apps = updatedFavorites;
      }
      
      // Close modal
      setIsConfirmModalOpen(false);
      setAppToToggle(null);
    }
  };

  const handleInstallApp = () => {
    if (!newAppName.trim()) {
      setInstallError('App name is required');
      return;
    }
    
    if (!newAppModule) {
      setInstallError('Please select a module');
      return;
    }
    
    // Create new app
    const newApp: App = {
      id: `app-${Date.now()}`,
      name: newAppName,
      description: newAppDescription || 'No description provided',
      icon: newAppIcon,
      status: 'beta',
      users: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      features: ['New App'],
      moduleId: newAppModule,
      isFavorite: false
    };
    
    // Add app to selected module
    const moduleToUpdate = mockAppModules.find(m => m.id === newAppModule);
    if (moduleToUpdate) {
      moduleToUpdate.apps.push(newApp);
    }
    
    // Reset form and close modal
    setNewAppName('');
    setNewAppDescription('');
    setNewAppIcon('📱');
    setNewAppModule('');
    setInstallError('');
    setIsInstallAppModalOpen(false);
    
    // If we're in module detail view, update the selected module
    if (viewMode === 'module-detail' && selectedModule && selectedModule.id === newAppModule) {
      setSelectedModule({...moduleToUpdate!});
    }
  };

  const getStatusColor = (status: App['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'beta': return 'warning';
      case 'maintenance': return 'info';
      case 'deprecated': return 'error';
      default: return 'inactive';
    }
  };

  const renderModuleCard = (module: AppModule) => (
    <div
      id={`module-card-${module.id}`}
      key={module.id}
      onClick={() => handleModuleClick(module)}
      style={{
        padding: spacing.xl,
        background: colors.glass.primary,
        border: `2px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: shadows.glass,
        cursor: 'pointer',
        transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="module-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = shadows.glassHover;
        e.currentTarget.style.borderColor = colors.border.medium;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = shadows.glass;
        e.currentTarget.style.borderColor = colors.border.light;
      }}
    >
      {/* Module Header */}
      <div id={`module-header-${module.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <div id={`module-icon-${module.id}`} style={{
          width: '64px',
          height: '64px',
          background: `linear-gradient(135deg, ${module.color}20 0%, ${module.color}40 100%)`,
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          border: `2px solid ${module.color}60`,
        }}>
          {module.icon}
        </div>
        <div id={`module-badge-${module.id}`} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <GlassStatusBadge 
            status="success" 
            label={`${module.id === 'favorites' ? favoriteApps.length : module.apps.length} apps`} 
            size="sm" 
          />
          <ChevronRight size={20} style={{ color: iconColors.secondary }} />
        </div>
      </div>

      {/* Module Info */}
      <div id={`module-info-${module.id}`} style={{ marginBottom: spacing.lg }}>
        <h3 id={`module-title-${module.id}`} style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}>
          {module.name}
        </h3>
        <p id={`module-desc-${module.id}`} style={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          lineHeight: '1.5',
          marginBottom: spacing.md,
        }}>
          {module.description}
        </p>
      </div>

      {/* Module Stats */}
      <div id={`module-stats-${module.id}`} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing.md,
        padding: spacing.lg,
        background: colors.glass.secondary,
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.border.light}`,
      }}>
        <div id={`module-stat-users-${module.id}`} style={{ textAlign: 'center' }}>
          <div id={`module-stat-users-value-${module.id}`} style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}>
            {module.id === 'favorites' ? favoriteApps.length : module.totalUsers.toLocaleString()}
          </div>
          <div id={`module-stat-users-label-${module.id}`} style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
            {module.id === 'favorites' ? 'Favorite Apps' : 'Total Users'}
          </div>
        </div>
        <div id={`module-stat-apps-${module.id}`} style={{ textAlign: 'center' }}>
          <div id={`module-stat-apps-value-${module.id}`} style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}>
            {module.id === 'favorites' ? 
              (favoriteApps.length > 0 ? 
                new Date(Math.max(...favoriteApps.map(a => new Date(a.lastUpdated).getTime()))).toLocaleDateString() : 
                'N/A') : 
              module.apps.length}
          </div>
          <div id={`module-stat-apps-label-${module.id}`} style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
            {module.id === 'favorites' ? 'Last Updated' : 'Applications'}
          </div>
        </div>
      </div>

      {/* App Preview */}
      <div id={`module-preview-${module.id}`} style={{ marginTop: spacing.lg }}>
        <div id={`module-preview-title-${module.id}`} style={{
          fontSize: '0.75rem',
          color: colors.text.secondary,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: spacing.sm,
        }}>
          {module.id === 'favorites' ? 'Favorite Apps' : 'Featured Apps'}
        </div>
        <div id={`module-preview-apps-${module.id}`} style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          {(module.id === 'favorites' ? favoriteApps : module.apps).slice(0, 3).map((app) => (
            <div
              id={`module-preview-app-${app.id}`}
              key={app.id}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: colors.glass.primary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.md,
                fontSize: '0.75rem',
                color: colors.text.primary,
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent module click
                onAppClick(app.id);
              }}
            >
              <span>{app.icon}</span>
              <span>{app.name}</span>
            </div>
          ))}
          {(module.id === 'favorites' ? favoriteApps : module.apps).length > 3 && (
            <div id={`module-preview-more-${module.id}`} style={{
              padding: `${spacing.sm} ${spacing.md}`,
              background: colors.glass.primary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              fontSize: '0.75rem',
              color: colors.text.secondary,
              fontWeight: '600',
            }}>
              +{(module.id === 'favorites' ? favoriteApps : module.apps).length - 3} more
            </div>
          )}
          {module.id === 'favorites' && favoriteApps.length === 0 && (
            <div id="module-preview-empty-favorites" style={{
              padding: `${spacing.sm} ${spacing.md}`,
              background: colors.glass.primary,
              border: `1px solid ${colors.border.light}`,
              borderRadius: borderRadius.md,
              fontSize: '0.75rem',
              color: colors.text.secondary,
              fontWeight: '600',
              fontStyle: 'italic',
            }}>
              No favorites yet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAppCard = (app: App, showModule = false) => (
    <div
      id={`app-card-${app.id}`}
      key={app.id}
      onClick={() => onAppClick(app.id)}
      style={{
        padding: spacing.xl,
        background: colors.glass.primary,
        border: `2px solid ${colors.border.light}`,
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: shadows.glass,
        cursor: 'pointer',
        transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      className="app-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
        e.currentTarget.style.boxShadow = shadows.glassHover;
        e.currentTarget.style.borderColor = colors.border.medium;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = shadows.glass;
        e.currentTarget.style.borderColor = colors.border.light;
      }}
    >
      {/* Favorite Button */}
      <button
        id={`app-favorite-${app.id}`}
        onClick={(e) => handleToggleFavorite(app, e)}
        style={{
          position: 'absolute',
          top: spacing.lg,
          right: spacing.lg,
          width: '36px',
          height: '36px',
          background: colors.glass.secondary,
          border: `1px solid ${colors.border.light}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
          color: app.isFavorite ? '#f59e0b' : colors.text.secondary,
        }}
        className="favorite-button"
        title={app.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          size={18} 
          fill={app.isFavorite ? '#f59e0b' : 'none'} 
        />
      </button>

      {/* App Header */}
      <div id={`app-header-${app.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <div id={`app-icon-${app.id}`} style={{
          width: tileSizes.width,
          height: tileSizes.height,
          background: colors.gradients.primary,
          borderRadius: tileSizes.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          border: `1px solid ${colors.border.light}`,
        }}>
          {app.icon}
        </div>
        <div id={`app-badges-${app.id}`} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-end' }}>
          <GlassStatusBadge 
            status={getStatusColor(app.status) as any} 
            label={app.status}
            size="sm"
          />
          <span id={`app-version-${app.id}`} style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
            v{app.version}
          </span>
        </div>
      </div>

      {/* App Info */}
      <div id={`app-info-${app.id}`} style={{ flex: 1, marginBottom: spacing.lg }}>
        <h4 id={`app-title-${app.id}`} style={{
          fontSize: '1.125rem',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}>
          {app.name}
        </h4>
        <p id={`app-desc-${app.id}`} style={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          lineHeight: '1.5',
          marginBottom: spacing.md,
        }}>
          {app.description}
        </p>

        {/* Module Badge (if showing) */}
        {showModule && (
          <div id={`app-module-${app.id}`} style={{ marginBottom: spacing.md }}>
            <GlassStatusBadge 
              status="info" 
              label={mockAppModules.find(m => m.id === app.moduleId)?.name || 'Unknown Module'} 
              size="sm" 
            />
          </div>
        )}

        {/* Features */}
        <div id={`app-features-${app.id}`} style={{ marginBottom: spacing.lg }}>
          <div id={`app-features-title-${app.id}`} style={{
            fontSize: '0.75rem',
            color: colors.text.secondary,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: spacing.sm,
          }}>
            Key Features
          </div>
          <div id={`app-features-list-${app.id}`} style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
            {app.features.slice(0, 3).map((feature, index) => (
              <span
                id={`app-feature-${app.id}-${index}`}
                key={index}
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: colors.glass.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: borderRadius.sm,
                  fontSize: '0.75rem',
                  color: colors.text.primary,
                  fontWeight: '500',
                }}
              >
                {feature}
              </span>
            ))}
            {app.features.length > 3 && (
              <span id={`app-features-more-${app.id}`} style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                background: colors.glass.secondary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.sm,
                fontSize: '0.75rem',
                color: colors.text.secondary,
                fontWeight: '500',
              }}>
                +{app.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* App Stats */}
      <div id={`app-stats-${app.id}`} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        background: colors.glass.secondary,
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.border.light}`,
        marginBottom: spacing.lg,
      }}>
        <div id={`app-users-${app.id}`} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Users size={14} style={{ color: iconColors.secondary }} />
          <span id={`app-users-count-${app.id}`} style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
            {app.users.toLocaleString()} users
          </span>
        </div>
        <div id={`app-updated-${app.id}`} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Clock size={14} style={{ color: iconColors.secondary }} />
          <span id={`app-updated-date-${app.id}`} style={{ fontSize: '0.75rem', color: colors.text.secondary, fontWeight: '600' }}>
            {app.lastUpdated}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <GlassButton id={`app-open-${app.id}`} variant="primary" size="sm">
        <ExternalLink size={14} style={{ marginRight: spacing.xs }} />
        Open App
      </GlassButton>
    </div>
  );

  const renderModulesView = () => (
    <div id="modules-view">
      {/* Summary Stats */}
      <div id="modules-summary" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing.xl,
        marginBottom: spacing['3xl'],
      }}>
        <div id="modules-stat-count" style={{
          padding: spacing.xl,
          background: colors.glass.primary,
          border: 'none',
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
        }}>
          <div id="modules-stat-count-icon" style={{
            width: '60px',
            height: '60px',
            background: colors.gradients.primary,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Library size={28} style={{ color: 'white' }} />
          </div>
          <div id="modules-stat-count-content">
            <div id="modules-stat-count-value" style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.text.primary }}>
              {mockAppModules.length - 1} {/* Subtract 1 for the favorites module */}
            </div>
            <div id="modules-stat-count-label" style={{ fontSize: '1rem', color: colors.text.secondary, fontWeight: '600' }}>
              App Modules
            </div>
          </div>
        </div>
        
        <div id="modules-stat-apps" style={{
          padding: spacing.xl,
          background: colors.glass.primary,
          border: 'none',
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
        }}>
          <div id="modules-stat-apps-icon" style={{
            width: '60px',
            height: '60px',
            background: colors.gradients.success,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Grip size={28} style={{ color: 'white' }} />
          </div>
          <div id="modules-stat-apps-content">
            <div id="modules-stat-apps-value" style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.text.primary }}>
              {getAllApps().length}
            </div>
            <div id="modules-stat-apps-label" style={{ fontSize: '1rem', color: colors.text.secondary, fontWeight: '600' }}>
              Total Apps
            </div>
          </div>
        </div>
        
        <div id="modules-stat-favorites" style={{
          padding: spacing.xl,
          background: colors.glass.primary,
          border: 'none',
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
        }}>
          <div id="modules-stat-favorites-icon" style={{
            width: '60px',
            height: '60px',
            background: colors.gradients.warning,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Star size={28} style={{ color: 'white' }} />
          </div>
          <div id="modules-stat-favorites-content">
            <div id="modules-stat-favorites-value" style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.text.primary }}>
              {favoriteApps.length}
            </div>
            <div id="modules-stat-favorites-label" style={{ fontSize: '1rem', color: colors.text.secondary, fontWeight: '600' }}>
              Favorite Apps
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div id="modules-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: spacing.xl,
      }}>
        {/* Favorites Module First */}
        {renderModuleCard(mockAppModules.find(m => m.id === 'favorites')!)}
        
        {/* Other Modules */}
        {(searchQuery ? filteredModules : mockAppModules)
          .filter(m => m.id !== 'favorites')
          .map(renderModuleCard)}
      </div>
    </div>
  );

  const renderModuleDetailView = () => {
    if (!selectedModule) return null;

    return (
      <div id={`module-detail-${selectedModule.id}`}>
        {/* Module Header */}
        <div id={`module-detail-header-${selectedModule.id}`} style={{
          padding: spacing.xl,
          background: colors.glass.primary,
          border: 'none',
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          marginBottom: spacing['3xl'],
        }}>
          <div id={`module-detail-header-content-${selectedModule.id}`} style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg }}>
            <div id={`module-detail-icon-${selectedModule.id}`} style={{
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${selectedModule.color}20 0%, ${selectedModule.color}40 100%)`,
              borderRadius: borderRadius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              border: `2px solid ${selectedModule.color}60`,
            }}>
              {selectedModule.icon}
            </div>
            <div id={`module-detail-info-${selectedModule.id}`} style={{ flex: 1 }}>
              <h2 id={`module-detail-title-${selectedModule.id}`} style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                {selectedModule.name}
              </h2>
              <p id={`module-detail-desc-${selectedModule.id}`} style={{
                fontSize: '1.125rem',
                color: colors.text.secondary,
                lineHeight: '1.6',
                marginBottom: spacing.md,
              }}>
                {selectedModule.description}
              </p>
              <div id={`module-detail-badges-${selectedModule.id}`} style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                <GlassStatusBadge 
                  status="success" 
                  label={`${selectedModule.id === 'favorites' ? favoriteApps.length : selectedModule.apps.length} Applications`} 
                  size="md" 
                />
                {selectedModule.id !== 'favorites' && (
                  <>
                    <GlassStatusBadge 
                      status="info" 
                      label={`${selectedModule.totalUsers.toLocaleString()} Users`} 
                      size="md" 
                    />
                    <GlassStatusBadge 
                      status="warning" 
                      label={`Updated ${selectedModule.lastUpdated}`} 
                      size="md" 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div id={`module-detail-apps-${selectedModule.id}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: spacing.xl,
        }}>
          {(selectedModule.id === 'favorites' ? favoriteApps : selectedModule.apps).map(app => renderAppCard(app, false))}
          
          {/* Empty state for favorites */}
          {selectedModule.id === 'favorites' && favoriteApps.length === 0 && (
            <div id="module-detail-empty-favorites" style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: spacing['3xl'],
              color: colors.text.secondary,
            }}>
              <Heart size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
              <h3 id="module-detail-empty-favorites-title" style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: colors.text.primary, 
                marginBottom: spacing.lg 
              }}>
                No Favorite Apps Yet
              </h3>
              <p id="module-detail-empty-favorites-text" style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                maxWidth: '500px', 
                margin: '0 auto',
                marginBottom: spacing.xl,
              }}>
                Click the heart icon on any app to add it to your favorites for quick access.
              </p>
              <GlassButton id="module-detail-empty-favorites-button" variant="primary" onClick={handleViewAllApps}>
                <Grip size={16} style={{ marginRight: spacing.sm }} />
                Browse All Apps
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAllAppsView = () => (
    <div id="all-apps-view">
      {/* Apps Grid */}
      <div id="all-apps-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: spacing.xl,
      }}>
        {(searchQuery ? filteredApps : getAllApps()).map(app => renderAppCard(app, true))}
      </div>
    </div>
  );

  const renderFavoritesView = () => (
    <div id="favorites-view">
      {/* Favorites Header */}
      <div id="favorites-header" style={{
        padding: spacing.xl,
        background: colors.glass.primary,
        border: 'none',
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        marginBottom: spacing['3xl'],
      }}>
        <div id="favorites-header-content" style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg }}>
          <div id="favorites-icon" style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%)',
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            border: '2px solid rgba(245, 158, 11, 0.6)',
          }}>
            ⭐
          </div>
          <div id="favorites-info" style={{ flex: 1 }}>
            <h2 id="favorites-title" style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Favorites
            </h2>
            <p id="favorites-desc" style={{
              fontSize: '1.125rem',
              color: colors.text.secondary,
              lineHeight: '1.6',
              marginBottom: spacing.md,
            }}>
              Quick access to your most frequently used applications
            </p>
            <div id="favorites-badges" style={{ display: 'flex', gap: spacing.md }}>
              <GlassStatusBadge 
                status="success" 
                label={`${favoriteApps.length} Applications`} 
                size="md" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div id="favorites-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: spacing.xl,
      }}>
        {favoriteApps.length > 0 ? (
          favoriteApps.map(app => renderAppCard(app, true))
        ) : (
          <div id="favorites-empty" style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: spacing['3xl'],
            color: colors.text.secondary,
          }}>
            <Heart size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
            <h3 id="favorites-empty-title" style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg 
            }}>
              No Favorite Apps Yet
            </h3>
            <p id="favorites-empty-text" style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              maxWidth: '500px', 
              margin: '0 auto',
              marginBottom: spacing.xl,
            }}>
              Click the heart icon on any app to add it to your favorites for quick access.
            </p>
            <GlassButton id="favorites-empty-button" variant="primary" onClick={handleViewAllApps}>
              <Grip size={16} style={{ marginRight: spacing.sm }} />
              Browse All Apps
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );

  const getPageTitle = () => {
    if (viewMode === 'module-detail' && selectedModule) {
      return selectedModule.name;
    }
    if (viewMode === 'all-apps') {
      return 'All Applications';
    }
    if (viewMode === 'favorites') {
      return 'Favorite Applications';
    }
    return 'App Library';
  };

  const getPageSubtitle = () => {
    if (viewMode === 'module-detail' && selectedModule) {
      return `${selectedModule.id === 'favorites' ? favoriteApps.length : selectedModule.apps.length} applications in this module`;
    }
    if (viewMode === 'all-apps') {
      return `${getAllApps().length} applications across all modules`;
    }
    if (viewMode === 'favorites') {
      return `${favoriteApps.length} favorite applications for quick access`;
    }
    return 'Explore and manage your identity and access management applications';
  };

  const getPageActions = () => {
    const actions = [];

    if (viewMode !== 'modules') {
      actions.push(
        <GlassButton id="action-back" key="back" variant="ghost" onClick={handleBackToModules}>
          <ArrowLeft size={16} style={{ marginRight: spacing.sm }} />
          Back to Modules
        </GlassButton>
      );
    }

    if (viewMode === 'modules') {
      actions.push(
        <GlassButton id="action-favorites" key="favorites" variant="ghost" onClick={handleViewFavorites}>
          <Star size={16} style={{ marginRight: spacing.sm }} />
          View Favorites
        </GlassButton>
      );
      
      actions.push(
        <GlassButton id="action-all-apps" key="all-apps" variant="ghost" onClick={handleViewAllApps}>
          <Grid3X3 size={16} style={{ marginRight: spacing.sm }} />
          View All Apps
        </GlassButton>
      );
    }

    actions.push(
      <GlassButton id="action-manage" key="settings" variant="ghost" onClick={() => setIsManageAppsModalOpen(true)}>
        <Settings size={16} style={{ marginRight: spacing.sm, color: iconColors.primary }} />
        Manage Apps
      </GlassButton>
    );

    actions.push(
      <GlassButton id="action-install" key="install" variant="primary" onClick={() => setIsInstallAppModalOpen(true)}>
        <ExternalLink size={16} style={{ marginRight: spacing.sm }} />
        Install New App
      </GlassButton>
    );

    return (
      <div id="page-actions" style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
        {actions}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .favorite-button {
            opacity: 0.7;
            transition: all 0.2s ease;
          }
          
          .favorite-button:hover {
            opacity: 1;
            transform: scale(1.1);
            background: ${colors.glass.primary} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .app-card:hover .favorite-button {
            opacity: 1;
          }
          
          .favorite-button.active {
            color: #f59e0b !important;
            background: ${colors.glass.primary} !important;
            box-shadow: ${shadows.glassHover} !important;
          }
        `}
      </style>
      
      <PageLayout
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        actions={getPageActions()}
      >
        {/* Search Bar */}
        <div id="search-container" style={{
          marginBottom: spacing['3xl'],
          padding: spacing.xl,
          background: colors.glass.primary,
          border: 'none',
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <div id="search-input-container" style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <div id="search-input-wrapper" style={{ flex: 1 }}>
              <GlassInput
                id="search-input"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={`Search ${viewMode === 'modules' ? 'modules and apps' : 'applications'}...`}
              />
            </div>
            <GlassButton id="search-filter" variant="ghost" size="sm">
              <Filter size={16} />
            </GlassButton>
          </div>
          
          {searchQuery && (
            <div id="search-results-info" style={{ marginTop: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <span id="search-results-count" style={{ fontSize: '0.875rem', color: colors.text.secondary, fontWeight: '600' }}>
                {viewMode === 'modules' 
                  ? `Found ${filteredModules.length} modules and ${filteredApps.length} apps`
                  : `Found ${filteredApps.length} applications`
                } for "{searchQuery}"
              </span>
              <GlassButton id="search-clear" variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                Clear
              </GlassButton>
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === 'modules' && renderModulesView()}
        {viewMode === 'module-detail' && renderModuleDetailView()}
        {viewMode === 'all-apps' && renderAllAppsView()}
        {viewMode === 'favorites' && renderFavoritesView()}

        {/* Empty State */}
        {searchQuery && (
          (viewMode === 'modules' && filteredModules.length === 0) ||
          (viewMode !== 'modules' && filteredApps.length === 0)
        ) && (
          <div id="search-empty-state" style={{
            textAlign: 'center',
            padding: spacing['3xl'],
            color: colors.text.secondary,
          }}>
            <Search size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
            <h3 id="search-empty-title" style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: colors.text.primary, 
              marginBottom: spacing.lg 
            }}>
              No results found
            </h3>
            <p id="search-empty-text" style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              maxWidth: '400px', 
              margin: '0 auto',
              marginBottom: spacing.xl,
            }}>
              We couldn't find any {viewMode === 'modules' ? 'modules or apps' : 'applications'} matching "{searchQuery}".
              <br />Try adjusting your search terms.
            </p>
            <GlassButton id="search-empty-clear" variant="ghost" onClick={() => setSearchQuery('')}>
              Clear Search
            </GlassButton>
          </div>
        )}
      </PageLayout>

      {/* Confirmation Modal */}
      <GlassModal
        id="favorite-confirm-modal"
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setAppToToggle(null);
        }}
        title={appToToggle?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        <div id="favorite-confirm-content" style={{ padding: spacing.xl }}>
          <div id="favorite-confirm-app" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.lg, 
            marginBottom: spacing.xl,
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`,
          }}>
            <div id="favorite-confirm-app-icon" style={{
              width: '48px',
              height: '48px',
              background: colors.gradients.primary,
              borderRadius: borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}>
              {appToToggle?.icon}
            </div>
            <div id="favorite-confirm-app-info">
              <h4 id="favorite-confirm-app-title" style={{ 
                fontSize: '1.125rem', 
                fontWeight: '700', 
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.xs,
              }}>
                {appToToggle?.name}
              </h4>
              <p id="favorite-confirm-app-desc" style={{ 
                fontSize: '0.875rem', 
                color: colors.text.secondary,
                margin: 0,
              }}>
                {appToToggle?.description}
              </p>
            </div>
          </div>
          
          <p id="favorite-confirm-message" style={{ 
            fontSize: '1rem', 
            color: colors.text.primary,
            lineHeight: '1.6',
            marginBottom: spacing.xl,
          }}>
            {appToToggle?.isFavorite 
              ? "Are you sure you want to remove this app from your favorites?" 
              : "Add this app to your favorites for quick access?"}
          </p>
          
          <div id="favorite-confirm-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              id="favorite-confirm-cancel"
              variant="ghost" 
              onClick={() => {
                setIsConfirmModalOpen(false);
                setAppToToggle(null);
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              id="favorite-confirm-submit"
              variant={appToToggle?.isFavorite ? "warning" : "primary"} 
              onClick={confirmToggleFavorite}
            >
              {appToToggle?.isFavorite ? (
                <>
                  <BookmarkMinus size={16} style={{ marginRight: spacing.sm }} />
                  Remove from Favorites
                </>
              ) : (
                <>
                  <BookmarkPlus size={16} style={{ marginRight: spacing.sm }} />
                  Add to Favorites
                </>
              )}
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Manage Apps Modal */}
      <GlassModal
        id="manage-apps-modal"
        isOpen={isManageAppsModalOpen}
        onClose={() => setIsManageAppsModalOpen(false)}
        title="Manage Applications"
      >
        <div id="manage-apps-content" style={{ padding: spacing.xl }}>
          <p id="manage-apps-description" style={{ 
            fontSize: '0.875rem', 
            color: colors.text.secondary,
            marginBottom: spacing.xl,
            lineHeight: '1.6',
          }}>
            Manage your installed applications, update settings, or remove apps you no longer need.
          </p>
          
          <div id="manage-apps-tabs" style={{ 
            display: 'flex', 
            gap: spacing.md, 
            marginBottom: spacing.xl,
            background: colors.glass.secondary,
            padding: spacing.sm,
            borderRadius: borderRadius.lg,
          }}>
            <GlassButton id="manage-apps-tab-installed" variant="primary" size="sm">
              Installed Apps
            </GlassButton>
            <GlassButton id="manage-apps-tab-updates" variant="ghost" size="sm">
              Updates
            </GlassButton>
            <GlassButton id="manage-apps-tab-marketplace" variant="ghost" size="sm">
              Marketplace
            </GlassButton>
          </div>
          
          <div id="manage-apps-search" style={{ marginBottom: spacing.xl }}>
            <GlassInput
              id="manage-apps-search-input"
              placeholder="Search installed apps..."
            />
          </div>
          
          <div id="manage-apps-list" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: spacing.md,
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {getAllApps().slice(0, 5).map(app => (
              <div
                id={`manage-app-${app.id}`}
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.lg,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <div id={`manage-app-icon-${app.id}`} style={{
                  width: '48px',
                  height: '48px',
                  background: colors.gradients.primary,
                  borderRadius: borderRadius.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}>
                  {app.icon}
                </div>
                
                <div id={`manage-app-info-${app.id}`} style={{ flex: 1 }}>
                  <div id={`manage-app-title-${app.id}`} style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}>
                    {app.name}
                  </div>
                  <div id={`manage-app-meta-${app.id}`} style={{ 
                    display: 'flex', 
                    gap: spacing.md, 
                    fontSize: '0.75rem',
                    color: colors.text.secondary,
                  }}>
                    <span>v{app.version}</span>
                    <span>{app.users.toLocaleString()} users</span>
                    <span>{mockAppModules.find(m => m.id === app.moduleId)?.name}</span>
                  </div>
                </div>
                
                <div id={`manage-app-actions-${app.id}`} style={{ display: 'flex', gap: spacing.sm }}>
                  <GlassButton id={`manage-app-settings-${app.id}`} variant="ghost" size="sm">
                    <Settings size={14} />
                  </GlassButton>
                  <GlassButton id={`manage-app-uninstall-${app.id}`} variant="error" size="sm">
                    Uninstall
                  </GlassButton>
                </div>
              </div>
            ))}
          </div>
          
          <div id="manage-apps-footer" style={{ 
            marginTop: spacing.xl, 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl,
          }}>
            <GlassButton id="manage-apps-install" variant="primary" onClick={() => {
              setIsManageAppsModalOpen(false);
              setIsInstallAppModalOpen(true);
            }}>
              <ExternalLink size={16} style={{ marginRight: spacing.sm }} />
              Install New App
            </GlassButton>
            
            <GlassButton id="manage-apps-close" variant="ghost" onClick={() => setIsManageAppsModalOpen(false)}>
              Close
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Install App Modal */}
      <GlassModal
        id="install-app-modal"
        isOpen={isInstallAppModalOpen}
        onClose={() => {
          setIsInstallAppModalOpen(false);
          setNewAppName('');
          setNewAppDescription('');
          setNewAppIcon('📱');
          setNewAppModule('');
          setInstallError('');
        }}
        title="Install New Application"
      >
        <div id="install-app-content" style={{ padding: spacing.xl }}>
          <p id="install-app-description" style={{ 
            fontSize: '0.875rem', 
            color: colors.text.secondary,
            marginBottom: spacing.xl,
            lineHeight: '1.6',
          }}>
            Install a new application to your Nebula platform. Fill in the details below to add the app to your library.
          </p>
          
          {installError && (
            <div id="install-app-error" style={{ 
              padding: spacing.md,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: borderRadius.md,
              color: '#ef4444',
              marginBottom: spacing.xl,
            }}>
              {installError}
            </div>
          )}
          
          <div id="install-app-form" style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            <div id="install-app-name-field">
              <label id="install-app-name-label" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                App Name *
              </label>
              <GlassInput
                id="install-app-name-input"
                value={newAppName}
                onChange={setNewAppName}
                placeholder="Enter application name"
              />
            </div>
            
            <div id="install-app-description-field">
              <label id="install-app-description-label" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Description
              </label>
              <textarea
                id="install-app-description-input"
                value={newAppDescription}
                onChange={(e) => setNewAppDescription(e.target.value)}
                placeholder="Enter application description"
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
              />
            </div>
            
            <div id="install-app-icon-field">
              <label id="install-app-icon-label" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                App Icon
              </label>
              <div id="install-app-icon-options" style={{ 
                display: 'flex', 
                gap: spacing.md, 
                flexWrap: 'wrap',
              }}>
                {['📱', '🔐', '📊', '📝', '🔍', '⚙️', '🔔', '👤', '🏢', '🔑'].map(icon => (
                  <button
                    id={`install-app-icon-option-${icon}`}
                    key={icon}
                    onClick={() => setNewAppIcon(icon)}
                    style={{
                      width: '48px',
                      height: '48px',
                      background: newAppIcon === icon ? colors.gradients.primary : colors.glass.secondary,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: borderRadius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div id="install-app-module-field">
              <label id="install-app-module-label" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Module *
              </label>
              <GlassDropdown
                id="install-app-module-input"
                options={mockAppModules
                  .filter(m => m.id !== 'favorites')
                  .map(m => ({ value: m.id, label: m.name }))}
                value={newAppModule}
                onChange={setNewAppModule}
                placeholder="Select module"
              />
            </div>
          </div>
          
          <div id="install-app-actions" style={{ 
            marginTop: spacing.xl, 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: spacing.md,
            borderTop: `1px solid ${colors.border.light}`,
            paddingTop: spacing.xl,
          }}>
            <GlassButton 
              id="install-app-cancel"
              variant="ghost" 
              onClick={() => {
                setIsInstallAppModalOpen(false);
                setNewAppName('');
                setNewAppDescription('');
                setNewAppIcon('📱');
                setNewAppModule('');
                setInstallError('');
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              id="install-app-submit"
              variant="primary" 
              onClick={handleInstallApp}
            >
              <ExternalLink size={16} style={{ marginRight: spacing.sm }} />
              Install Application
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </>
  );
};
