import React, { useState } from 'react';

const FunctionModal = ({ isOpen, onClose, onSave }) => {
    const [functionCode, setFunctionCode] = useState('');

    const handleSave = () => {
        try {
            const parsedFunction = JSON.parse(functionCode);
            onSave(parsedFunction);
            onClose();
        } catch (error) {
            alert('유효한 JSON 형식이 아닙니다.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="hmk-manage-modal-overlay">
            <div className="hmk-manage-modal">
                <div className="hmk-manage-modal-header">
                    <h2>Add function</h2>
                    <button className="hmk-manage-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="hmk-manage-modal-content">
                    <p className="hmk-manage-modal-description">
                        The model will intelligently decide to call functions based on input it receives from the user.
                    </p>
                    <div className="hmk-manage-modal-code-section">
                        <div className="hmk-manage-modal-code-header">
                            <span>Definition</span>
                            <button className="hmk-manage-button">Generate</button>
                        </div>
                        <textarea
                            className="hmk-manage-code-editor"
                            value={functionCode}
                            onChange={(e) => setFunctionCode(e.target.value)}
                            placeholder="Enter JSON schema for the function..."
                            rows={15}
                        />
                    </div>
                </div>
                <div className="hmk-manage-modal-footer">
                    <button className="hmk-manage-button" onClick={onClose}>Cancel</button>
                    <button className="hmk-manage-button primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default FunctionModal; 