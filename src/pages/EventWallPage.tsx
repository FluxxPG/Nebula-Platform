import React, { useState, useEffect, useMemo } from 'react';
import { 
  List, 
  Grid3X3, 
  Map, 
  Filter, 
  Bell, 
  BellOff, 
  CheckSquare, 
  LogOut,
  FileText,
  User,
  Users,
  Building as BuildingIcon,
  Tag,
  ArrowUpDown,
  AlertTriangle,
  Info,
  Shield,
  Clock,
  Calendar,
  Search,
  Layers,
  RefreshCw,
  MapPin,
  BarChart2
} from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { 
  GlassButton, 
  GlassCard, 
  GlassInput, 
  GlassDataTable, 
  GlassStatusBadge,
  GlassDropdown,
  GlassModal,
  GlassListControl
} from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useAppearance } from '../ui/hooks/useAppearance';
import { spacing, borderRadius, shadows } from '../ui';
import { mockSecurityEvents, mockBuildings, type SecurityEvent, type Building, type Floor } from '../data/mockData';

type ViewMode = 'list' | 'card' | 'map';
type EventFilter = 'all' | 'unacknowledged' | 'acknowledged';
type SortOption = 'date' | 'priority' | 'location' | 'type';
type SortDirection = 'asc' | 'desc';
type StackingMode = 'none' | 'priority' | 'location' | 'building';

