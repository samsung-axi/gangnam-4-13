import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b ${className}`}>
        {children}
    </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
    <h2 className={`text-lg font-semibold ${className}`}>
        {children}
    </h2>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);