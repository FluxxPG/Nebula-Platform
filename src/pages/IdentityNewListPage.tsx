import React, { useEffect, useState } from 'react'
import { Identity } from '../types/identity';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { borderRadius, GlassAdvancedFilter, GlassAvatar, GlassButton, GlassDataTable, GlassListControl, GlassPaginationControl, GlassStatusBadge, PageLayout, shadows, spacing } from '../ui';
import { Download, Shield, UserPlus, Users } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { System_Categories, Users_Query } from '../operations/AccountQuery';
import { SortOrder, ViewMode } from '../ui/components/GlassListControl';
import { FilterField, FilterRule } from '../ui/components/GlassAdvancedFilter';
import GlassListDataTable from '../ui/components/GlassListDataTable';


interface IdentityListPageProps {
    onIdentityClick: (identity: Identity) => void;
}

const sortOptions = [
    { value: 'id', label: 'Id' },
    { value: 'employeeid', label: 'EmployeeId' },
    { value: 'firstname', label: 'Firstname' },
    { value: 'lastname', label: 'Lastname' },
    { value: 'email', label: 'Email' },
];

const filterOptions: any[] = [];

const filterFields: FilterField[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'terminated', label: 'Terminated' },
        ],
    },
    {
        key: 'location',
        label: 'Location',
        type: 'select',
        options: [
            { value: 'San Francisco, CA', label: 'San Francisco, CA' },
            { value: 'New York, NY', label: 'New York, NY' },
            { value: 'Chicago, IL', label: 'Chicago, IL' },
        ],
    },
    {
        key: 'firstname',
        label: 'Firstname',
        type: 'text',
    },
    {
        key: 'lastname',
        label: 'Lastname',
        type: 'text',
    },
    {
        key: 'email',
        label: 'Email',
        type: 'text',
    },
    {
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
    }
];

