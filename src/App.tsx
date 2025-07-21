/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Home, Users, UserCheck, Calendar, Grip, Shield, LogOut, Bell, Settings, FileText, BarChart2, Database, Layout, CheckSquare } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { GlassDock, ThemeToggle } from './ui/components';
import { BreadcrumbNavigation } from './components/BreadcrumbNavigation';
import { useThemeColors } from './ui/hooks/useThemeColors';
import { useAppearance } from './ui/hooks/useAppearance';
import { useTheme } from './contexts/ThemeContext';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';
import { spacing } from './ui';
import { HomePage } from './pages/HomePage';
import { AppLibraryPage } from './pages/AppLibraryPage';
import { IdentityDetailPage } from './pages/IdentityDetailPage';
import { UIDesignerPage } from './pages/UIDesignerPage';
import { ModelManagerPage } from './pages/ModelManagerPage';
import { EventWallPage } from './pages/EventWallPage';
import { LoginPage } from './components/LoginPage';
import { PreferencesMenu } from './components/PreferencesMenu';
import { AdvancedSearchBar } from './components/AdvancedSearchBar';
import { Identity } from './types/identity';
import { ReportingHome } from './pages/reporting/ReportingHome';
import { DataSourcesPage } from './pages/reporting/DataSourcesPage';
import { ReportsPage } from './pages/reporting/ReportsPage';
import { DashboardsPage } from './pages/reporting/DashboardsPage';
import { SQLEditorPage } from './pages/reporting/SQLEditorPage';
import { ReportBuilderPage } from './pages/reporting/ReportBuilderPage';
import { DashboardBuilderPage } from './pages/reporting/DashboardBuilderPage';
import { ReportViewPage } from './pages/reporting/ReportViewPage';
import { DashboardViewPage } from './pages/reporting/DashboardViewPage';
import { CalculatedColumnsPage } from './pages/reporting/CalculatedColumnsPage';
import { VisitListPage, VisitCheckinPage, VisitorKioskApp } from './pages/visitors';
import { UserGroupManagementPage } from './pages/UserGroupManagementPage';
import DroolsDesignerPage from './pages/rules/DroolsDesignerPage';
import type { DockPosition, DockSize, IconSize } from './ui/components/GlassDock';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Login_Mutation } from './operations/AccountQuery';
import IdentityNewListPage from './pages/IdentityNewListPage';
import Auth from './Auth';

type Page = 'home' | 'persona' | 'visitors' | 'events' | 'apps' | 'identity-list' | 'identity-detail' | 'ui-designer' | 'model-manager' | 'event-wall' | 'reporting' | 'reporting-datasources' | 'reporting-reports' | 'reporting-dashboards' | 'reporting-sql' | 'reporting-columns' | 'report-builder' | 'dashboard-builder' | 'report-view' | 'dashboard-view' | 'visit-list' | 'visit-checkin' | 'user-groups' | 'visitor-kiosk' | "compliance-policies";

interface User {
  email: string;
  name: string;
  role: string;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'users' | 'documents' | 'settings' | 'events' | 'security' | 'departments';
  icon: React.ReactNode;
  url?: string;
}

interface DockSettings {
  position: DockPosition;
  dockSize: DockSize;
  iconSize: IconSize;
  autoHide: boolean;
  showLabels: boolean;
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Advanced Dock Settings State
  const [dockSettings, setDockSettings] = useState<DockSettings>({
    position: 'bottom',
    dockSize: 'medium',
    iconSize: 'medium',
    autoHide: false,
    showLabels: true,
  });

  const colors = useThemeColors();
  const { theme } = useTheme();
  const { iconColors, tileSizes, textSizes } = useAppearance();
  const { breadcrumbs, updateBreadcrumbs, goBack } = useBreadcrumbs();

