import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-md bg-gray-50 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div 
              className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">AI가 응답을 생성하고 있습니다...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