export const EventWallPage: React.FC = () => {
  const colors = useThemeColors();
  const { iconColors } = useAppearance();
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [eventFilter, setEventFilter] = useState<EventFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [stackingMode, setStackingMode] = useState<StackingMode>('none');
  
  // Get available buildings from mock data
  const buildings = useMemo(() => mockBuildings, []);
  
  // Update available floors when building selection changes
  useEffect(() => {
    if (selectedBuilding) {
      const building = buildings.find(b => b.id === selectedBuilding);
      if (building) {
        setFloors(building.floors);
        if (building.floors.length > 0) {
          setSelectedFloor(building.floors[0].id);
        } else {
          setSelectedFloor(null);
        }
      }
    } else {
      setFloors([]);
      setSelectedFloor(null);
    }
  }, [selectedBuilding, buildings]);
  
  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    // Filter by acknowledgement status
    if (eventFilter === 'acknowledged') {
      filtered = filtered.filter(event => event.acknowledged);
    } else if (eventFilter === 'unacknowledged') {
      filtered = filtered.filter(event => !event.acknowledged);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.id.toLowerCase().includes(lowerSearchTerm) ||
        event.eventType.toLowerCase().includes(lowerSearchTerm) ||
        event.deviceName.toLowerCase().includes(lowerSearchTerm) ||
        event.location.toLowerCase().includes(lowerSearchTerm) ||
        event.building.toLowerCase().includes(lowerSearchTerm) ||
        event.floor.toLowerCase().includes(lowerSearchTerm) ||
        event.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Filter by building and floor
    if (selectedBuilding) {
      filtered = filtered.filter(event => event.building === buildings.find(b => b.id === selectedBuilding)?.name);
      
      if (selectedFloor) {
        const floor = floors.find(f => f.id === selectedFloor);
        if (floor) {
          filtered = filtered.filter(event => event.floor === floor.name);
        }
      }
    }
    
    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'Red': 0, 'Amber': 1, 'Blue': 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'type':
          comparison = a.eventType.localeCompare(b.eventType);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [events, eventFilter, searchTerm, sortBy, sortDirection, selectedBuilding, selectedFloor, buildings, floors]);
  
  // Group events by stacking mode
  const stackedEvents = useMemo(() => {
    if (stackingMode === 'none') {
      return { 'All Events': filteredEvents };
    }
    
    const grouped: Record<string, SecurityEvent[]> = {};
    
    switch (stackingMode) {
      case 'priority':
        // Group by priority (Red, Amber, Blue)
        filteredEvents.forEach(event => {
          const key = `${event.priority} Priority`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(event);
        });
        
        // Ensure specific order for priorities
        const orderedGroups: Record<string, SecurityEvent[]> = {};
        ['Red Priority', 'Amber Priority', 'Blue Priority'].forEach(priority => {
          if (grouped[priority]) {
            orderedGroups[priority] = grouped[priority];
          }
        });
        
        return orderedGroups;
        
      case 'location':
        // Group by location
        filteredEvents.forEach(event => {
          if (!grouped[event.location]) {
            grouped[event.location] = [];
          }
          grouped[event.location].push(event);
        });
        return grouped;
        
      case 'building':
        // Group by building
        filteredEvents.forEach(event => {
          if (!grouped[event.building]) {
            grouped[event.building] = [];
          }
          grouped[event.building].push(event);
        });
        return grouped;
        
      default:
        return { 'All Events': filteredEvents };
    }
  }, [filteredEvents, stackingMode]);
  
  // Handle event acknowledgement
  const handleAcknowledgeEvent = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setIsAcknowledgeModalOpen(true);
  };
  
  const confirmAcknowledge = () => {
    if (selectedEvent) {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { 
              ...event, 
              acknowledged: true, 
              acknowledgedBy: 'Current User', 
              acknowledgedAt: new Date().toISOString() 
            } 
          : event
      );
      
      setEvents(updatedEvents);
      setIsAcknowledgeModalOpen(false);
      setSelectedEvent(null);
    }
  };
  
  // Handle event selection for details view
  const handleEventClick = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      // In a real app, this would fetch fresh data from the server
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Table columns for list view
  const columns = [
    { 
      key: 'id', 
      label: 'Event ID', 
      sortable: true,
      width: '120px',
    },
    { 
      key: 'eventDate', 
      label: 'Date & Time', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      sortable: true,
      render: (value: 'Red' | 'Amber' | 'Blue') => {
        const statusMap = {
          'Red': 'error',
          'Amber': 'warning',
          'Blue': 'info'
        };
        return <GlassStatusBadge status={statusMap[value] as any} label={value} />;
      }
    },
    { 
      key: 'eventType', 
      label: 'Event Type', 
      sortable: true,
    },
    { 
      key: 'deviceName', 
      label: 'Device', 
      sortable: true,
    },
    { 
      key: 'location', 
      label: 'Location', 
      sortable: true,
    },
    { 
      key: 'building', 
      label: 'Building', 
      sortable: true,
    },
    { 
      key: 'floor', 
      label: 'Floor', 
      sortable: true,
    },
    { 
      key: 'acknowledged', 
      label: 'Status', 
      sortable: true,
      render: (value: boolean) => 
        value 
          ? <GlassStatusBadge status="success" label="Acknowledged" /> 
          : <GlassStatusBadge status="warning" label="Unacknowledged" />
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (_: any, row: SecurityEvent) => (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          {!row.acknowledged && (
            <GlassButton 
              variant="success" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAcknowledgeEvent(row);
              }}
            >
              <CheckSquare size={16} />
            </GlassButton>
          )}
        </div>
      )
    }
  ];
  
  // Render event card for card view
  const renderEventCard = (event: SecurityEvent) => {
    const priorityColors = {
      'Red': colors.gradients.error,
      'Amber': colors.gradients.warning,
      'Blue': colors.gradients.info
    };
    
    const priorityIcons = {
      'Red': <AlertTriangle size={24} style={{ color: 'white' }} />,
      'Amber': <AlertTriangle size={24} style={{ color: 'white' }} />,
      'Blue': <Info size={24} style={{ color: 'white' }} />
    };
    
    return (
      <GlassCard 
        key={event.id}
        hoverable
        onClick={() => handleEventClick(event)}
        className="event-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.xs} ${spacing.sm}`,
            background: priorityColors[event.priority],
            borderRadius: borderRadius.md,
            color: 'white',
            fontWeight: '700',
          }}>
            {priorityIcons[event.priority]}
            <span>{event.priority} Priority</span>
          </div>
          
          <GlassStatusBadge 
            status={event.acknowledged ? "success" : "warning"} 
            label={event.acknowledged ? "Acknowledged" : "Unacknowledged"} 
          />
        </div>
        
        <div style={{ marginBottom: spacing.lg }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            marginBottom: spacing.xs,
            color: colors.text.primary
          }}>
            {event.eventType}
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: colors.text.secondary,
            marginBottom: spacing.md
          }}>
            {event.description}
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: spacing.md,
          fontSize: '0.875rem',
          marginBottom: spacing.lg
        }}>
          <div>
            <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs }}>
              Event ID
            </div>
            <div style={{ color: colors.text.primary }}>
              {event.id}
            </div>
          </div>
          
          <div>
            <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs }}>
              Date & Time
            </div>
            <div style={{ color: colors.text.primary }}>
              {new Date(event.eventDate).toLocaleString()}
            </div>
          </div>
          
          <div>
            <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs }}>
              Device
            </div>
            <div style={{ color: colors.text.primary }}>
              {event.deviceName}
            </div>
          </div>
          
          <div>
            <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs }}>
              Location
            </div>
            <div style={{ color: colors.text.primary }}>
              {event.location}
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${spacing.sm} ${spacing.md}`,
          background: colors.glass.secondary,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <BuildingIcon size={16} style={{ color: iconColors.secondary }} />
            <span style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
              {event.building} • {event.floor}
            </span>
          </div>
        </div>
        
        {!event.acknowledged && (
          <GlassButton 
            variant="success" 
            onClick={(e) => {
              e.stopPropagation();
              handleAcknowledgeEvent(event);
            }}
            style={{ width: '100%' }}
          >
            <CheckSquare size={16} style={{ marginRight: spacing.sm }} />
            Acknowledge Event
          </GlassButton>
        )}
      </GlassCard>
    );
  };
  
  // Render stacked events for card view
  const renderStackedEvents = () => {
    const stackingIcons = {
      'priority': {
        'Red Priority': <AlertTriangle size={24} style={{ color: '#ef4444' }} />,
        'Amber Priority': <AlertTriangle size={24} style={{ color: '#f59e0b' }} />,
        'Blue Priority': <Info size={24} style={{ color: '#3b82f6' }} />,
      },
      'location': {
        default: <MapPin size={24} style={{ color: iconColors.primary }} />
      },
      'building': {
        default: <BuildingIcon size={24} style={{ color: iconColors.primary }} />
      },
      'none': {
        default: <BarChart2 size={24} style={{ color: iconColors.primary }} />
      }
    };
    
    const getStackIcon = (stackKey: string) => {
      if (stackingMode === 'priority') {
        return stackingIcons.priority[stackKey as keyof typeof stackingIcons.priority] || stackingIcons.priority['Blue Priority'];
      } else if (stackingMode === 'location') {
        return stackingIcons.location.default;
      } else if (stackingMode === 'building') {
        return stackingIcons.building.default;
      } else {
        return stackingIcons.none.default;
      }
    };
    
    const getStackColor = (stackKey: string) => {
      if (stackingMode === 'priority') {
        if (stackKey === 'Red Priority') return '#ef4444';
        if (stackKey === 'Amber Priority') return '#f59e0b';
        if (stackKey === 'Blue Priority') return '#3b82f6';
      }
      return colors.text.primary;
    };
    
    return Object.entries(stackedEvents).map(([stackKey, stackEvents]) => (
      <div key={stackKey} style={{ marginBottom: spacing['3xl'] }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: spacing.md,
          marginBottom: spacing.xl,
          padding: spacing.lg,
          background: colors.glass.primary,
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.border.light}`,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: colors.glass.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${colors.border.light}`,
          }}>
            {getStackIcon(stackKey)}
          </div>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: getStackColor(stackKey),
              margin: 0,
              marginBottom: spacing.xs,
            }}>
              {stackKey}
            </h2>
            <div style={{ 
              fontSize: '0.875rem', 
              color: colors.text.secondary,
              fontWeight: '500',
            }}>
              {stackEvents.length} event{stackEvents.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="event-grid">
          {stackEvents.map(event => renderEventCard(event))}
        </div>
      </div>
    ));
  };
  
  // Render floor map view
  const renderFloorMap = () => {
    if (!selectedBuilding || !selectedFloor) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: spacing['3xl'],
          textAlign: 'center',
          color: colors.text.secondary
        }}>
          <Map size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: colors.text.primary, 
            marginBottom: spacing.lg 
          }}>
            Select a Building and Floor
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            maxWidth: '500px', 
            margin: '0 auto' 
          }}>
            Please select a building and floor from the dropdown menus above to view the floor map.
          </p>
        </div>
      );
    }
    
    const building = buildings.find(b => b.id === selectedBuilding);
    const floor = building?.floors.find(f => f.id === selectedFloor);
    
    if (!floor) return null;
    
    // Filter events for this floor
    const floorEvents = filteredEvents.filter(
      event => event.building === building?.name && event.floor === floor.name
    );
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '700px', overflow: 'hidden' }}>
        {/* Floor Map Image */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: colors.glass.primary,
          borderRadius: borderRadius.xl,
          overflow: 'hidden',
        }}>
          <img 
            src={floor.mapImage} 
            alt={`${building?.name} - ${floor.name} Floor Plan`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.7,
            }}
          />
          
          {/* Event Markers */}
          {floorEvents.map(event => {
            const priorityColors = {
              'Red': '#ef4444',
              'Amber': '#f59e0b',
              'Blue': '#3b82f6'
            };
            
            return (
              <div 
                key={event.id}
                style={{
                  position: 'absolute',
                  top: `${event.coordinates?.y || 0}px`,
                  left: `${event.coordinates?.x || 0}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: priorityColors[event.priority],
                  border: '2px solid white',
                  boxShadow: `0 0 0 4px ${priorityColors[event.priority]}40, 0 0 20px ${priorityColors[event.priority]}80`,
                  cursor: 'pointer',
                  zIndex: 10,
                  animation: 'pulse 2s infinite',
                }}
                onClick={() => handleEventClick(event)}
                title={event.eventType}
              />
            );
          })}
          
          {/* Device Markers */}
          {floor.devices.map(device => (
            <div 
              key={device.id}
              style={{
                position: 'absolute',
                top: `${device.coordinates.y}px`,
                left: `${device.coordinates.x}px`,
                transform: 'translate(-50%, -50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: device.status === 'online' ? '#10b981' : device.status === 'offline' ? '#ef4444' : '#f59e0b',
                border: '1px solid white',
                cursor: 'pointer',
                zIndex: 5,
              }}
              title={`${device.name} (${device.type}) - ${device.status}`}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: spacing.lg,
          right: spacing.lg,
          background: colors.glass.primary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border.light}`,
          boxShadow: shadows.glass,
          zIndex: 20,
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: spacing.md, color: colors.text.primary }}>
            Legend
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', border: '1px solid white' }} />
              <span style={{ fontSize: '0.75rem', color: colors.text.secondary }}>Red Priority Event</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', border: '1px solid white' }} />
              <span style={{ fontSize: '0.75rem', color: colors.text.secondary }}>Amber Priority Event</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', border: '1px solid white' }} />
              <span style={{ fontSize: '0.75rem', color: colors.text.secondary }}>Blue Priority Event</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '1px solid white' }} />
              <span style={{ fontSize: '0.75rem', color: colors.text.secondary }}>Online Device</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '1px solid white' }} />
              <span style={{ fontSize: '0.75rem', color: colors.text.secondary }}>Offline Device</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render event details for modal
  const renderEventDetails = (event: SecurityEvent) => {
    const priorityColors = {
      'Red': colors.gradients.error,
      'Amber': colors.gradients.warning,
      'Blue': colors.gradients.info
    };
    
    return (
      <div style={{ padding: spacing.lg }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: spacing.xl
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.xs} ${spacing.md}`,
            background: priorityColors[event.priority],
            borderRadius: borderRadius.md,
            color: 'white',
            fontWeight: '700',
          }}>
            <AlertTriangle size={20} />
            <span>{event.priority} Priority</span>
          </div>
          
          <GlassStatusBadge 
            status={event.acknowledged ? "success" : "warning"} 
            label={event.acknowledged ? "Acknowledged" : "Unacknowledged"} 
            size="lg"
          />
        </div>
        
        <div style={{ marginBottom: spacing.xl }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            marginBottom: spacing.md,
            color: colors.text.primary
          }}>
            {event.eventType}
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            color: colors.text.secondary,
            lineHeight: '1.6',
            marginBottom: spacing.lg
          }}>
            {event.description}
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <div style={{ 
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.sm,
              marginBottom: spacing.md,
              color: colors.text.primary,
              fontWeight: '700'
            }}>
              <Info size={18} style={{ color: iconColors.primary }} />
              <span>Event Details</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              <div>
                <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                  Event ID
                </div>
                <div style={{ color: colors.text.primary }}>
                  {event.id}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                  Device
                </div>
                <div style={{ color: colors.text.primary }}>
                  {event.deviceName}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.sm,
              marginBottom: spacing.md,
              color: colors.text.primary,
              fontWeight: '700'
            }}>
              <Clock size={18} style={{ color: iconColors.primary }} />
              <span>Time Information</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
              <div>
                <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                  Event Date & Time
                </div>
                <div style={{ color: colors.text.primary }}>
                  {new Date(event.eventDate).toLocaleString()}
                </div>
              </div>
              
              {event.acknowledged && (
                <div>
                  <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                    Acknowledged At
                  </div>
                  <div style={{ color: colors.text.primary }}>
                    {event.acknowledgedAt ? new Date(event.acknowledgedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            padding: spacing.lg,
            background: colors.glass.secondary,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.light}`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.sm,
              marginBottom: spacing.md,
              color: colors.text.primary,
              fontWeight: '700'
            }}>
              <BuildingIcon size={18} style={{ color: iconColors.primary }} />
              <span>Location Information</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
              <div>
                <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                  Location
                </div>
                <div style={{ color: colors.text.primary }}>
                  {event.location}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                  Building & Floor
                </div>
                <div style={{ color: colors.text.primary }}>
                  {event.building} • {event.floor}
                </div>
              </div>
            </div>
          </div>
          
          {event.acknowledged && (
            <div style={{ 
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.border.light}`
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: spacing.sm,
                marginBottom: spacing.md,
                color: colors.text.primary,
                fontWeight: '700'
              }}>
                <Shield size={18} style={{ color: iconColors.primary }} />
                <span>Acknowledgement</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.md }}>
                <div>
                  <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                    Acknowledged By
                  </div>
                  <div style={{ color: colors.text.primary }}>
                    {event.acknowledgedBy || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: '600', color: colors.text.secondary, marginBottom: spacing.xs, fontSize: '0.875rem' }}>
                    Acknowledged At
                  </div>
                  <div style={{ color: colors.text.primary }}>
                    {event.acknowledgedAt ? new Date(event.acknowledgedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!event.acknowledged && (
          <GlassButton 
            variant="success" 
            onClick={() => {
              setIsEventModalOpen(false);
              handleAcknowledgeEvent(event);
            }}
            style={{ width: '100%' }}
          >
            <CheckSquare size={20} style={{ marginRight: spacing.md }} />
            Acknowledge This Event
          </GlassButton>
        )}
      </div>
    );
  };
  
  // Render event card for data table preview
  const renderEventPreview = (event: SecurityEvent) => {
    return renderEventDetails(event);
  };
  
  return (
    <PageLayout
      title="Event Wall"
      subtitle="Monitor and manage security events across all access control systems"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton 
            variant={eventFilter === 'unacknowledged' ? 'primary' : 'ghost'} 
            onClick={() => setEventFilter(eventFilter === 'unacknowledged' ? 'all' : 'unacknowledged')}
          >
            <Bell size={18} style={{ marginRight: spacing.sm }} />
            Unacknowledged ({events.filter(e => !e.acknowledged).length})
          </GlassButton>
          
          <GlassButton 
            variant={eventFilter === 'acknowledged' ? 'primary' : 'ghost'} 
            onClick={() => setEventFilter(eventFilter === 'acknowledged' ? 'all' : 'acknowledged')}
          >
            <BellOff size={18} style={{ marginRight: spacing.sm }} />
            Acknowledged ({events.filter(e => e.acknowledged).length})
          </GlassButton>
          
          <GlassButton 
            variant="ghost" 
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            <RefreshCw size={18} style={{ marginRight: spacing.sm }} />
            Refresh
          </GlassButton>
        </div>
      }
    >
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
          
          .event-card {
            transition: all 0.3s ease;
          }
          
          .event-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .priority-red {
            background: ${colors.gradients.error} !important;
            animation: pulse 2s infinite;
          }
          
          .priority-amber {
            background: ${colors.gradients.warning} !important;
          }
          
          .priority-blue {
            background: ${colors.gradients.info} !important;
          }
          
          .event-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: ${spacing.xl};
          }
          
          .stacking-button {
            transition: all 0.2s ease;
          }
          
          .stacking-button:hover {
            transform: translateY(-2px);
          }
          
          .stacking-button.active {
            background: ${colors.gradients.primary} !important;
            color: white !important;
            box-shadow: ${shadows.glassHover} !important;
          }
          
          .stacking-section {
            margin-bottom: ${spacing['3xl']};
            animation: fadeIn 0.5s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @media (max-width: 768px) {
            .event-grid {
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            }
          }
          
          @media (max-width: 480px) {
            .event-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      
      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: spacing.xl,
        marginBottom: spacing.xl
      }}>
        {/* View Mode and Search */}
        <GlassListControl
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search events, devices, locations..."
          sortBy={sortBy}
          sortOrder={sortDirection}
          onSortChange={(sort, order) => {
            setSortBy(sort as SortOption);
            setSortDirection(order);
          }}
          sortOptions={[
            { value: 'date', label: 'Date & Time' },
            { value: 'priority', label: 'Priority' },
            { value: 'location', label: 'Location' },
            { value: 'type', label: 'Event Type' }
          ]}
          totalItems={events.length}
          filteredItems={filteredEvents.length}
          onRefresh={handleRefresh}
          showPreview={true}
          onPreviewItem={renderEventPreview}
        />
        
        {/* Stacking Controls - Only show in card view */}
        {viewMode === 'card' && (
          <div style={{
            display: 'flex',
            gap: spacing.md,
            padding: spacing.xl,
            background: colors.glass.primary,
            borderRadius: borderRadius.xl,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.sm,
              color: colors.text.primary,
              fontWeight: '600',
              fontSize: '0.875rem',
              marginRight: spacing.lg,
            }}>
              <BarChart2 size={18} style={{ color: iconColors.primary }} />
              <span>Stack Events By:</span>
            </div>
            
            <GlassButton
              variant={stackingMode === 'none' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStackingMode('none')}
              className={`stacking-button ${stackingMode === 'none' ? 'active' : ''}`}
            >
              <LayoutGrid size={16} style={{ marginRight: spacing.sm }} />
              No Stacking
            </GlassButton>
            
            <GlassButton
              variant={stackingMode === 'priority' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStackingMode('priority')}
              className={`stacking-button ${stackingMode === 'priority' ? 'active' : ''}`}
            >
              <AlertTriangle size={16} style={{ marginRight: spacing.sm }} />
              By Priority
            </GlassButton>
            
            <GlassButton
              variant={stackingMode === 'location' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStackingMode('location')}
              className={`stacking-button ${stackingMode === 'location' ? 'active' : ''}`}
            >
              <MapPin size={16} style={{ marginRight: spacing.sm }} />
              By Location
            </GlassButton>
            
            <GlassButton
              variant={stackingMode === 'building' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setStackingMode('building')}
              className={`stacking-button ${stackingMode === 'building' ? 'active' : ''}`}
            >
              <BuildingIcon size={16} style={{ marginRight: spacing.sm }} />
              By Building
            </GlassButton>
          </div>
        )}
        
        {/* Building and Floor Selection (for Map View) */}
        {viewMode === 'map' && (
          <div style={{
            display: 'flex',
            gap: spacing.xl,
            padding: spacing.xl,
            background: colors.glass.primary,
            borderRadius: borderRadius.xl,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: spacing.sm,
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Building
              </label>
              <GlassDropdown
                options={buildings.map(building => ({
                  value: building.id,
                  label: building.name
                }))}
                value={selectedBuilding || ''}
                onChange={setSelectedBuilding}
                placeholder="Select building"
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: spacing.sm,
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Floor
              </label>
              <GlassDropdown
                options={floors.map(floor => ({
                  value: floor.id,
                  label: floor.name
                }))}
                value={selectedFloor || ''}
                onChange={setSelectedFloor}
                placeholder="Select floor"
                disabled={!selectedBuilding || floors.length === 0}
              />
            </div>
          </div>
        )}
        
        {/* Priority Filters */}
        <div style={{
          display: 'flex',
          gap: spacing.md,
          padding: spacing.lg,
          background: colors.glass.primary,
          borderRadius: borderRadius.xl,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          flexWrap: 'wrap',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.sm,
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: '0.875rem',
          }}>
            <Layers size={18} style={{ color: iconColors.primary }} />
            <span>Priority Filters:</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: spacing.sm,
            flex: 1,
            flexWrap: 'wrap',
          }}>
            <GlassButton
              variant="error"
              size="sm"
            >
              Red ({events.filter(e => e.priority === 'Red').length})
            </GlassButton>
            
            <GlassButton
              variant="warning"
              size="sm"
            >
              Amber ({events.filter(e => e.priority === 'Amber').length})
            </GlassButton>
            
            <GlassButton
              variant="info"
              size="sm"
            >
              Blue ({events.filter(e => e.priority === 'Blue').length})
            </GlassButton>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.sm,
            color: colors.text.primary,
            fontWeight: '600',
            fontSize: '0.875rem',
          }}>
            <Calendar size={18} style={{ color: iconColors.primary }} />
            <span>Time Range:</span>
          </div>
          
          <GlassDropdown
            options={[
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'custom', label: 'Custom Range' },
            ]}
            value="today"
            placeholder="Select time range"
          />
        </div>
      </div>
      
      {/* Event Display */}
      <div style={{ marginBottom: spacing.xl }}>
        {viewMode === 'list' && (
          <GlassDataTable
            data={filteredEvents}
            columns={columns}
            onRowClick={handleEventClick}
            searchable={false} // We're using the GlassListControl for search
            pagination={true}
            pageSize={10}
            showPageSizeSelector={true}
            showColumnToggle={true}
            showRefresh={false} // We're using the refresh button in the actions
            loading={isRefreshing}
            emptyMessage="No events found matching your criteria"
            showPreview={true}
            renderPreview={renderEventPreview}
            previewTitle="Event Details"
          />
        )}
        
        {viewMode === 'card' && (
          <>
            {filteredEvents.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: spacing['3xl'],
                textAlign: 'center',
                color: colors.text.secondary
              }}>
                <Bell size={64} style={{ marginBottom: spacing.xl, opacity: 0.5 }} />
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: colors.text.primary, 
                  marginBottom: spacing.lg 
                }}>
                  No Events Found
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.6', 
                  maxWidth: '500px', 
                  margin: '0 auto' 
                }}>
                  No events match your current filters. Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
              <>
                {stackingMode === 'none' ? (
                  <div className="event-grid">
                    {filteredEvents.map(event => renderEventCard(event))}
                  </div>
                ) : (
                  renderStackedEvents()
                )}
              </>
            )}
          </>
        )}
        
        {viewMode === 'map' && renderFloorMap()}
      </div>
      
      {/* Event Detail Modal */}
      <GlassModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Event Details"
      >
        {selectedEvent && renderEventDetails(selectedEvent)}
      </GlassModal>
      
      {/* Acknowledge Modal */}
      <GlassModal
        isOpen={isAcknowledgeModalOpen}
        onClose={() => setIsAcknowledgeModalOpen(false)}
        title="Acknowledge Event"
      >
        <div style={{ padding: spacing.lg }}>
          <div style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              marginBottom: spacing.md,
              color: colors.text.primary
            }}>
              Are you sure you want to acknowledge this event?
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              color: colors.text.secondary,
              lineHeight: '1.6',
              marginBottom: spacing.lg
            }}>
              Acknowledging this event will mark it as handled and move it to the acknowledged events list.
            </p>
          </div>
          
          {selectedEvent && (
            <div style={{ 
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.xl
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <div style={{ fontWeight: '700', color: colors.text.primary }}>
                  {selectedEvent.eventType}
                </div>
                
                <GlassStatusBadge 
                  status={selectedEvent.priority === 'Red' ? 'error' : selectedEvent.priority === 'Amber' ? 'warning' : 'info'} 
                  label={selectedEvent.priority} 
                />
              </div>
              
              <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                <strong>ID:</strong> {selectedEvent.id} • <strong>Device:</strong> {selectedEvent.deviceName}
              </div>
              
              <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                <strong>Location:</strong> {selectedEvent.location}, {selectedEvent.building}, {selectedEvent.floor}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-end' }}>
            <GlassButton 
              variant="ghost" 
              onClick={() => setIsAcknowledgeModalOpen(false)}
            >
              Cancel
            </GlassButton>
            
            <GlassButton 
              variant="success" 
              onClick={confirmAcknowledge}
            >
              <CheckSquare size={16} style={{ marginRight: spacing.sm }} />
              Confirm Acknowledgement
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </PageLayout>
  );
};