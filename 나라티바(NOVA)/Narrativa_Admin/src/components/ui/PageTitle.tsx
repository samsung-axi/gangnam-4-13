import React from 'react';

interface PageTitleProps {
  title: string;
  rightElement?: React.ReactNode;
}

const PageTitle = ({ title, rightElement }: PageTitleProps) => {
  return (
    <div className="flex items-center justify-between h-[60px]">
      <h1 className="text-sm sm:text-2xl font-title font-bold text-pointer">{title}</h1>
      {rightElement && <div className='font-contents'>{rightElement}</div>}
    </div>
  );
};

export default PageTitle;