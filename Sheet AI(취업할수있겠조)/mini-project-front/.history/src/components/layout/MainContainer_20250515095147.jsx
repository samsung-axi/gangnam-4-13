import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <div
      className="w-full min-w-full h-[100vh]
    flex justify-center items-center p-0
    "
    >
      <div className="w-full max-w-[48rem] px-2 sm:px-4">{children}</div>
    </div>
  );
};

export default MainContainer;
