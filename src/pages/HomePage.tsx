import React from 'react';
import { Users, UserCheck, Calendar, Shield, TrendingUp, Clock } from 'lucide-react';
import { BentoGrid, BentoCard } from '../ui/layouts';
import { PageLayout } from '../ui/layouts';
import { GlassButton, GlassProgress, GlassStatusBadge } from '../ui/components';
import { useThemeColors } from '../ui/hooks/useThemeColors';
import { useAppearance } from '../ui/hooks/useAppearance';
import { spacing } from '../ui';
import { useTranslation } from 'react-i18next';

export const HomePage: React.FC = () => {
  const colors = useThemeColors();
  const { iconColors } = useAppearance();
  const { t } = useTranslation();

  const stats = [
    { label: t('home.stats.totalIdentities'), value: '1,247', change: '+12%', icon: <Users size={32} style={{ color: iconColors.primary }} /> },
    { label: t('home.stats.activeSessions'), value: '342', change: '+5%', icon: <UserCheck size={32} style={{ color: iconColors.primary }} /> },
    { label: t('home.stats.todaysVisitors'), value: '89', change: '+23%', icon: <Calendar size={32} style={{ color: iconColors.primary }} /> },
    { label: t('home.stats.securityAlerts'), value: '3', change: '-15%', icon: <Shield size={32} style={{ color: iconColors.primary }} /> },
  ];

  const recentActivity = [
    { user: 'Sarah Johnson', action: 'Accessed Server Room', time: '2 minutes ago', status: 'success' },
    { user: 'Michael Rodriguez', action: 'Updated Security Policy', time: '15 minutes ago', status: 'info' },
    { user: 'Emily Chen', action: 'Visitor Check-in', time: '32 minutes ago', status: 'success' },
    { user: 'System Alert', action: 'Failed Access Attempt', time: '1 hour ago', status: 'warning' },
  ];

  return (
    <PageLayout
      title={t('home.welcome')}
      subtitle={t('home.subtitle')}
      actions={
        <div style={{ display: 'flex', gap: spacing.lg }}>
          <GlassButton variant="ghost" size="lg">
            <TrendingUp size={20} style={{ marginRight: spacing.sm, color: iconColors.primary }} />
            {t('home.analytics')}
          </GlassButton>
          <GlassButton variant="primary" size="lg">
            <Shield size={20} style={{ marginRight: spacing.sm }} />
            {t('home.securityCenter')}
          </GlassButton>
        </div>
      }
    >
      <BentoGrid columns={12} gap="lg">
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <BentoCard key={index} span={3} variant="primary" padding="xl">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
              <div style={{ color: iconColors.secondary }}>
                {stat.icon}
              </div>
              <GlassStatusBadge 
                status={stat.change.startsWith('+') ? 'success' : 'warning'} 
                label={stat.change}
                size="md"
              />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.smartText.primary, marginBottom: spacing.sm }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '1rem', color: colors.smartText.secondary, fontWeight: '600' }}>
              {stat.label}
            </div>
          </BentoCard>
        ))}

        {/* System Health */}
        <BentoCard span={6} variant="elevated" padding="xl">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.smartText.primary, marginBottom: spacing.xl }}>
            {t('home.systemHealth.title')}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <span style={{ color: colors.smartText.secondary, fontSize: '1rem', fontWeight: '600' }}>{t('home.systemHealth.serverPerformance')}</span>
                <span style={{ color: colors.smartText.primary, fontSize: '1rem', fontWeight: '700' }}>94%</span>
              </div>
              <GlassProgress value={94} animated showValue={false} />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <span style={{ color: colors.smartText.secondary, fontSize: '1rem', fontWeight: '600' }}>{t('home.systemHealth.databaseHealth')}</span>
                <span style={{ color: colors.smartText.primary, fontSize: '1rem', fontWeight: '700' }}>98%</span>
              </div>
              <GlassProgress value={98} animated showValue={false} />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <span style={{ color: colors.smartText.secondary, fontSize: '1rem', fontWeight: '600' }}>{t('home.systemHealth.securityScore')}</span>
                <span style={{ color: colors.smartText.primary, fontSize: '1rem', fontWeight: '700' }}>87%</span>
              </div>
              <GlassProgress value={87} animated showValue={false} />
            </div>
          </div>
        </BentoCard>

        {/* Quick Actions */}
        <BentoCard span={6} variant="secondary" padding="xl">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.smartText.primary, marginBottom: spacing.xl }}>
            {t('home.quickActions')}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
            <GlassButton variant="ghost" size="lg">
              <Users size={24} style={{ marginRight: spacing.md, color: iconColors.primary }} />
              {t('home.addIdentity')}
            </GlassButton>
            <GlassButton variant="ghost" size="lg">
              <UserCheck size={24} style={{ marginRight: spacing.md, color: iconColors.primary }} />
              {t('home.registerVisitor')}
            </GlassButton>
            <GlassButton variant="ghost" size="lg">
              <Shield size={24} style={{ marginRight: spacing.md, color: iconColors.primary }} />
              {t('home.securityAudit')}
            </GlassButton>
            <GlassButton variant="ghost" size="lg">
              <Calendar size={24} style={{ marginRight: spacing.md, color: iconColors.primary }} />
              {t('home.scheduleEvent')}
            </GlassButton>
          </div>
        </BentoCard>

        {/* Recent Activity */}
        <BentoCard span={12} variant="primary" padding="xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.smartText.primary }}>
              {t('home.recentActivity')}
            </h3>
            <GlassButton variant="ghost" size="md">
              {t('common.viewAll')}
            </GlassButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.xl,
                background: colors.glass.secondary,
                borderRadius: '16px',
                border: `1px solid ${colors.border.light}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                  <Clock size={20} style={{ color: iconColors.secondary }} />
                  <div>
                    <div style={{ color: colors.smartText.primary, fontWeight: '600', fontSize: '1rem' }}>
                      {activity.user}
                    </div>
                    <div style={{ color: colors.smartText.secondary, fontSize: '0.875rem', fontWeight: '500' }}>
                      {activity.action}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                  <span style={{ color: colors.smartText.secondary, fontSize: '0.875rem', fontWeight: '500' }}>
                    {activity.time}
                  </span>
                  <GlassStatusBadge 
                    status={activity.status as any} 
                    size="md"
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </PageLayout>
  );
};