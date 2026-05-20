import React, { useState, useEffect } from 'react';

const APIKeyManagement = ({ selectedAPI, onApiKeyChange }) => {
    const [apiKey, setApiKey] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [hasStoredKey, setHasStoredKey] = useState(false);

    // API 키 저장
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/apiKeys/${selectedAPI}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
                credentials: 'include'
            });

            if (response.ok) {
                setIsEditing(false);
                setHasStoredKey(true);
                setApiKey(''); // 보안을 위해 클라이언트의 메모리에서 제거
                onApiKeyChange(selectedAPI); // API 제공자 정보만 전달
            } else {
                alert('API 키 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 키 저장 오류:', error);
            alert('API 키 저장 중 오류가 발생했습니다.');
        }
    };

    // API 키 삭제
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/apiKeys/${selectedAPI}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setHasStoredKey(false);
                setApiKey('');
                onApiKeyChange(null);
            }
        } catch (error) {
            console.error('API 키 삭제 오류:', error);
            alert('API 키 삭제 중 오류가 발생했습니다.');
        }
    };

    // API 키 존재 여부 확인
    useEffect(() => {
        const checkApiKey = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/apiKeys/${selectedAPI}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setHasStoredKey(data.exists);
            } catch (error) {
                console.error('API 키 확인 오류:', error);
            }
        };

        checkApiKey();
    }, [selectedAPI]);

    return (
        <div className="hmk-manage-api-key">
            <h3>API 키 관리</h3>
            <div className="hmk-manage-api-key-content">
                {isEditing ? (
                    <div className="hmk-manage-api-key-edit">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={`${selectedAPI} API 키 입력`}
                        />
                        <button 
                            className="hmk-manage-button"
                            onClick={handleSave}
                        >
                            저장
                        </button>
                        <button 
                            className="hmk-manage-button"
                            onClick={() => setIsEditing(false)}
                        >
                            취소
                        </button>
                    </div>
                ) : (
                    <div className="hmk-manage-api-key-display">
                        <span>{hasStoredKey ? '••••••••' : 'API 키가 설정되지 않았습니다'}</span>
                        <button 
                            className="hmk-manage-button"
                            onClick={() => setIsEditing(true)}
                        >
                            {hasStoredKey ? '수정' : '추가'}
                        </button>
                        {hasStoredKey && (
                            <button 
                                className="hmk-manage-button danger"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default APIKeyManagement; 