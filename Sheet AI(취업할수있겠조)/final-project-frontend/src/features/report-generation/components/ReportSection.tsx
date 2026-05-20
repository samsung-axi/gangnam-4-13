import React from 'react';

interface Section {
  name: string;
  description?: string;
  content: string;
}

interface ReportSectionProps {
  section: Section;
}

interface ReportSectionsProps {
  sections: Section[];
}

const ReportSection: React.FC<ReportSectionProps> = ({ section }) => (
  <div className='report-section avoid-break mb-8 page-break'>
    <h3 className='text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2'>
      <div className='report-section-title'>{section.name}</div>
    </h3>
    {section.description && (
      <div className='bg-blue-50 p-4 rounded-lg mb-4'>
        <p className='text-base font-medium text-blue-800'>
          <div className='report-section-description'>{section.description}</div>
        </p>
      </div>
    )}
    <div className='text-base leading-relaxed text-gray-700 whitespace-pre-line'>
      {section.content}
    </div>
  </div>
);

const ReportSections: React.FC<ReportSectionsProps> = ({ sections }) => (
  <>
    {sections.map((section: Section, index: number) => (
      <ReportSection key={index} section={section} />
    ))}
  </>
);

export default ReportSections;
