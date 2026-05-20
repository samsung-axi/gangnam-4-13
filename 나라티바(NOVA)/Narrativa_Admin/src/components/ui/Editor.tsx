import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-full px-3 sm:px-4 py-2 text-base sm:text-lg font-contents border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-inset focus:ring-pointer focus:border-pointer resize-none"
      style={{ 
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box'
      }}
    />
  );
};

export default Editor; 