// src/components/common/ApplyButton.js
import React from 'react';

export default function ApplyButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 10,
                padding: '10px 20px',
                backgroundColor: '#ff8800',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
            }}
        >
            🪑 적용
        </button>
    );
}
