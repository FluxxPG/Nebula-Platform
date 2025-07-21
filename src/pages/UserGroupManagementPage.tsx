import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  Plus, 
  Save,
  Shield,
  CheckSquare,
  X,
  Grid,
  Layers,
  User,
  Lock,
  AlertTriangle,
  Info,
  Settings,
  Check
} from 'lucide-react';
import { PageLayout } from '../ui/layouts';
import { 
  GlassButton, 
  GlassCard, 
  GlassInput, 
  GlassDataTable, 
  GlassStatusBadge,
  GlassModal,
  GlassDropdown,
  GlassSearchableDropdown
} from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../ui';
import { mockIdentities } from '../data/mockData';
import { mockAppModules, getAllApps } from '../data/mockData';

// Types for user groups
interface UserGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members: string[];
  permissions: GroupPermission[];
}

interface GroupPermission {
  id: string;
  type: 'app' | 'module' | 'dock';
  resourceId: string;
  resourceName: string;
  accessLevel: 'view' | 'edit' | 'admin';
}

// Mock data for user groups
const mockUserGroups: UserGroup[] = [
  {
    id: 'group-001',
    name: 'Administrators',
    description: 'Full system access with administrative privileges',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    createdBy: 'System',
    members: ['1', '2', '5'],
    permissions: [
      { id: 'perm-001', type: 'module', resourceId: 'identity-access', resourceName: 'Identity & Access', accessLevel: 'admin' },
      { id: 'perm-002', type: 'module', resourceId: 'security-analytics', resourceName: 'Security Analytics', accessLevel: 'admin' },
      { id: 'perm-003', type: 'module', resourceId: 'audit-compliance', resourceName: 'Audit & Compliance', accessLevel: 'admin' },
      { id: 'perm-004', type: 'app', resourceId: 'identity-management', resourceName: 'Identity Management', accessLevel: 'admin' },
      { id: 'perm-005', type: 'app', resourceId: 'event-wall', resourceName: 'Event Wall', accessLevel: 'admin' },
      { id: 'perm-006', type: 'dock', resourceId: 'home', resourceName: 'Home', accessLevel: 'admin' },
    ]
  },
  {
    id: 'group-002',
    name: 'Security Analysts',
    description: 'Access to security monitoring and analysis tools',
    createdAt: '2023-12-05T11:30:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    createdBy: 'admin',
    members: ['2', '10'],
    permissions: [
      { id: 'perm-007', type: 'module', resourceId: 'security-analytics', resourceName: 'Security Analytics', accessLevel: 'edit' },
      { id: 'perm-008', type: 'app', resourceId: 'event-wall', resourceName: 'Event Wall', accessLevel: 'edit' },
      { id: 'perm-009', type: 'app', resourceId: 'threat-detection', resourceName: 'Threat Detection', accessLevel: 'edit' },
      { id: 'perm-010', type: 'dock', resourceId: 'home', resourceName: 'Home', accessLevel: 'view' },
    ]
  },
  {
    id: 'group-003',
    name: 'HR Managers',
    description: 'Access to identity management for HR purposes',
    createdAt: '2023-12-10T14:45:00Z',
    updatedAt: '2024-01-12T16:20:00Z',
    createdBy: 'admin',
    members: ['9'],
    permissions: [
      { id: 'perm-011', type: 'module', resourceId: 'identity-access', resourceName: 'Identity & Access', accessLevel: 'edit' },
      { id: 'perm-012', type: 'app', resourceId: 'identity-management', resourceName: 'Identity Management', accessLevel: 'edit' },
      { id: 'perm-013', type: 'dock', resourceId: 'home', resourceName: 'Home', accessLevel: 'view' },
    ]
  },
  {
    id: 'group-004',
    name: 'Auditors',
    description: 'Read-only access to audit and compliance data',
    createdAt: '2023-12-15T09:00:00Z',
    updatedAt: '2024-01-14T11:45:00Z',
    createdBy: 'admin',
    members: ['4', '7'],
    permissions: [
      { id: 'perm-014', type: 'module', resourceId: 'audit-compliance', resourceName: 'Audit & Compliance', accessLevel: 'view' },
      { id: 'perm-015', type: 'app', resourceId: 'audit-trails', resourceName: 'Audit Trails', accessLevel: 'view' },
      { id: 'perm-016', type: 'app', resourceId: 'compliance-reporting', resourceName: 'Compliance Reporting', accessLevel: 'view' },
      { id: 'perm-017', type: 'dock', resourceId: 'home', resourceName: 'Home', accessLevel: 'view' },
    ]
  },
  {
    id: 'group-005',
    name: 'Visitor Management',
    description: 'Access to visitor management system',
    createdAt: '2023-12-20T13:15:00Z',
    updatedAt: '2024-01-08T10:30:00Z',
    createdBy: 'admin',
    members: ['3', '9', '15'],
    permissions: [
      { id: 'perm-018', type: 'module', resourceId: 'visitor-management', resourceName: 'Visitor Management', accessLevel: 'edit' },
      { id: 'perm-019', type: 'app', resourceId: 'visitor-registration', resourceName: 'Visitor Registration', accessLevel: 'edit' },
      { id: 'perm-020', type: 'app', resourceId: 'visitor-tracking', resourceName: 'Visitor Tracking', accessLevel: 'edit' },
      { id: 'perm-021', type: 'dock', resourceId: 'home', resourceName: 'Home', accessLevel: 'view' },
      { id: 'perm-022', type: 'dock', resourceId: 'visitors', resourceName: 'Visitors', accessLevel: 'view' },
    ]
  }
];