  // SMART TEXT COLOR HELPER
  const getSmartTextColor = (type: 'primary' | 'secondary' | 'violet' = 'primary') => {
    if (theme === 'light') {
      switch (type) {
        case 'primary':
          return 'rgba(30, 30, 30, 0.95)'; // Dark text for light theme
        case 'secondary':
          return 'rgba(60, 60, 60, 0.85)'; // Dark secondary for light theme
        case 'violet':
          return colors.text.violet; // Use theme-aware violet color
        default:
          return 'rgba(30, 30, 30, 0.95)';
      }
    } else {
      switch (type) {
        case 'primary':
          return 'rgba(255, 255, 255, 0.98)'; // White text for dark theme
        case 'secondary':
          return 'rgba(255, 255, 255, 0.8)'; // White secondary for dark theme
        case 'violet':
          return colors.text.violet; // Use theme-aware violet color
        default:
          return 'rgba(255, 255, 255, 0.98)';
      }
    }
  };

  // BREADCRUMB NAVIGATION HANDLER
  const handleBreadcrumbNavigation = (id: string) => {
    switch (id) {
      case 'home':
        setCurrentPage('home');
        setSelectedIdentity(null);
        break;
      case 'apps':
        setCurrentPage('apps');
        setSelectedIdentity(null);
        break;
      case 'identity-list':
        setCurrentPage('identity-list');
        setSelectedIdentity(null);
        break;
      case 'identity-detail':
        if (selectedIdentity) {
          setCurrentPage('identity-detail');
        }
        break;
      case 'ui-designer':
        setCurrentPage('ui-designer');
        setSelectedIdentity(null);
        break;
      case 'model-manager':
        setCurrentPage('model-manager');
        setSelectedIdentity(null);
        break;
      case 'event-wall':
        setCurrentPage('event-wall');
        setSelectedIdentity(null);
        break;
      case 'visit-list':
        setCurrentPage('visit-list');
        setSelectedIdentity(null);
        break;
      case 'visit-checkin':
        setCurrentPage('visit-checkin');
        setSelectedIdentity(null);
        break;
      case 'visitor-kiosk':
        setCurrentPage('visitor-kiosk');
        setSelectedIdentity(null);
        break;
      case 'user-groups':
        setCurrentPage('user-groups');
        setSelectedIdentity(null);
        break;
      default:
        setCurrentPage(id as Page);
        setSelectedIdentity(null);
    }
  };

