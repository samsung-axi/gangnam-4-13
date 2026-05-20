import React, { useState, useEffect } from 'react';
import ModelSettings from './ModelSettings';
import APIKeyManagement from './APIKeyManagement';

const ChatbotManagement = () => {
    const [activeTab, setActiveTab] = useState('model'); // model, stats, logs
    const [modelType, setModelType] = useState('cloud');
    const [selectedAPI, setSelectedAPI] = useState('openai');
    const [apiSettings, setApiSettings] = useState({
        chat: {
            model: 'o1-mini',
            temperature: 0.7,
            maxTokens: 2000,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0
        },
        tts: {
            model: 'tts-1',
            voice: 'alloy',
            speed: 1.0,
            outputFormat: 'mp3'
        },
        stt: {
            model: 'whisper-1',
            inputFormat: 'mp3'
        },
        embedding: {
            model: 'text-embedding-3-small'
        }
    });
    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        if (selectedAPI === 'openai') {
            setApiSettings(prev => ({
                ...prev,
                chat: { ...prev.chat, model: 'gpt-4o-mini' },
                tts: { ...prev.tts, model: 'tts-1', voice: 'alloy' },
                stt: { ...prev.stt, model: 'whisper-1' }
            }));
        } else if (selectedAPI === 'google') {
            setApiSettings(prev => ({
                ...prev,
                chat: { ...prev.chat, model: 'gemini-1.5-flash' },
                tts: { ...prev.tts, model: 'cloud-tts', voice: 'ko-KR-Standard-A' },
                stt: { ...prev.stt, model: 'speech-v2' }
            }));
        }
    }, [selectedAPI]);

    const handleApiKeyChange = (newApiKey) => {
        setApiKey(newApiKey);
    };

    const handleTest = async (testType, input) => {
        if (!apiKey) {
            alert('API 키를 먼저 설정해주세요.');
            return;
        }
        
        // API 호출 로직
        // ...
    };

    const renderStats = () => (
        <div className="hmk-manage-stats">
            <div className="hmk-manage-stat-card">
                <h3>오늘의 상담</h3>
                <div className="hmk-manage-stat-value">234</div>
                <div className="hmk-manage-stat-trend positive">+15%</div>
            </div>
            <div className="hmk-manage-stat-card">
                <h3>평균 응답 시간</h3>
                <div className="hmk-manage-stat-value">1.5초</div>
                <div className="hmk-manage-stat-trend positive">-0.3초</div>
            </div>
            <div className="hmk-manage-stat-card">
                <h3>사용자 만족도</h3>
                <div className="hmk-manage-stat-value">4.8/5.0</div>
                <div className="hmk-manage-stat-trend positive">+0.2</div>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div className="hmk-manage-table-container">
            <table className="hmk-manage-table">
                <thead>
                    <tr>
                        <th>시간</th>
                        <th>사용자</th>
                        <th>내용</th>
                        <th>응답시간</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>14:30:15</td>
                        <td>User123</td>
                        <td>이력서 작성 방법 문의</td>
                        <td>1.2초</td>
                        <td>성공</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="hmk-manage-content-section">
            <div className="hmk-manage-section-header">
                <h1>AI 챗봇 관리</h1>
            </div>

            <div className="hmk-manage-tabs">
                <button 
                    className={`hmk-manage-tab ${activeTab === 'model' ? 'active' : ''}`}
                    onClick={() => setActiveTab('model')}
                >
                    모델 설정
                </button>
                <button 
                    className={`hmk-manage-tab ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    통계
                </button>
                <button 
                    className={`hmk-manage-tab ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    로그
                </button>
            </div>

            {activeTab === 'model' && (
                <div className="hmk-manage-model-container">
                    <div className="hmk-manage-card">
                        <h2>모델 선택</h2>
                        <div className="hmk-manage-radio-group">
                            <label className="hmk-manage-radio">
                                <input
                                    type="radio"
                                    value="local"
                                    checked={modelType === 'local'}
                                    onChange={(e) => setModelType(e.target.value)}
                                />
                                <span>로컬 LLM</span>
                            </label>
                            <label className="hmk-manage-radio">
                                <input
                                    type="radio"
                                    value="cloud"
                                    checked={modelType === 'cloud'}
                                    onChange={(e) => setModelType(e.target.value)}
                                />
                                <span>클라우드 LLM</span>
                            </label>
                        </div>

                        {modelType === 'cloud' && (
                            <>
                                <div className="hmk-manage-select-group">
                                    <label>API 제공자</label>
                                    <select 
                                        value={selectedAPI}
                                        onChange={(e) => setSelectedAPI(e.target.value)}
                                        className="hmk-manage-select"
                                    >
                                        <option value="openai">OpenAI</option>
                                        <option value="google">Google AI</option>
                                    </select>
                                </div>
                                
                                <APIKeyManagement 
                                    selectedAPI={selectedAPI} 
                                    onApiKeyChange={handleApiKeyChange}
                                />
                                <ModelSettings 
                                    settings={apiSettings}
                                    onSettingsChange={setApiSettings}
                                    selectedAPI={selectedAPI}
                                    apiKey={apiKey}
                                    onTest={handleTest}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'stats' && renderStats()}
            {activeTab === 'logs' && renderLogs()}
        </div>
    );
};

export default ChatbotManagement; 