import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { AdminHeader } from './components/AdminHeader';
import { StatsOverview } from './components/StatsOverview';
import { SystemDashboard } from './components/SystemDashboard';
import { UserManagement } from './components/UserManagement';
import { useAdminData } from './hooks/useAdminData';
import { LoadingSpinner } from './components/LoadingSpinner';

const Admin = () => {
  const {
    loading,
    showSystemDashboard,
    setShowSystemDashboard,
    refreshing,
    handleRefresh,
    stats,
    systemStats,
    performanceData,
    performanceTimeRange,
    setPerformanceTimeRange
  } = useAdminData();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Section spacing="default">
        <Container size="xl">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <Typography variant="bodySmall">돌아가기</Typography>
            </Link>
            
            <AdminHeader 
              showSystemDashboard={showSystemDashboard}
              setShowSystemDashboard={setShowSystemDashboard}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Statistics Overview */}
          {stats && <StatsOverview stats={stats} />}

          {/* System Dashboard or User Management */}
          {showSystemDashboard ? (
            <SystemDashboard 
              systemStats={systemStats}
              performanceData={performanceData}
              performanceTimeRange={performanceTimeRange}
              setPerformanceTimeRange={setPerformanceTimeRange}
            />
          ) : (
            <UserManagement />
          )}
        </Container>
      </Section>
    </div>
  );
};

export default Admin;