  // UPDATE BREADCRUMBS BASED ON CURRENT PAGE
  const updatePageBreadcrumbs = (page: Page, identity?: Identity) => {
    switch (page) {
      case 'home':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'apps':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'identity-list':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'identity-list', label: t('identity.list.title'), icon: <Users size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'identity-detail':
        if (identity) {
          updateBreadcrumbs([
            { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
            { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
            { id: 'identity-list', label: t('identity.list.title'), icon: <Users size={16} /> },
            { id: 'identity-detail', label: `${identity.firstname} ${identity.lastname}`, icon: <UserCheck size={16} /> }
          ], handleBreadcrumbNavigation);
        }
        break;

      case 'ui-designer':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'ui-designer', label: t('uiDesigner.title'), icon: <Settings size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'model-manager':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'model-manager', label: t('modelManager.title'), icon: <Settings size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'event-wall':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'event-wall', label: t('eventWall.title'), icon: <Shield size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting-datasources':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-datasources', label: t('reporting.dataSources.title'), icon: <Database size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting-reports':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-reports', label: t('reporting.reports.title'), icon: <FileText size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting-dashboards':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-dashboards', label: t('reporting.dashboards.title'), icon: <Layout size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting-sql':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-sql', label: t('reporting.sqlEditor.title'), icon: <Database size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'reporting-columns':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-columns', label: t('reporting.calculatedColumns.title'), icon: <Database size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'report-builder':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-reports', label: t('reporting.reports.title'), icon: <FileText size={16} /> },
          { id: 'report-builder', label: t('reporting.reports.createReport'), icon: <FileText size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'dashboard-builder':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-dashboards', label: t('reporting.dashboards.title'), icon: <Layout size={16} /> },
          { id: 'dashboard-builder', label: t('reporting.dashboards.createDashboard'), icon: <Layout size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'report-view':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-reports', label: t('reporting.reports.title'), icon: <FileText size={16} /> },
          { id: 'report-view', label: t('common.view'), icon: <FileText size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'dashboard-view':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'reporting', label: t('reporting.title'), icon: <BarChart2 size={16} /> },
          { id: 'reporting-dashboards', label: t('reporting.dashboards.title'), icon: <Layout size={16} /> },
          { id: 'dashboard-view', label: t('common.view'), icon: <Layout size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'visit-list':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'visitors', label: t('visitors.title'), icon: <UserCheck size={16} /> },
          { id: 'visit-list', label: t('visitors.title'), icon: <Calendar size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'visit-checkin':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'visitors', label: t('visitors.title'), icon: <UserCheck size={16} /> },
          { id: 'visit-list', label: t('visitors.title'), icon: <Calendar size={16} /> },
          { id: 'visit-checkin', label: t('visitors.checkIn.title'), icon: <CheckSquare size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'visitor-kiosk':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'visitors', label: t('visitors.title'), icon: <UserCheck size={16} /> },
          { id: 'visitor-kiosk', label: t('visitors.kiosk.title'), icon: <UserCheck size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'persona':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'persona', label: t('nav.persona'), icon: <Users size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'visitors':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'visitors', label: t('nav.visitors'), icon: <UserCheck size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'events':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'events', label: t('nav.eventCockpit'), icon: <Calendar size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      case 'user-groups':
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> },
          { id: 'apps', label: t('nav.appLibrary'), icon: <Grip size={16} /> },
          { id: 'user-groups', label: t('identity.userGroups.title'), icon: <Users size={16} /> }
        ], handleBreadcrumbNavigation);
        break;

      default:
        updateBreadcrumbs([
          { id: 'home', label: t('nav.home'), icon: <Home size={16} /> }
        ], handleBreadcrumbNavigation);
    }
  };

  // Update current page based on URL path
  useEffect(() => {
    const path = location.pathname;

    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/apps') {
      setCurrentPage('apps');
    } else if (path === '/identity-list') {
      setCurrentPage('identity-list');
    } else if (path.startsWith('/identity/')) {
      setCurrentPage('identity-detail');
      // In a real app, you would fetch the identity data based on the ID
    } else if (path === '/ui-designer') {
      setCurrentPage('ui-designer');
    } else if (path === '/model-manager') {
      setCurrentPage('model-manager');
    } else if (path === '/event-wall') {
      setCurrentPage('event-wall');
    } else if (path === '/reporting') {
      setCurrentPage('reporting');
    } else if (path === '/reporting/data-sources') {
      setCurrentPage('reporting-datasources');
    } else if (path === '/reporting/reports') {
      setCurrentPage('reporting-reports');
    } else if (path.startsWith('/reporting/reports/')) {
      setCurrentPage('report-view');
    } else if (path === '/reporting/dashboards') {
      setCurrentPage('reporting-dashboards');
    } else if (path.startsWith('/reporting/dashboards/')) {
      setCurrentPage('dashboard-view');
    } else if (path === '/reporting/sql-editor') {
      setCurrentPage('reporting-sql');
    } else if (path === '/reporting/calculated-columns') {
      setCurrentPage('reporting-columns');
    } else if (path === '/reporting/report-builder') {
      setCurrentPage('report-builder');
    } else if (path === '/reporting/dashboard-builder') {
      setCurrentPage('dashboard-builder');
    } else if (path === '/visitors') {
      setCurrentPage('visit-list');
    } else if (path.startsWith('/visitors/checkin/')) {
      setCurrentPage('visit-checkin');
    } else if (path === '/visitor-kiosk') {
      setCurrentPage('visitor-kiosk');
    } else if (path === '/user-groups') {
      setCurrentPage('user-groups');
    }

    // Update breadcrumbs based on current page
    updatePageBreadcrumbs(currentPage);
  }, [location.pathname]);

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: <Home size={24} style={{ color: (currentPage == 'home' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage === 'home'
    },
    {
      id: 'persona',
      label: t('nav.persona'),
      icon: <Users size={24} style={{ color: (currentPage == 'persona' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage === 'persona'
    },
    {
      id: 'visitors',
      label: t('nav.visitors'),
      icon: <UserCheck size={24} style={{ color: (currentPage == 'visitors' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage === 'visitors' || currentPage === 'visit-list' || currentPage === 'visit-checkin' || currentPage === 'visitor-kiosk',
      badge: '12'
    },
    {
      id: 'events',
      label: t('nav.eventCockpit'),
      icon: <Calendar size={24} style={{ color: (currentPage == 'events' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage === 'events',
      badge: '3'
    },
    {
      id: 'reporting',
      label: t('reporting.title'),
      icon: <BarChart2 size={24} style={{ color: (currentPage == 'reporting' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage.includes('reporting') || currentPage === 'report-builder' || currentPage === 'dashboard-builder' || currentPage === 'report-view' || currentPage === 'dashboard-view'
    },
    {
      id: 'apps',
      label: t('nav.appLibrary'),
      icon: <Grip size={24} style={{ color: (currentPage == 'apps' ? "#ffffff" : iconColors.primary) }} />,
      active: currentPage === 'apps' || currentPage === 'user-groups'
    },
  ];

  const [accountLogin] = useMutation(Login_Mutation);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await accountLogin({
        variables: {
          username: credentials.email,
          password: credentials.password
        }
      }).then(result => {
        if (result.data && result.data.login && result.data.login.messageType === "Success") {
          sessionStorage.setItem('sessionKey', result.data.login.accessToken)
          sessionStorage.setItem('status', 'true');
          setUser({
            email: credentials.email,
            name: 'Administrator',
            role: 'Super Admin',
          });
          updatePageBreadcrumbs('home');
          navigate('/');
        }
      })
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sessionKey');
    setUser(null);
    Auth.signOut();
    setSelectedIdentity(null);
    updateBreadcrumbs([], handleBreadcrumbNavigation);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    setNotificationCount(0);
  };

  const handleNavClick = (id: string) => {
    const newPage = id as Page;
    setCurrentPage(newPage);
    setSelectedIdentity(null);
    updatePageBreadcrumbs(newPage);

    // Navigate to the corresponding route
    switch (id) {
      case 'home':
        navigate('/');
        break;
      case 'persona':
        navigate('/persona');
        break;
      case 'visitors':
        navigate('/visitors');
        break;
      case 'events':
        navigate('/events');
        break;
      case 'apps':
        navigate('/apps');
        break;
      case 'reporting':
        navigate('/reporting');
        break;
      default:
        navigate(`/${id}`);
    }
  };

  // FIXED: Handle app clicks with correct app IDs and breadcrumb updates
  const handleAppClick = (appId: string) => {
    console.log('App clicked:', appId);

    // Handle Identity Management app navigation
    if (appId === 'identity-management' || appId === 'identity') {
      setCurrentPage('identity-list');
      updatePageBreadcrumbs('identity-list');
      navigate('/identity-list');
      return;
    }

    // Handle other identity-related apps
    if (appId === 'access-control' || appId === 'privileged-access' || appId === 'identity-governance') {
      setCurrentPage('identity-list');
      updatePageBreadcrumbs('identity-list');
      navigate('/identity-list');
      return;
    }

    // Handle UI Designer apps
    if (appId === 'form-designer') {
      setCurrentPage('ui-designer');
      updatePageBreadcrumbs('ui-designer');
      navigate('/ui-designer');
      return;
    }

    if (appId === 'model-manager') {
      setCurrentPage('model-manager');
      updatePageBreadcrumbs('model-manager');
      navigate('/model-manager');
      return;
    }

    // Handle Event Wall app
    if (appId === 'event-wall') {
      setCurrentPage('event-wall');
      updatePageBreadcrumbs('event-wall');
      navigate('/event-wall');
      return;
    }

    // Handle User Group Management app
    if (appId === 'user-groups') {
      setCurrentPage('user-groups');
      updatePageBreadcrumbs('user-groups');
      navigate('/user-groups');
      return;
    }

    // Handle Visitor Kiosk app
    if (appId === 'visitor-kiosk') {
      setCurrentPage('visitor-kiosk');
      updatePageBreadcrumbs('visitor-kiosk');
      navigate('/visitor-kiosk');
      return;
    }
    if (appId === "compliance-reporting") {
      setCurrentPage('reporting');
      updatePageBreadcrumbs('reporting');
      navigate('/reporting');
      return;
    }
    if (appId === "compliance-policies") {
      setCurrentPage('compliance-policies');
      updatePageBreadcrumbs('compliance-policies');
      navigate('/compliance/policies');
      return;
    }

    // For other apps, you can add specific navigation logic here
    console.log(`Navigation for app ${appId} not implemented yet`);
  };

  const handleIdentityClick = (identity: Identity) => {
    setSelectedIdentity(identity);
    setCurrentPage('identity-detail');
    updatePageBreadcrumbs('identity-detail', identity);
    navigate(`/identity/${identity.id}`);
  };

  const handleBackToList = () => {
    setCurrentPage('identity-list');
    setSelectedIdentity(null);
    updatePageBreadcrumbs('identity-list');
    navigate('/identity-list');
  };

  // ENHANCED BACK NAVIGATION
  const handleBackNavigation = () => {
    goBack(handleBreadcrumbNavigation);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    console.log('Search result clicked:', result);

    if (result.category === 'users' && result.url?.includes('/identity/')) {
      setCurrentPage('identity-list');
      updatePageBreadcrumbs('identity-list');
      navigate('/identity-list');
    } else if (result.url?.includes('/apps')) {
      setCurrentPage('apps');
      updatePageBreadcrumbs('apps');
      navigate('/apps');
    }
  };

  const handleDockSettingsChange = (newSettings: DockSettings) => {
    setDockSettings(newSettings);
    localStorage.setItem('nebula-dock-settings', JSON.stringify(newSettings));
  };

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('nebula-dock-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setDockSettings(parsed);
      } catch (error) {
        console.warn('Failed to parse saved dock settings:', error);
      }
    }
  }, []);

  // Don't show the regular UI for the kiosk app
  if (currentPage === 'visitor-kiosk') {
    return <VisitorKioskApp />;
  }

  if (!Auth.getAuth()) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'apps':
        return <AppLibraryPage onAppClick={handleAppClick} />;
      case 'identity-list':
        return <IdentityNewListPage onIdentityClick={handleIdentityClick} />;
      case 'identity-detail':
        return selectedIdentity ? (
          <IdentityDetailPage identity={selectedIdentity} onBack={handleBackToList} />
        ) : null;
      case 'ui-designer':
        return <UIDesignerPage />;
      case 'model-manager':
        return <ModelManagerPage />;
      case 'event-wall':
        return <EventWallPage />;
      case 'reporting':
        return <ReportingHome />;
      case 'reporting-datasources':
        return <DataSourcesPage />;
      case 'reporting-reports':
        return <ReportsPage />;
      case 'reporting-dashboards':
        return <DashboardsPage />;
      case 'reporting-sql':
        return <SQLEditorPage />;
      case 'reporting-columns':
        return <CalculatedColumnsPage />;
      case 'report-builder':
        return <ReportBuilderPage />;
      case 'dashboard-builder':
        return <DashboardBuilderPage />;
      case 'report-view':
        return <ReportViewPage />;
      case 'dashboard-view':
        return <DashboardViewPage />;
      case 'visit-list':
        return <VisitListPage />;
      case 'visit-checkin':
        return <VisitCheckinPage />;
      case 'user-groups':
        return <UserGroupManagementPage />;
      case 'compliance-policies':
        return (<DroolsDesignerPage />)
      default:
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: spacing.lg,
            padding: spacing.xl,
            textAlign: 'center',
          }}>
            <Shield size={80} style={{ color: iconColors.secondary }} />
            <h2 style={{
              color: getSmartTextColor('primary'),
              fontSize: textSizes.heading2,
              fontWeight: '700',
              margin: 0,
            }}>
              {t('common.comingSoon')}
            </h2>
            <p style={{
              color: getSmartTextColor('secondary'),
              maxWidth: '400px',
              fontSize: textSizes.body,
              lineHeight: '1.6',
              margin: 0,
            }}>
              {t('common.moduleUnderDevelopment')}
            </p>
          </div>
        );
    }
  };

  return (
    <div id="NEB01" style={{
      minHeight: '100vh',
      background: colors.gradients.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      transition: 'background 0.3s ease',
      overflow: 'hidden',
      fontSize: textSizes.body,
    }}>
      {/* SUBTLE BACKGROUND EFFECTS */}
      <div id="NEB02" style={{
        position: 'fixed',
        top: '5%',
        left: '5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(74, 45, 133, 0.1) 0%, rgba(106, 64, 152, 0.08) 30%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'galaxyFloat 20s ease-in-out infinite',
        filter: 'blur(1px)',
      }} />

      <div id="NEB03" style={{
        position: 'fixed',
        top: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(106, 64, 152, 0.1) 0%, rgba(74, 45, 133, 0.08) 30%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'galaxyFloat 25s ease-in-out infinite reverse',
        filter: 'blur(1px)',
      }} />

      <div id="NEB04" style={{
        position: 'fixed',
        bottom: '15%',
        left: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(138, 83, 171, 0.1) 0%, rgba(106, 64, 152, 0.08) 30%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'galaxyFloat 30s ease-in-out infinite',
        filter: 'blur(1px)',
      }} />

      <div id="NEB05" style={{
        position: 'fixed',
        bottom: '25%',
        right: '20%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(74, 45, 133, 0.1) 0%, rgba(58, 35, 104, 0.08) 30%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'galaxyFloat 18s ease-in-out infinite reverse',
        filter: 'blur(1px)',
      }} />

      {/* Global Styles with SMART TEXT COLORS AND ICON COLORS */}
      <style>
        {`
          @keyframes galaxyFloat {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.8;
            }
            25% { 
              transform: translateY(-30px) translateX(20px) scale(1.05);
              opacity: 1;
            }
            50% { 
              transform: translateY(-20px) translateX(-15px) scale(0.95);
              opacity: 0.9;
            }
            75% { 
              transform: translateY(10px) translateX(25px) scale(1.02);
              opacity: 0.85;
            }
          }
          
          @keyframes notificationPulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* SMART DYNAMIC TEXT SIZING WITH THEME-AWARE COLORS */
          h1 { 
            font-size: var(--text-heading1, ${textSizes.heading1}) !important; 
            color: ${getSmartTextColor('primary')} !important;
          }
          h2 { 
            font-size: var(--text-heading2, ${textSizes.heading2}) !important; 
            color: ${getSmartTextColor('primary')} !important;
          }
          h3 { 
            font-size: var(--text-heading3, ${textSizes.heading3}) !important; 
            color: ${getSmartTextColor('primary')} !important;
          }
          body, p, span, div { 
            font-size: var(--text-body, ${textSizes.body}) !important; 
            color: ${getSmartTextColor('primary')} !important;
          }
          small, .text-small { 
            font-size: var(--text-small, ${textSizes.small}) !important; 
            color: ${getSmartTextColor('secondary')} !important;
          }
          .text-tiny { 
            font-size: var(--text-tiny, ${textSizes.tiny}) !important; 
            color: ${getSmartTextColor('secondary')} !important;
          }
          
          /* BRAND VIOLET TEXT CLASS */
          .text-violet {
            color: ${getSmartTextColor('violet')} !important;
          }
          
          /* ICON COLOR CLASSES */
          .icon-primary {
            color: var(--icon-color-primary, ${iconColors.primary}) !important;
          }
          .icon-secondary {
            color: var(--icon-color-secondary, ${iconColors.secondary}) !important;
          }
          .icon-accent {
            color: var(--icon-color-accent, ${iconColors.accent}) !important;
          }
          
          /* TILE SIZE CLASSES */
          .app-tile {
            width: var(--tile-width, ${tileSizes.width}) !important;
            height: var(--tile-height, ${tileSizes.height}) !important;
            border-radius: var(--tile-border-radius, ${tileSizes.borderRadius}) !important;
            padding: var(--tile-padding, ${tileSizes.padding}) !important;
          }
          .app-tile svg {
            width: var(--tile-icon-size, ${tileSizes.iconSize}px) !important;
            height: var(--tile-icon-size, ${tileSizes.iconSize}px) !important;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
        `}
      </style>

      {/* Header with Logo, Search, User Info, and Controls */}
      <div id="NEB06" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: `${spacing.xl} ${spacing['2xl']}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border.light}`,
        background: colors.glass.primary,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.xl,
        }}>
          {/* Logo */}
          <div id="NEB07" style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, flexShrink: 0 }}>
            <div id="NEB08" style={{
              width: '56px',
              height: '56px',
              background: 'transparent',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${colors.border.light}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}>
              <img
                id="NEB09"
                src="/Nebula_Logo_H6.svg"
                alt="Nebula Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
                }}
              />
            </div>
            <div id="NEB10">
              <h1 id="NEB11" style={{
                fontSize: textSizes.heading2,
                fontWeight: '800',
                color: getSmartTextColor('violet'), // BRAND VIOLET COLOR
                margin: 0,
              }}>
                Nebula
              </h1>
              <p id="NEB12" style={{
                fontSize: textSizes.small,
                color: getSmartTextColor('secondary'),
                margin: 0,
                fontWeight: '500',
              }}>
                {t('common.platformTitle')}
              </p>
            </div>
          </div>