const IdentityNewListPage: React.FC<IdentityListPageProps> = ({ onIdentityClick }) => {

    const themeColors = useThemeColors();

    const [isAddIdentityOpen, setIsAddIdentityOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const [listData, setListData] = useState<any[]>([]);

    const [kpiCounts, setKpiCounts] = useState<{ active: number, inactive: number, terminated: number }>({
        active: 0,
        inactive: 0,
        terminated: 0
    });

    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);


    const { data: kpiData, refetch: kpiRefetch } = useQuery(System_Categories, {
        variables: {
            categorises: ["ACTIVEIDENTITIESCOUNT", "INACTIVEIDENTITIESCOUNT", "TERMINATEDIDENTITIESCOUNT"]
        }
    })

    const { data, refetch, loading } = useQuery(Users_Query, {
        variables: {
            pagenumber: currentPage - 1,
            pagesize: pageSize,
            filters: '',
            order: {
                fieldName: sortBy,
                order: sortOrder === 'asc' ? true : false
            }
        }
    });

    let queryResponseKey = 'identities';

    useEffect(() => {
        if (data) {
            if (data[queryResponseKey].hasOwnProperty('data')) {
                console.log(data[queryResponseKey]?.data || [])
                setListData(data[queryResponseKey]?.data || []);
            } else {
                setListData(data[queryResponseKey] || []);
            }
            let total = data[queryResponseKey].total;
            setTotalRows(total);
            setTotalPages(Math.ceil(total / pageSize));
        }
        if (kpiData?.all) {
            const value = { active: 0, inactive: 0, terminated: 0 };
            const categoryMap: Record<string, keyof typeof value> = {
                ACTIVEIDENTITIESCOUNT: "active",
                INACTIVEIDENTITIESCOUNT: "inactive",
                TERMINATEDIDENTITIESCOUNT: "terminated"
            };
            kpiData.all.forEach(({ category, keyid }: any) => {
                const key = categoryMap[category];
                if (key) {
                    value[key] = parseInt(keyid);
                }
            });
            setKpiCounts(value);
        }
    }, [data, kpiData, pageSize]);

    const handleExport = () => {

    }

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode === 'grid' ? 'grid' : 'list');
    }

    const handleRefresh = () => {
        refetch();
        kpiRefetch();
    }

    const handleReset = () => {
        setPageSize(10);
        setCurrentPage(1);
        refetch();
        kpiRefetch();
    }

    const handleSortChange = (newSortBy: string, newSortOrder: SortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const handleFilterChange = (filters: string[]) => {

    }

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        refetch();
    };

    const kpiCardStyles = (color: string): React.CSSProperties => ({
        padding: spacing.xl,
        background: themeColors.glass.primary,
        border: 'none',
        borderRadius: borderRadius.xl,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: shadows.glass,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.lg,
    });

    const kpiIconContainerStyles = (gradient: string): React.CSSProperties => ({
        width: '60px',
        height: '60px',
        background: gradient,
        borderRadius: borderRadius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 8px 32px ${gradient.split(' ')[0]}40`,
    });

    const renderGridView = () => {
        return (
            <div style={{
                background: themeColors.glass.primary,
                border: 'none',
                borderRadius: borderRadius.xl,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden',
            }}>
                <div style={{ padding: spacing.xl }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: spacing['3xl'],
                        }}>
                            <GlassStatusBadge status="info" label="Loading..." />
                        </div>
                    ) : listData.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: spacing['3xl'],
                            color: themeColors.text.secondary,
                        }}>
                            {activeFilters.length > 0 || searchTerm
                                ? "No identities match your search criteria or filters"
                                : "No identities found"
                            }
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                            {listData.map((identity) => (
                                <div
                                    key={identity.id}
                                    style={{
                                        padding: spacing.xl,
                                        background: themeColors.glass.secondary,
                                        border: 'none',
                                        borderRadius: borderRadius.lg,
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing.lg,
                                    }}
                                    onClick={() => onIdentityClick(identity)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    <GlassAvatar
                                        src={identity.avatar}
                                        name={`${identity.firstname} ${identity.lastname}`}
                                        size="lg"
                                        status="online"
                                    />

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
                                            <div>
                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    fontWeight: '700',
                                                    color: themeColors.text.primary,
                                                    margin: 0,
                                                    marginBottom: spacing.xs,
                                                }}>
                                                    {identity.firstname} {identity.lastname}
                                                </h3>
                                                <p style={{
                                                    fontSize: '0.875rem',
                                                    color: themeColors.text.secondary,
                                                    margin: 0,
                                                    fontWeight: '500',
                                                }}>
                                                    {identity.employeeid} • {identity.company}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                                                <GlassStatusBadge
                                                    status={identity.status === 'super_admin' ? 'error' : identity.accessLevel === 'admin' ? 'warning' : 'success'}
                                                    label={identity.status.replace('_', ' ').toUpperCase()}
                                                    size="sm"
                                                />
                                                {/* <GlassStatusBadge
                                                    status={identity.status as any}
                                                    size="sm"
                                                /> */}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.md }}>
                                            <div>
                                                <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Email</span>
                                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                                                    {identity.email}
                                                </div>
                                            </div>

                                            <div>
                                                <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Employee ID</span>
                                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                                                    {identity.employeeid}
                                                </div>
                                            </div>

                                            {identity.location && <div>
                                                <span style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600' }}>Location</span>
                                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary, fontWeight: '500' }}>
                                                    {identity.location}
                                                </div>
                                            </div>}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {!loading && (
                    <GlassPaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={totalRows}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        showPageSizeSelector={true}
                        showColumnSelector={false}
                        showRefresh={true}
                        showExport={true}
                        onRefresh={handleReset}
                        onExport={handleExport}
                    />
                )}
            </div>
        )
    }

    const renderListView = () => {
        return (
            <GlassListDataTable
                data={listData}
                columns={columns}
                onRowClick={onIdentityClick}
                loading={loading}
                pagination
                pageSize={pageSize}
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                showPageSizeSelector
                showColumnToggle
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onReset={handleRefresh}
                onExport={handleExport}
                emptyMessage={
                    activeFilters.length > 0 || searchTerm
                        ? "No identities match your search criteria or filters"
                        : "No identities found"
                }
                showPreview={true}
                renderPreview={renderIdentityPreview}
                previewTitle="Identity Preview"
            />
        )
    }

    const columns = [
        {
            key: 'avatar',
            label: '',
            width: '60px',
            render: (value: string, row: Identity) => (
                <GlassAvatar
                    src={row.avatar}
                    name={`${row.firstname} ${row.lastname}`}
                    size="sm"
                    status="online"
                />
            ),
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (value: any, row: Identity) => (
                <div>
                    <div style={{ fontWeight: '700', color: themeColors.text.primary, fontSize: '0.875rem' }}>
                        {row.firstname} {row.lastname}
                    </div>
                    <div style={{ color: themeColors.text.secondary, fontSize: '0.75rem', fontWeight: '500' }}>
                        {row.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'employeeid',
            label: 'Employee ID',
            sortable: true,
            width: '120px',
        },
        {
            key: 'company',
            label: 'Company',
            sortable: true,
            width: '120px',
        },
        {
            key: 'status',
            label: 'Status',
            width: '120px',
            render: (value: string) => (
                <GlassStatusBadge
                    status={value === 'super_admin' ? 'error' : value === 'admin' ? 'warning' : 'success'}
                    label={value.replace('_', ' ').toUpperCase()}
                    size="sm"
                />
            ),
        },
    ];

    const renderIdentityPreview = (identity: Identity) => {
        return (
            <div style={{
                padding: spacing.xl,
                background: themeColors.glass.secondary,
                borderRadius: borderRadius.xl,
            }}>
                <div style={{ display: 'flex', gap: spacing.xl, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: spacing.md,
                        minWidth: '150px',
                    }}>
                        <GlassAvatar
                            src={identity.avatar}
                            name={`${identity.firstname} ${identity.lastname}`}
                            size="xl"
                            status="online"
                        />
                        <div style={{ textAlign: 'center' }}>
                            <GlassStatusBadge
                                status={identity.status as any}
                                size="md"
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: themeColors.text.primary,
                            marginBottom: spacing.md,
                        }}>
                            {identity.firstname} {identity.lastname}
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: spacing.lg,
                            marginBottom: spacing.xl,
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Email
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.email}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Phone
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.phone || 'Not provided'}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Employee ID
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.employeeid}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Company
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.company}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Position
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.position}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Access Level
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    <GlassStatusBadge
                                        status={identity.accessLevel === 'super_admin' ? 'error' : identity.accessLevel === 'admin' ? 'warning' : 'success'}
                                        label={identity.accessLevel.replace('_', ' ').toUpperCase()}
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Location
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.location}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Join Date
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {new Date(identity.joinDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Last Login
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.lastLogin ? new Date(identity.lastLogin).toLocaleDateString() : 'Never'}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }}>
                                    Manager
                                </div>
                                <div style={{ fontSize: '0.875rem', color: themeColors.text.primary }}>
                                    {identity.manager || 'None'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <GlassButton
                                variant="primary"
                                size="sm"
                                onClick={() => onIdentityClick(identity)}
                            >
                                View Full Details
                            </GlassButton>
                        </div>
                    </div>
                </div>

                {/* Access Cards Summary */}
                {identity.cards.length > 0 && (
                    <div style={{ marginTop: spacing.xl }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: themeColors.text.primary,
                            marginBottom: spacing.lg,
                        }}>
                            Access Cards ({identity.cards.length})
                        </h3>

                        <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                            {identity.cards.map(card => (
                                <div key={card.id} style={{
                                    padding: spacing.md,
                                    background: themeColors.glass.primary,
                                    borderRadius: borderRadius.lg,
                                    border: `1px solid ${themeColors.border.light}`,
                                }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text.primary, marginBottom: spacing.xs }}>
                                        {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} Card
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: themeColors.text.secondary }}>
                                        {card.cardNumber}
                                    </div>
                                    <div style={{ marginTop: spacing.sm }}>
                                        <GlassStatusBadge
                                            status={card.status as any}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <PageLayout
            title='Identity Management'
            subtitle='Manage user identities, access levels, and permissions across your organization'
            actions={
                <div style={{ display: 'flex', gap: spacing.lg }}>
                    <GlassButton variant="ghost" size="lg" onClick={handleExport}>
                        <Download size={20} style={{ marginRight: spacing.sm }} />
                        Export All
                    </GlassButton>
                    <GlassButton variant="success" size="lg" onClick={() => setIsAddIdentityOpen(true)}>
                        <UserPlus size={20} style={{ marginRight: spacing.sm }} />
                        Add Identity
                    </GlassButton>
                </div>
            }
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing.xl, marginBottom: spacing['3xl'] }}>
                <div style={kpiCardStyles(themeColors.gradients.primary)}>
                    <div style={kpiIconContainerStyles(themeColors.gradients.primary)}>
                        <Users size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
                            {totalRows}
                        </div>
                        <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
                            Total Identities
                        </div>
                    </div>
                </div>

                <div style={kpiCardStyles(themeColors.gradients.success)}>
                    <div style={kpiIconContainerStyles(themeColors.gradients.success)}>
                        <Shield size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
                            {kpiCounts.active} %
                        </div>
                        <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
                            Active Identities
                        </div>
                    </div>
                </div>

                <div style={kpiCardStyles(themeColors.gradients.warning)}>
                    <div style={kpiIconContainerStyles(themeColors.gradients.warning)}>
                        <Shield size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
                            {kpiCounts.inactive} %
                        </div>
                        <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
                            InActive Identities
                        </div>
                    </div>
                </div>

                <div style={kpiCardStyles(themeColors.gradients.info)}>
                    <div style={kpiIconContainerStyles(themeColors.gradients.error)}>
                        <Shield size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColors.text.primary }}>
                            {kpiCounts.terminated} %
                        </div>
                        <div style={{ fontSize: '1rem', color: themeColors.text.secondary, fontWeight: '600' }}>
                            Terminated Identities
                        </div>
                    </div>
                </div>
            </div>

            <GlassListControl
                viewMode={viewMode === 'grid' ? 'grid' : 'list'}
                onViewModeChange={handleViewModeChange}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search identities..."
                sortBy={sortBy}
                sortOrder={sortOrder as SortOrder}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                activeFilters={activeFilters.map(f => f.value as string)}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                totalItems={totalRows}
                filteredItems={totalRows}
                onRefresh={handleRefresh}
                onExport={handleExport}
                loading={loading}
                className="mb-6"
                showPreview={true}
                onPreviewItem={(item) => console.log('Preview item:', item)}
            />

            {viewMode === 'grid' ? (
                renderListView()
            ) : (
                renderGridView()
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: spacing.xl,
                padding: spacing.lg,
                background: themeColors.glass.primary,
                border: 'none',
                borderRadius: borderRadius.xl,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                gap: spacing.lg,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                    <h3 style={{
                        margin: 0,
                        color: themeColors.text.primary,
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}>
                        Advanced Filters
                    </h3>

                    {activeFilters.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <GlassStatusBadge status="info" label={`${activeFilters.length} active`} size="sm" />
                            <GlassButton variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
                                Clear All
                            </GlassButton>
                        </div>
                    )}
                </div>

                <GlassAdvancedFilter fields={filterFields} activeFilters={activeFilters} onFiltersChange={setActiveFilters} />
            </div>

        </PageLayout>
    )
}

export default IdentityNewListPage