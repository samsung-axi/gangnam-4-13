import React from 'react';
import PropTypes from 'prop-types';

/**
 * 에러 메시지를 표시하는 컴포넌트
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="p-4 my-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <svg 
          className="w-5 h-5 text-red-600 mr-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clipRule="evenodd" 
          />
        </svg>
        <p className="text-red-700 font-medium">{message}</p>
      </div>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors duration-200"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorMessage;
