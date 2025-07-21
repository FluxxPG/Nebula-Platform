// English translations for Nebula application
const enTranslation = {
  // Common
  common: {
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh",
    apply: "Apply",
    reset: "Reset",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    clear: "Clear",
    clearAll: "Clear All",
    noResults: "No results found",
    noData: "No data available",
    required: "Required",
    optional: "Optional",
    actions: "Actions",
    status: "Status",
    details: "Details",
    settings: "Settings",
    preferences: "Preferences",
    help: "Help",
    logout: "Sign Out",
    login: "Sign In",
    welcome: "Welcome Back",
    signInTo: "Sign in to access your dashboard",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    passwordStrength: "Password strength",
    demoCredentials: "Demo Credentials",
    poweredBy: "Powered by",
    platformTitle: "Identity & Access Management Platform",
    searchPlaceholder: "Search users, documents, settings...",
    notifications: "Notifications",
    comingSoon: "Coming Soon",
    moduleUnderDevelopment: "This module is currently under development. Check back soon for updates.",
    viewAll: "View All",
    select: "Select"
  },

  // Search
  search: {
    results: "Search Results",
    result: "result",
    found: "Found",
    for: "for",
    noResults: "No results found",
    noResultsFound: "No Results Found",
    couldntFind: "We couldn't find anything matching",
    trySearchingFor: "Try searching for",
    searching: "Searching...",
    lookingThrough: "Looking through users, documents, settings, and more",
    keyboardNavigation: "Use ↑↓ to navigate • Enter to select • Esc to close",
    categories: {
      user: "User",
      document: "Document",
      setting: "Setting",
      event: "Event",
      security: "Security",
      department: "Department"
    },
    suggestions: {
      users: "User names or departments",
      documents: "Document titles",
      settings: "Settings or configurations",
      events: "Events or meetings"
    }
  },

  // Navigation
  nav: {
    home: "Home",
    persona: "Persona",
    visitors: "Visitors",
    eventCockpit: "Event Cockpit",
    reporting: "Reporting",
    appLibrary: "App Library",
    backTo: "Back to {{destination}}",
    dockPreferences: "Dock Preferences"
  },

  // Home Page
  home: {
    welcome: "Welcome to Nebula",
    subtitle: "Your comprehensive identity and access management platform",
    analytics: "Analytics",
    securityCenter: "Security Center",
    quickActions: "Quick Actions",
    addIdentity: "Add Identity",
    registerVisitor: "Register Visitor",
    securityAudit: "Security Audit",
    scheduleEvent: "Schedule Event",
    recentActivity: "Recent Activity",
    systemHealth: {
      title: "System Health",
      serverPerformance: "Server Performance",
      databaseHealth: "Database Health",
      securityScore: "Security Score"
    },
    stats: {
      totalIdentities: "Total Identities",
      activeSessions: "Active Sessions",
      todaysVisitors: "Today's Visitors",
      securityAlerts: "Security Alerts"
    }
  },

  // App Library
  appLibrary: {
    title: "App Library",
    subtitle: "Explore and access all available applications",
    categories: {
      identityAccess: "Identity & Access",
      visitorManagement: "Visitor Management",
      contractorManagement: "Contractor Management",
      securityAnalytics: "Security Analytics",
      auditCompliance: "Audit & Compliance",
      mobileAccess: "Mobile Access",
      uiDesigner: "UI Designer",
      favorites: "Favorites"
    }
  },

  // Identity Management
  identity: {
    list: {
      title: "Identity Management",
      subtitle: "Manage and monitor all identities in your organization",
      addIdentity: "Add Identity",
      importIdentities: "Import Identities",
      exportIdentities: "Export Identities"
    },
    detail: {
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      employmentInfo: "Employment Information",
      accessCards: "Access Cards",
      permissions: "Permissions",
      accessHistory: "Access History",
      status: {
        active: "Active",
        inactive: "Inactive",
        pending: "Pending",
        expired: "Expired"
      }
    },
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      department: "Department",
      position: "Position",
      employeeId: "Employee ID",
      joinDate: "Join Date",
      lastLogin: "Last Login",
      accessLevel: "Access Level",
      location: "Location",
      manager: "Manager"
    },
    userGroups: {
      title: "User Group Management"
    }
  },

  // Visitor Management
  visitors: {
    title: "Visit Management",
    subtitle: "Manage and track all visitor check-ins and check-outs",
    newVisit: "New Visit",
    checkIn: {
      title: "Visitor Check-in",
      subtitle: "Complete the check-in process for the scheduled visit",
      visitDetails: "Visit Details",
      checkInInfo: "Check-in Information",
      idAndCard: "ID and Card Information",
      accessZones: "Access Zones",
      visitorPhoto: "Visitor Photo",
      cardNumber: "Card Number",
      idProofType: "ID Proof Type",
      idProofNumber: "ID Proof Number",
      selectAccessZones: "Select Access Zones",
      selectedZones: "Selected Zones",
      escortRequired: "Escort Required",
      escortAssigned: "Escort Assigned",
      escortRequiredWarning: "One or more selected zones require an escort, but no escort is assigned to this visit.",
      escortAssignedInfo: "{{escort}} will escort the visitor to restricted areas.",
      completeCheckIn: "Complete Check-in",
      success: "Check-in Successful",
      visitorCheckedIn: "{{visitor}} has been checked in for their visit with {{host}}."
    },
    kiosk: {
      title: "Visitor Kiosk"
    },
    fields: {
      visitor: "Visitor",
      host: "Host",
      escort: "Escort",
      startDate: "Start Date",
      endDate: "End Date",
      type: "Type",
      status: "Status",
      description: "Description",
      createdAt: "Created At",
      updatedAt: "Last Updated",
      peopleInfo: "People Information",
      visitInfo: "Visit Information",
      visitSchedule: "Visit Schedule"
    },
    status: {
      scheduled: "Scheduled",
      checkedIn: "Checked In",
      checkedOut: "Checked Out",
      cancelled: "Cancelled"
    },
    types: {
      business: "Business",
      interview: "Interview",
      personal: "Personal",
      vendor: "Vendor",
      contractor: "Contractor",
      other: "Other"
    },
    actions: {
      checkIn: "Check In",
      checkOut: "Check Out",
      viewDetails: "View Details",
      cancel: "Cancel Visit"
    }
  },

  // Event Wall
  eventWall: {
    title: "Event Wall",
    subtitle: "Monitor and manage security events across all access control systems",
    unacknowledged: "Unacknowledged",
    acknowledged: "Acknowledged",
    priority: {
      red: "Red Priority",
      amber: "Amber Priority",
      blue: "Blue Priority"
    },
    stackBy: {
      title: "Stack Events By:",
      none: "No Stacking",
      priority: "By Priority",
      location: "By Location",
      building: "By Building"
    },
    filters: {
      title: "Priority Filters:",
      timeRange: "Time Range:"
    },
    building: "Building",
    floor: "Floor",
    eventDetails: "Event Details",
    acknowledgeEvent: "Acknowledge Event",
    acknowledgeConfirm: "Are you sure you want to acknowledge this event?",
    acknowledgeInfo: "Acknowledging this event will mark it as handled and move it to the acknowledged events list.",
    confirmAcknowledgement: "Confirm Acknowledgement",
    noEvents: "No Events Found",
    noEventsDesc: "No events match your current filters. Try adjusting your search criteria or filters."
  },

  // UI Designer
  uiDesigner: {
    title: "UI Designer",
    subtitle: "Create and customize forms with drag-and-drop widgets, validation rules, and data binding",
    designName: "Design name...",
    saved: "Saved",
    unsaved: "Unsaved",
    widgets: "widgets",
    model: "Model",
    selectModel: "Select Model",
    load: "Load",
    preview: "Preview",
    design: "Design",
    submitForm: "Submit Form",
    saveDesign: "Save Design",
    formSubmitted: "Form submitted successfully!",
    formSubmittedDesc: "The form data has been saved and validated without errors.",
    validationErrors: "Please fix the following validation errors:",
    designCanvas: "Design Canvas",
    formPreview: "Form Preview",
    noWidgets: "No Widgets Added",
    startBuilding: "Start Building Your Form",
    noFormPreview: "No Form to Preview",
    switchToDesign: "Switch to design mode to create your form first.",
    dragWidgets: "Drag widgets from the library to create your custom form. You can add input fields, display elements, and layout components."
  },

  // Model Manager
  modelManager: {
    title: "JSON Model Manager",
    subtitle: "Create and manage JSON data models for your UI components",
    importModel: "Import Model",
    createModel: "Create Model",
    modelName: "Model Name",
    description: "Description",
    jsonSchema: "JSON Schema",
    schemaPreview: "Schema Preview",
    noModels: "No Models Created Yet",
    noModelsDesc: "Create your first JSON model to define data structures for your UI components. Models can be used to bind form fields and validate data.",
    createFirstModel: "Create Your First Model",
    saveModel: "Save Model",
    viewDetails: "View details",
    editModel: "Edit model",
    exportModel: "Export model",
    deleteModel: "Delete model",
    modelDetails: "Model Details",
    modelInfo: "Model Information",
    name: "Name",
    version: "Version",
    created: "Created",
    updated: "Updated"
  },

  // Reporting
  reporting: {
    title: "Audit & Compliance Reporting",
    subtitle: "Create, manage, and analyze reports and dashboards for audit and compliance purposes",
    createNew: "Create New",
    dataSources: {
      title: "Data Sources",
      subtitle: "Explore and manage data sources for reporting and analytics",
      schemaPreview: "Schema Preview",
      preview: "Preview",
      sqlEditor: "SQL Editor",
      createReport: "Create Report"
    },
    reports: {
      title: "Reports",
      subtitle: "Create, manage, and analyze reports for audit and compliance purposes",
      createReport: "Create Report",
      reportInfo: "Report Information",
      dataSource: "Data Source",
      visualizations: "Visualizations",
      addVisualization: "Add Visualization",
      noVisualizations: "No Visualizations Added",
      addFirstVisualization: "Add Your First Visualization",
      visualizationName: "Visualization Name",
      visualizationType: "Visualization Type",
      dimensions: "Dimensions",
      metrics: "Metrics",
      selectDimension: "Select dimension",
      selectMetric: "Select metric",
      addDimension: "Add Dimension",
      addMetric: "Add Metric",
      positionAndSize: "Position and Size",
      saveReport: "Save Report",
      previewReport: "Preview Report"
    },
    dashboards: {
      title: "Dashboards",
      subtitle: "Create, manage, and analyze dashboards for audit and compliance purposes",
      createDashboard: "Create Dashboard",
      dashboardInfo: "Dashboard Information",
      dashboardLayout: "Dashboard Layout",
      addWidget: "Add Widget",
      noWidgets: "No Widgets Added",
      addFirstWidget: "Add Your First Widget",
      widgetType: "Widget Type",
      widgetTitle: "Widget Title",
      report: "Report",
      visualization: "Visualization",
      content: "Content",
      saveDashboard: "Save Dashboard",
      previewDashboard: "Preview Dashboard"
    },
    sqlEditor: {
      title: "SQL Editor",
      subtitle: "Write and execute custom SQL queries for advanced reporting and analysis",
      help: "Help",
      saveQuery: "Save Query",
      selectDataSource: "Select Data Source",
      sqlQuery: "SQL Query",
      format: "Format",
      copy: "Copy",
      clear: "Clear",
      executeQuery: "Execute Query",
      queryResults: "Query Results",
      rows: "rows",
      columns: "columns",
      export: "Export",
      queryName: "Query Name",
      gettingStarted: "Getting Started",
      gettingStartedDesc: "The SQL Editor allows you to write and execute custom SQL queries against your data sources. Follow these steps to get started:",
      availableDataSources: "Available Data Sources",
      sqlTips: "SQL Tips"
    },
    calculatedColumns: {
      title: "Calculated Columns",
      subtitle: "Create and manage calculated columns for your reports",
      addColumn: "Add Column",
      columnName: "Column Name",
      displayName: "Display Name",
      formula: "Formula",
      noCalculatedColumns: "No Calculated Columns Found",
      noCalculatedColumnsDesc: "Create your first calculated column to enhance your reports.",
      addFirstColumn: "Add Your First Column"
    }
  },

  // Preferences
  preferences: {
    title: "Customize Your Experience",
    subtitle: "Personalize Nebula with live preview - changes apply instantly",
    appearance: {
      title: "Appearance",
      themeMode: "Theme Mode",
      lightMode: "Light mode active",
      darkMode: "Dark mode active",
      iconColors: "Icon Colors"
    },
    typography: {
      title: "Typography",
      titleSize: "Title Size",
      textSize: "Text Size"
    },
    layout: {
      title: "Layout & Sizing",
      appTileSize: "App Tile Size",
      iconSize: "Icon Size"
    },
    options: {
      title: "Options",
      autoHideDock: "Auto-hide dock",
      showTooltips: "Show tooltips"
    },
    currentSettings: "Current Settings Overview",
    resetAll: "Reset All"
  },

  // Status
  status: {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    expired: "Expired",
    warning: "Warning",
    success: "Success",
    error: "Error",
    info: "Info",
    lost: "Lost",
    scheduled: "Scheduled",
    checkedIn: "Checked In",
    checkedOut: "Checked Out",
    cancelled: "Cancelled",
    completed: "Completed",
    inProgress: "In Progress"
  }
};

export default enTranslation;