          {/* Advanced Search Bar */}
          <div id="NEB13" style={{ flex: 1, maxWidth: '500px', minWidth: '300px' }}>
            <AdvancedSearchBar
              minSearchLength={7}
              placeholder={t('common.searchPlaceholder')}
              onResultClick={handleSearchResultClick}
            />
          </div>

          {/* User Info and Controls */}
          <div id="NEB15" style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, flexShrink: 0 }}>
            {/* User Info */}
            <div id="NEB16" style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: `${spacing.md} ${spacing.lg}`,
              background: colors.glass.secondary,
              borderRadius: '12px',
              border: `1px solid ${colors.border.light}`,
              height: '48px',
            }}>
              <div id="NEB17" style={{
                width: '32px',
                height: '32px',
                background: colors.gradients.primary,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={16} style={{ color: 'rgba(255, 255, 255, 0.95)' }} />
              </div>
              <div id="NEB18">
                <div id="NEB19" style={{
                  fontSize: textSizes.small,
                  fontWeight: '600',
                  color: getSmartTextColor('primary'),
                }}>
                  {user?.name}
                </div>
                <div id="NEB20" style={{
                  fontSize: textSizes.tiny,
                  color: getSmartTextColor('secondary'),
                  fontWeight: '500',
                }}>
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div id="NEB21" style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              {/* Notification Button */}
              <div id="NEB22" style={{ position: 'relative' }}>
                <button
                  id="NEB23"
                  onClick={handleNotificationClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    background: colors.glass.primary,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: iconColors.primary,
                    overflow: 'visible',
                  }}
                  title={t('common.notifications')}
                >
                  <Bell size={20} />
                </button>

                {notificationCount > 0 && (
                  <div id="NEB24" style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: colors.gradients.primary, // Using Nebula brand gradient
                    color: 'white',
                    fontSize: textSizes.tiny,
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(74, 45, 133, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.2)', // Using Nebula brand color
                    border: `2px solid ${colors.border.light}`,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    animation: 'notificationPulse 2s ease-in-out infinite',
                    zIndex: 10,
                  }}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Preferences Button */}
              <button
                id="NEB26"
                onClick={() => setIsPreferencesOpen(true)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: colors.glass.primary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: iconColors.primary,
                  overflow: 'hidden',
                }}
                title={t('common.preferences')}
              >
                <Settings size={20} />
              </button>

              {/* Logout Button */}
              <button
                id="NEB27"
                onClick={handleLogout}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: colors.glass.primary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: iconColors.primary,
                  overflow: 'hidden',
                }}
                title={t('common.logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL BREADCRUMB NAVIGATION */}
      {breadcrumbs.length > 0 && (
        <div id="NEB28" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${spacing['2xl']}`,
        }}>
          <BreadcrumbNavigation

            items={breadcrumbs}
            showBackButton={breadcrumbs.length > 1}
            onBackClick={handleBackNavigation}
          />
        </div>
      )}

      {/* Main Content */}
      <div id="NEB30" style={{
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.5s ease-out',
        paddingBottom: dockSettings.position === 'bottom' ? '120px' : '20px',
      }}>
        {renderPage()}
      </div>

      {/* Advanced Customizable Dock */}
      <GlassDock
        items={navItems}
        onItemClick={handleNavClick}
        position={dockSettings.position}
        dockSize={dockSettings.dockSize}
        iconSize={dockSettings.iconSize}
        autoHide={dockSettings.autoHide}
        showLabels={dockSettings.showLabels}
        onSettingsChange={handleDockSettingsChange}
      />

      {/* Preferences Menu */}
      <PreferencesMenu

        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/apps" element={<AppContent />} />
        <Route path="/identity-list" element={<AppContent />} />
        <Route path="/identity/:identityId" element={<AppContent />} />
        <Route path="/ui-designer" element={<AppContent />} />
        <Route path="/model-manager" element={<AppContent />} />
        <Route path="/event-wall" element={<AppContent />} />
        <Route path="/persona" element={<AppContent />} />
        <Route path="/visitors" element={<AppContent />} />
        <Route path="/visitors/checkin/:visitId" element={<AppContent />} />
        <Route path="/visitor-kiosk" element={<AppContent />} />
        <Route path="/events" element={<AppContent />} />
        <Route path="/compliance/policies" element={<AppContent />} />

        <Route path="/user-groups" element={<AppContent />} />

        {/* Reporting Routes */}
        <Route path="/reporting" element={<AppContent />} />
        <Route path="/reporting/data-sources" element={<AppContent />} />
        <Route path="/reporting/reports" element={<AppContent />} />
        <Route path="/reporting/reports/:reportId" element={<AppContent />} />
        <Route path="/reporting/dashboards" element={<AppContent />} />
        <Route path="/reporting/dashboards/:dashboardId" element={<AppContent />} />
        <Route path="/reporting/sql-editor" element={<AppContent />} />
        <Route path="/reporting/calculated-columns" element={<AppContent />} />
        <Route path="/reporting/report-builder" element={<AppContent />} />
        <Route path="/reporting/dashboard-builder" element={<AppContent />} />
        <Route path="/rules/designer" element={<DroolsDesignerPage />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <PreferencesProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </PreferencesProvider>
  );
}

export default App;