export const UserGroupManagementPage: React.FC = () => {
  const colors = useThemeColors();
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isAddPermissionsModalOpen, setIsAddPermissionsModalOpen] = useState(false);
  
  // Form state for create/edit
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>([]);
  
  // Filter user groups based on search term
  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Reset form
  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setGroupMembers([]);
    setGroupPermissions([]);
  };
  
  // Initialize form for editing
  const initEditForm = (group: UserGroup) => {
    setGroupName(group.name);
    setGroupDescription(group.description);
    setGroupMembers([...group.members]);
    setGroupPermissions([...group.permissions]);
  };
  
  // Handle create group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Group name is required');
      return;
    }
    
    const newGroup: UserGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      description: groupDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      members: groupMembers,
      permissions: groupPermissions,
    };
    
    setUserGroups([...userGroups, newGroup]);
    resetForm();
    setIsCreateModalOpen(false);
  };
  
  // Handle update group
  const handleUpdateGroup = () => {
    if (!selectedGroup || !groupName.trim()) {
      alert('Group name is required');
      return;
    }
    
    const updatedGroups = userGroups.map(group => 
      group.id === selectedGroup.id 
        ? {
            ...group,
            name: groupName,
            description: groupDescription,
            updatedAt: new Date().toISOString(),
            members: groupMembers,
            permissions: groupPermissions,
          }
        : group
    );
    
    setUserGroups(updatedGroups);
    resetForm();
    setIsEditModalOpen(false);
    setSelectedGroup(null);
  };
  
  // Handle delete group
  const handleDeleteGroup = () => {
    if (!selectedGroup) return;
    
    const updatedGroups = userGroups.filter(group => group.id !== selectedGroup.id);
    setUserGroups(updatedGroups);
    setIsDeleteModalOpen(false);
    setSelectedGroup(null);
  };
  
  // Get member names from IDs
  const getMemberNames = (memberIds: string[]) => {
    return memberIds.map(id => {
      const identity = mockIdentities.find(identity => identity.id === id);
      return identity ? `${identity.firstName} ${identity.lastName}` : id;
    });
  };
  
  // Get available members (not already in the group)
  const getAvailableMemberOptions = () => {
    return mockIdentities
      .filter(identity => !groupMembers.includes(identity.id))
      .map(identity => ({
        value: identity.id,
        label: `${identity.firstName} ${identity.lastName} (${identity.department})`,
        icon: <User size={16} />
      }));
  };
  
  // Get available modules for permissions
  const getAvailableModuleOptions = () => {
    return mockAppModules
      .filter(module => module.id !== 'favorites')
      .map(module => ({
        value: module.id,
        label: module.name,
      }));
  };
  
  // Get available apps for permissions
  const getAvailableAppOptions = () => {
    return getAllApps().map(app => ({
      value: app.id,
      label: app.name,
    }));
  };
  
  // Get available dock items for permissions
  const getDockItemOptions = () => {
    return [
      { value: 'home', label: 'Home' },
      { value: 'persona', label: 'Persona' },
      { value: 'visitors', label: 'Visitors' },
      { value: 'events', label: 'Event Cockpit' },
      { value: 'reporting', label: 'Reporting' },
      { value: 'apps', label: 'App Library' },
    ];
  };
  
  // Add members to group
  const handleAddMembers = (memberIds: string[]) => {
    if (!selectedGroup) return;
    
    // Add new members to the group
    const updatedMembers = [...groupMembers, ...memberIds];
    setGroupMembers(updatedMembers);
    
    setIsAddMembersModalOpen(false);
  };
  
  // Remove member from group
  const handleRemoveMember = (memberId: string) => {
    if (!selectedGroup) return;
    
    const updatedMembers = groupMembers.filter(id => id !== memberId);
    setGroupMembers(updatedMembers);
  };
  
  // Add permission to group
  const handleAddPermission = (type: 'app' | 'module' | 'dock', resourceId: string, resourceName: string, accessLevel: 'view' | 'edit' | 'admin') => {
    if (!selectedGroup) return;
    
    // Check if permission already exists
    const existingPermIndex = groupPermissions.findIndex(
      perm => perm.type === type && perm.resourceId === resourceId
    );
    
    let updatedPermissions: GroupPermission[];
    
    if (existingPermIndex >= 0) {
      // Update existing permission
      updatedPermissions = [...groupPermissions];
      updatedPermissions[existingPermIndex] = {
        ...updatedPermissions[existingPermIndex],
        accessLevel
      };
    } else {
      // Add new permission
      const newPermission: GroupPermission = {
        id: `perm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        resourceId,
        resourceName,
        accessLevel
      };
      
      updatedPermissions = [...groupPermissions, newPermission];
    }
    
    setGroupPermissions(updatedPermissions);
  };
  
  // Remove permission from group
  const handleRemovePermission = (permissionId: string) => {
    if (!selectedGroup) return;
    
    const updatedPermissions = groupPermissions.filter(perm => perm.id !== permissionId);
    setGroupPermissions(updatedPermissions);
  };
  
  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Group Name',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
    {
      key: 'members',
      label: 'Members',
      sortable: true,
      render: (value: string[], row: UserGroup) => (
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          <GlassStatusBadge 
            status="info" 
            label={`${row.members.length} members`} 
            size="sm" 
          />
        </div>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      sortable: true,
      render: (value: GroupPermission[], row: UserGroup) => (
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          <GlassStatusBadge 
            status="info" 
            label={`${row.permissions.length} permissions`} 
            size="sm" 
          />
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_: any, row: UserGroup) => (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <GlassButton 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(row);
              setIsViewModalOpen(true);
            }}
            title="View details"
          >
            <Info size={14} />
          </GlassButton>
          
          <GlassButton 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(row);
              initEditForm(row);
              setIsEditModalOpen(true);
            }}
            title="Edit group"
          >
            <Edit size={14} />
          </GlassButton>
          
          <GlassButton 
            variant="error" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(row);
              setIsDeleteModalOpen(true);
            }}
            title="Delete group"
          >
            <Trash2 size={14} />
          </GlassButton>
        </div>
      ),
    },
  ];
  
  // Render permission badge
  const renderPermissionBadge = (permission: GroupPermission) => {
    const accessLevelColors = {
      'view': 'info',
      'edit': 'warning',
      'admin': 'error'
    };
    
    const typeIcons = {
      'app': <Grid size={14} />,
      'module': <Layers size={14} />,
      'dock': <Settings size={14} />
    };
    
    return (
      <div 
        key={permission.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: spacing.md,
          background: colors.glass.secondary,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
          {typeIcons[permission.type]}
          <div>
            <div style={{ fontWeight: '600', color: colors.text.primary }}>
              {permission.resourceName}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              {permission.type.charAt(0).toUpperCase() + permission.type.slice(1)}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <GlassStatusBadge 
            status={accessLevelColors[permission.accessLevel] as any} 
            label={permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} 
            size="sm" 
          />
          
          <GlassButton 
            variant="error" 
            size="sm"
            onClick={() => handleRemovePermission(permission.id)}
            title="Remove permission"
          >
            <X size={14} />
          </GlassButton>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="User Group Management"
      subtitle="Create and manage user groups with specific permissions and members"
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost">
            <Filter size={18} style={{ marginRight: spacing.sm }} />
            Filters
          </GlassButton>
          <GlassButton 
            variant="primary"
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
          >
            <UserPlus size={18} style={{ marginRight: spacing.sm }} />
            Create Group
          </GlassButton>
        </div>
      }
    >
      {/* Search Bar */}
      <div style={{
        marginBottom: spacing.xl,
        padding: spacing.xl,
        background: colors.glass.primary,
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <GlassInput
          placeholder="Search user groups..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* User Groups Table */}
      <GlassDataTable
        columns={columns}
        data={filteredGroups}
        pagination={true}
        pageSize={10}
        searchable={false} // We're using our own search
        showPageSizeSelector={true}
        onRowClick={(row) => {
          setSelectedGroup(row);
          setIsViewModalOpen(true);
        }}
        emptyMessage="No user groups found matching your criteria"
      />

      {/* Create Group Modal */}
      <GlassModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create User Group"
      >
        <div style={{ padding: spacing.xl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Group Name *
            </label>
            <GlassInput
              value={groupName}
              onChange={setGroupName}
              placeholder="Enter group name"
            />
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Description
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
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
              placeholder="Enter group description"
            />
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: spacing.md
            }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Group Members
              </label>
              
              <GlassButton 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedGroup({ ...mockUserGroups[0], members: groupMembers, permissions: groupPermissions });
                  setIsAddMembersModalOpen(true);
                }}
              >
                <UserPlus size={14} style={{ marginRight: spacing.xs }} />
                Add Members
              </GlassButton>
            </div>
            
            {groupMembers.length === 0 ? (
              <div style={{
                padding: spacing.lg,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
                color: colors.text.secondary,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}>
                No members added yet
              </div>
            ) : (
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
              }}>
                {groupMembers.map(memberId => {
                  const identity = mockIdentities.find(i => i.id === memberId);
                  return (
                    <div 
                      key={memberId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: spacing.md,
                        background: colors.glass.primary,
                        borderRadius: borderRadius.md,
                        marginBottom: spacing.sm,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <User size={16} />
                        <span>{identity ? `${identity.firstName} ${identity.lastName}` : memberId}</span>
                      </div>
                      
                      <GlassButton 
                        variant="error" 
                        size="sm"
                        onClick={() => handleRemoveMember(memberId)}
                        title="Remove member"
                      >
                        <X size={14} />
                      </GlassButton>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: spacing.xl }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: spacing.md
            }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Group Permissions
              </label>
              
              <GlassButton 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedGroup({ ...mockUserGroups[0], members: groupMembers, permissions: groupPermissions });
                  setIsAddPermissionsModalOpen(true);
                }}
              >
                <Shield size={14} style={{ marginRight: spacing.xs }} />
                Add Permissions
              </GlassButton>
            </div>
            
            {groupPermissions.length === 0 ? (
              <div style={{
                padding: spacing.lg,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
                color: colors.text.secondary,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}>
                No permissions added yet
              </div>
            ) : (
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                padding: spacing.md,
                background: colors.glass.secondary,
                borderRadius: borderRadius.md,
              }}>
                {groupPermissions.map(permission => renderPermissionBadge(permission))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <GlassButton 
              variant="ghost"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </GlassButton>
            
            <GlassButton 
              variant="primary"
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
            >
              <Save size={16} style={{ marginRight: spacing.sm }} />
              Create Group
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Edit Group Modal */}
      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedGroup(null);
        }}
        title="Edit User Group"
      >
        {selectedGroup && (
          <div style={{ padding: spacing.xl }}>
            <div style={{ marginBottom: spacing.xl }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Group Name *
              </label>
              <GlassInput
                value={groupName}
                onChange={setGroupName}
                placeholder="Enter group name"
              />
            </div>
            
            <div style={{ marginBottom: spacing.xl }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Description
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
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
                placeholder="Enter group description"
              />
            </div>
            
            <div style={{ marginBottom: spacing.xl }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}>
                  Group Members
                </label>
                
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddMembersModalOpen(true)}
                >
                  <UserPlus size={14} style={{ marginRight: spacing.xs }} />
                  Add Members
                </GlassButton>
              </div>
              
              {groupMembers.length === 0 ? (
                <div style={{
                  padding: spacing.lg,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                  color: colors.text.secondary,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  No members added yet
                </div>
              ) : (
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  padding: spacing.md,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                }}>
                  {groupMembers.map(memberId => {
                    const identity = mockIdentities.find(i => i.id === memberId);
                    return (
                      <div 
                        key={memberId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: spacing.md,
                          background: colors.glass.primary,
                          borderRadius: borderRadius.md,
                          marginBottom: spacing.sm,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <User size={16} />
                          <span>{identity ? `${identity.firstName} ${identity.lastName}` : memberId}</span>
                        </div>
                        
                        <GlassButton 
                          variant="error" 
                          size="sm"
                          onClick={() => handleRemoveMember(memberId)}
                          title="Remove member"
                        >
                          <X size={14} />
                        </GlassButton>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: spacing.xl }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                }}>
                  Group Permissions
                </label>
                
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddPermissionsModalOpen(true)}
                >
                  <Shield size={14} style={{ marginRight: spacing.xs }} />
                  Add Permissions
                </GlassButton>
              </div>
              
              {groupPermissions.length === 0 ? (
                <div style={{
                  padding: spacing.lg,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                  color: colors.text.secondary,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  No permissions added yet
                </div>
              ) : (
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  padding: spacing.md,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.md,
                }}>
                  {groupPermissions.map(permission => renderPermissionBadge(permission))}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton 
                variant="ghost"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setSelectedGroup(null);
                }}
              >
                Cancel
              </GlassButton>
              
              <GlassButton 
                variant="primary"
                onClick={handleUpdateGroup}
                disabled={!groupName.trim()}
              >
                <Save size={16} style={{ marginRight: spacing.sm }} />
                Save Changes
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* View Group Modal */}
      <GlassModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedGroup(null);
        }}
        title="Group Details"
      >
        {selectedGroup && (
          <div style={{ padding: spacing.xl }}>
            {/* Group Info */}
            <GlassCard variant="primary" padding="lg" style={{ marginBottom: spacing.xl }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.xl, marginBottom: spacing.xl }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: colors.gradients.primary,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Users size={32} style={{ color: 'white' }} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                    {selectedGroup.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.md }}>
                    {selectedGroup.description}
                  </p>
                  <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                    <GlassStatusBadge 
                      status="info" 
                      label={`${selectedGroup.members.length} members`} 
                      size="md" 
                    />
                    <GlassStatusBadge 
                      status="info" 
                      label={`${selectedGroup.permissions.length} permissions`} 
                      size="md" 
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary, fontSize: '0.875rem' }}>
                      Created: {new Date(selectedGroup.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
                <GlassButton 
                  variant="ghost"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedGroup(selectedGroup);
                    initEditForm(selectedGroup);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit size={16} style={{ marginRight: spacing.sm }} />
                  Edit Group
                </GlassButton>
              </div>
            </GlassCard>
            
            {/* Members Section */}
            <div style={{ marginBottom: spacing.xl }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                Group Members
              </h3>
              
              {selectedGroup.members.length === 0 ? (
                <div style={{
                  padding: spacing.xl,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  color: colors.text.secondary,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  No members in this group
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
                  {selectedGroup.members.map(memberId => {
                    const identity = mockIdentities.find(i => i.id === memberId);
                    return (
                      <GlassCard key={memberId} variant="secondary" padding="md">
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: colors.glass.primary,
                            borderRadius: borderRadius.lg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <User size={24} />
                          </div>
                          
                          <div>
                            <div style={{ fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                              {identity ? `${identity.firstName} ${identity.lastName}` : memberId}
                            </div>
                            {identity && (
                              <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                                {identity.position} • {identity.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Permissions Section */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.text.primary, marginBottom: spacing.lg }}>
                Group Permissions
              </h3>
              
              {selectedGroup.permissions.length === 0 ? (
                <div style={{
                  padding: spacing.xl,
                  background: colors.glass.secondary,
                  borderRadius: borderRadius.lg,
                  color: colors.text.secondary,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  No permissions assigned to this group
                </div>
              ) : (
                <div>
                  {/* Module Permissions */}
                  <div style={{ marginBottom: spacing.xl }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md }}>
                      Module Permissions
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
                      {selectedGroup.permissions
                        .filter(perm => perm.type === 'module')
                        .map(permission => (
                          <GlassCard key={permission.id} variant="secondary" padding="md">
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: colors.glass.primary,
                                borderRadius: borderRadius.lg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <Layers size={24} />
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                                  {permission.resourceName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                                  {permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} Access
                                </div>
                              </div>
                              
                              <GlassStatusBadge 
                                status={
                                  permission.accessLevel === 'admin' ? 'error' :
                                  permission.accessLevel === 'edit' ? 'warning' : 'info'
                                } 
                                label={permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} 
                                size="sm" 
                              />
                            </div>
                          </GlassCard>
                        ))}
                    </div>
                  </div>
                  
                  {/* App Permissions */}
                  <div style={{ marginBottom: spacing.xl }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md }}>
                      App Permissions
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
                      {selectedGroup.permissions
                        .filter(perm => perm.type === 'app')
                        .map(permission => (
                          <GlassCard key={permission.id} variant="secondary" padding="md">
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: colors.glass.primary,
                                borderRadius: borderRadius.lg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <Grid size={24} />
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                                  {permission.resourceName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                                  {permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} Access
                                </div>
                              </div>
                              
                              <GlassStatusBadge 
                                status={
                                  permission.accessLevel === 'admin' ? 'error' :
                                  permission.accessLevel === 'edit' ? 'warning' : 'info'
                                } 
                                label={permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} 
                                size="sm" 
                              />
                            </div>
                          </GlassCard>
                        ))}
                    </div>
                  </div>
                  
                  {/* Dock Permissions */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md }}>
                      Dock Permissions
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
                      {selectedGroup.permissions
                        .filter(perm => perm.type === 'dock')
                        .map(permission => (
                          <GlassCard key={permission.id} variant="secondary" padding="md">
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: colors.glass.primary,
                                borderRadius: borderRadius.lg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <Settings size={24} />
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                                  {permission.resourceName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                                  {permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} Access
                                </div>
                              </div>
                              
                              <GlassStatusBadge 
                                status={
                                  permission.accessLevel === 'admin' ? 'error' :
                                  permission.accessLevel === 'edit' ? 'warning' : 'info'
                                } 
                                label={permission.accessLevel.charAt(0).toUpperCase() + permission.accessLevel.slice(1)} 
                                size="sm" 
                              />
                            </div>
                          </GlassCard>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGroup(null);
        }}
        title="Delete User Group"
      >
        {selectedGroup && (
          <div style={{ padding: spacing.xl }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.lg, 
              padding: spacing.lg,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: borderRadius.lg,
              marginBottom: spacing.xl,
            }}>
              <AlertTriangle size={24} style={{ color: '#ef4444' }} />
              <div>
                <h4 style={{ color: '#ef4444', fontWeight: '600', marginBottom: spacing.xs }}>
                  Warning: This action cannot be undone
                </h4>
                <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
                  Deleting this group will remove all associated permissions and member assignments.
                </p>
              </div>
            </div>
            
            <p style={{ fontSize: '1rem', color: colors.text.primary, marginBottom: spacing.xl }}>
              Are you sure you want to delete the group "{selectedGroup.name}"?
            </p>
            
            <div style={{ 
              padding: spacing.lg,
              background: colors.glass.secondary,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.xl,
            }}>
              <div style={{ marginBottom: spacing.md }}>
                <div style={{ fontWeight: '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Group Details
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  <strong>Name:</strong> {selectedGroup.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.xs }}>
                  <strong>Members:</strong> {selectedGroup.members.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                  <strong>Permissions:</strong> {selectedGroup.permissions.length}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton 
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedGroup(null);
                }}
              >
                Cancel
              </GlassButton>
              
              <GlassButton 
                variant="error"
                onClick={handleDeleteGroup}
              >
                <Trash2 size={16} style={{ marginRight: spacing.sm }} />
                Delete Group
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Add Members Modal */}
      <GlassModal
        isOpen={isAddMembersModalOpen}
        onClose={() => setIsAddMembersModalOpen(false)}
        title="Add Members to Group"
      >
        {selectedGroup && (
          <div style={{ padding: spacing.xl }}>
            <div style={{ marginBottom: spacing.xl }}>
              <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.lg }}>
                Select users to add to the group "{selectedGroup.name}".
              </p>
              
              <GlassSearchableDropdown
                options={getAvailableMemberOptions()}
                placeholder="Search and select users..."
                multiple={true}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    handleAddMembers(value);
                  }
                }}
                searchable={true}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton 
                variant="ghost"
                onClick={() => setIsAddMembersModalOpen(false)}
              >
                Cancel
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Add Permissions Modal */}
      <GlassModal
        isOpen={isAddPermissionsModalOpen}
        onClose={() => setIsAddPermissionsModalOpen(false)}
        title="Add Permissions to Group"
      >
        {selectedGroup && (
          <div style={{ padding: spacing.xl }}>
            <div style={{ marginBottom: spacing.xl }}>
              <p style={{ fontSize: '0.875rem', color: colors.text.secondary, marginBottom: spacing.lg }}>
                Add permissions to the group "{selectedGroup.name}".
              </p>
              
              {/* Permission Type Selector */}
              <div style={{ marginBottom: spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  Permission Type
                </label>
                <GlassDropdown
                  options={[
                    { value: 'module', label: 'Module Access' },
                    { value: 'app', label: 'App Access' },
                    { value: 'dock', label: 'Dock Item Access' },
                  ]}
                  placeholder="Select permission type"
                  onChange={(value) => {
                    // This would be used to filter the resource options
                  }}
                />
              </div>
              
              {/* Resource Selector */}
              <div style={{ marginBottom: spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  Resource
                </label>
                <GlassDropdown
                  options={[
                    ...getAvailableModuleOptions(),
                    ...getAvailableAppOptions(),
                    ...getDockItemOptions(),
                  ]}
                  placeholder="Select resource"
                  onChange={(value) => {
                    // This would be used to set the selected resource
                  }}
                />
              </div>
              
              {/* Access Level Selector */}
              <div style={{ marginBottom: spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  Access Level
                </label>
                <GlassDropdown
                  options={[
                    { value: 'view', label: 'View Only' },
                    { value: 'edit', label: 'Edit' },
                    { value: 'admin', label: 'Administrator' },
                  ]}
                  placeholder="Select access level"
                  onChange={(value) => {
                    // This would be used to set the access level
                  }}
                />
              </div>
              
              {/* Add Permission Button */}
              <GlassButton 
                variant="primary"
                onClick={() => {
                  // In a real implementation, this would add the permission
                  // For now, we'll add a sample permission
                  handleAddPermission(
                    'module',
                    'identity-access',
                    'Identity & Access',
                    'edit'
                  );
                  setIsAddPermissionsModalOpen(false);
                }}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Permission
              </GlassButton>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <GlassButton 
                variant="ghost"
                onClick={() => setIsAddPermissionsModalOpen(false)}
              >
                Cancel
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>
    </PageLayout>
  );
};