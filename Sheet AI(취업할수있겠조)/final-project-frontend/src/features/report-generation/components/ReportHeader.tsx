import React from 'react';

interface ReportHeaderProps {
  companyName: string;
  subtitle: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ companyName, subtitle }) => (
  <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 avoid-break'>
    <h1 className='text-3xl font-bold mb-2'>{companyName} 신용등급 보고서</h1>
    <p className='text-blue-100 text-lg'>{subtitle}</p>
  </div>
);
