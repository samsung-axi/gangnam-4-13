import React from 'react';
import { Typography } from '@/components/ui/theme-typography';
import { Users, UserCheck, User, Activity } from 'lucide-react';
import { AdminStats } from '../types';

interface StatsOverviewProps {
  stats: AdminStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      title: '총 회원수',
      value: stats.totalUsers.toLocaleString() + '명',
      icon: Users,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      title: '온라인 회원',
      value: stats.onlineUsers.toLocaleString() + '명',
      icon: UserCheck,
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
    {
      title: '신규 가입 (오늘)',
      value: stats.newUsersToday.toLocaleString() + '명',
      icon: User,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    },
    {
      title: '총 분석 건수',
      value: stats.totalAnalyses.toLocaleString() + '건',
      icon: Activity,
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="bodySmall" className="text-muted-foreground font-medium">
                {card.title}
              </Typography>
              <Typography variant="h5" className="mt-1">
                {card.value}
              </Typography>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};