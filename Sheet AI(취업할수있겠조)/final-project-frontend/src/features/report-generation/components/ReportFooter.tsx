import React from 'react';

const ReportFooter: React.FC = () => (
  <div className='footer-container text-center mt-16 pt-8 border-t-2 border-gray-200'>
    <div className='text-sm text-gray-500 mb-2'>
      본 보고서는 AI에 의해 자동 생성되었으며, 참고용으로만 사용하시기 바랍니다.
    </div>
    <div className='text-sm text-gray-400'>{new Date().getFullYear()} SheetAI</div>
  </div>
);

export default ReportFooter;
