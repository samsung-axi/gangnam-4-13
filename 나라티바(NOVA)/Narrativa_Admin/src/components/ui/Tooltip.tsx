import React, { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap 
          bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1
          before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
          before:border-4 before:border-transparent before:border-t-gray-900"
        >
          {content}
        </div>
      )}
    </div>
  );
};
