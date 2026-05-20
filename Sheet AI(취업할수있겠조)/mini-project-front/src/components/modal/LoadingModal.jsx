import React from 'react';

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="p-6 rounded-lg  z-10 flex flex-col items-center">
        <img
          src="/loadingPicture.png"
          alt="Loading"
          className="w-32 h-32 animate-pulse"
        />
      </div>
    </div>
  );
};

export default LoadingModal;
