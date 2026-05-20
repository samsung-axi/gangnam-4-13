import React, { useState } from 'react';
import FunctionModal from './FunctionModal';

const ModelSettings = ({ settings, onSettingsChange, selectedAPI, apiKey, onTest }) => {
    const [isTestExpanded, setIsTestExpanded] = useState(false);
    const [isFunctionModalOpen, setIsFunctionModalOpen] = useState(false);
    const [functions, setFunctions] = useState([]);
    const [testSettings, setTestSettings] = useState({
        responseFormat: 'text',
        prompt: '',
        ttsText: '',
        sttFile: null
    });

    const handleChatSettingChange = (key, value) => {
        onSettingsChange({
            ...settings,
            chat: {
                ...settings.chat,
                [key]: value
            }
        });
    };

    const handleTTSSettingChange = (key, value) => {
        onSettingsChange({
            ...settings,
            tts: {
                ...settings.tts,
                [key]: value
            }
        });
    };

    const handleSTTSettingChange = (key, value) => {
        onSettingsChange({
            ...settings,
            stt: {
                ...settings.stt,
                [key]: value
            }
        });
    };

    const renderChatModelOptions = () => {
        if (selectedAPI === 'openai') {
            return (
                <>
                    <option value="o1-mini">o1-mini</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                </>
            );
        } else if (selectedAPI === 'google') {
            return (
                <>
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                </>
            );
        }
    };

    const renderTTSModelOptions = () => {
        if (selectedAPI === 'openai') {
            return (
                <>
                    <option value="tts-1">TTS-1</option>
                    <option value="tts-1-hd">TTS-1-HD</option>
                </>
            );
        } else if (selectedAPI === 'google') {
            return (
                <>
                    <option value="cloud-tts">Cloud Text-to-Speech</option>
                    <option value="cloud-tts-studio">Cloud TTS Studio</option>
                </>
            );
        }
    };

    const renderTTSVoiceOptions = () => {
        if (selectedAPI === 'openai') {
            return (
                <>
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                </>
            );
        } else if (selectedAPI === 'google') {
            return (
                <>
                    <option value="ko-KR-Standard-A">한국어 여성 음성 A</option>
                    <option value="ko-KR-Standard-B">한국어 여성 음성 B</option>
                    <option value="ko-KR-Standard-C">한국어 남성 음성 A</option>
                    <option value="ko-KR-Standard-D">한국어 남성 음성 B</option>
                </>
            );
        }
    };

    const renderSTTModelOptions = () => {
        if (selectedAPI === 'openai') {
            return <option value="whisper-1">Whisper-1</option>;
        } else if (selectedAPI === 'google') {
            return (
                <>
                    <option value="speech-v2">Speech-to-Text V2</option>
                    <option value="speech-v2-premium">Speech-to-Text V2 Premium</option>
                </>
            );
        }
    };

    const handleFunctionSave = (newFunction) => {
        setFunctions([...functions, newFunction]);
    };

    const handleTestChat = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/chat/test?provider=${selectedAPI}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: testSettings.prompt,
                    responseFormat: testSettings.responseFormat,
                    functions: functions,
                    settings: settings.chat
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Chat test failed');
            }

            const result = await response.json();
            console.log('Chat test result:', result);
            
            // 테스트 결과를 UI에 표시
            const testLogContainer = document.querySelector('.hmk-manage-test-log');
            const newLogItem = document.createElement('div');
            newLogItem.className = 'hmk-manage-test-log-item';
            newLogItem.innerHTML = `
                <span class="hmk-manage-test-timestamp">${new Date().toLocaleTimeString()}</span>
                <span class="hmk-manage-test-type">Chat (${selectedAPI})</span>
                <div class="hmk-manage-test-content">
                    <div class="hmk-manage-test-prompt">Q: ${testSettings.prompt}</div>
                    <div class="hmk-manage-test-response">A: ${result.response}</div>
                </div>
                <span class="hmk-manage-test-status success">성공</span>
            `;
            testLogContainer.insertBefore(newLogItem, testLogContainer.firstChild);
        } catch (error) {
            console.error('Chat test error:', error);
            alert(error.message || '테스트 실행 중 오류가 발생했습니다.');
        }
    };

    const handleTestTTS = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/chat/tts?provider=${selectedAPI}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: testSettings.ttsText,
                    settings: settings.tts
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'TTS test failed');
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            // 오디오 재생 UI 업데이트
            const testLogContainer = document.querySelector('.hmk-manage-test-log');
            const newLogItem = document.createElement('div');
            newLogItem.className = 'hmk-manage-test-log-item';
            newLogItem.innerHTML = `
                <span class="hmk-manage-test-timestamp">${new Date().toLocaleTimeString()}</span>
                <span class="hmk-manage-test-type">TTS (${selectedAPI})</span>
                <div class="hmk-manage-test-content">
                    <div class="hmk-manage-test-prompt">Text: ${testSettings.ttsText}</div>
                    <audio controls src="${audioUrl}"></audio>
                </div>
                <span class="hmk-manage-test-status success">성공</span>
            `;
            testLogContainer.insertBefore(newLogItem, testLogContainer.firstChild);
        } catch (error) {
            console.error('TTS test error:', error);
            alert(error.message || 'TTS 테스트 실행 중 오류가 발생했습니다.');
        }
    };

    const handleTestSTT = async () => {
        if (!testSettings.sttFile) {
            alert('음성 파일을 선택해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('audio', testSettings.sttFile);
            formData.append('settings', JSON.stringify(settings.stt));

            const response = await fetch('http://localhost:4000/api/stt/test', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('STT test failed');
            }

            const result = await response.json();
            console.log('STT test result:', result);
            // 결과 UI 업데이트
        } catch (error) {
            console.error('STT test error:', error);
            alert('STT 테스트 실행 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="hmk-manage-model-settings">
            <div className="hmk-manage-settings-section">
                <h3>Chat 설정</h3>
                <div className="hmk-manage-settings-grid">
                    <div className="hmk-manage-setting-item">
                        <label>모델</label>
                        <select
                            value={settings.chat.model}
                            onChange={(e) => handleChatSettingChange('model', e.target.value)}
                            className="hmk-manage-select"
                        >
                            {renderChatModelOptions()}
                        </select>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>Temperature</label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.chat.temperature}
                            onChange={(e) => handleChatSettingChange('temperature', parseFloat(e.target.value))}
                        />
                        <span>{settings.chat.temperature}</span>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>Max Tokens</label>
                        <input
                            type="number"
                            value={settings.chat.maxTokens}
                            onChange={(e) => handleChatSettingChange('maxTokens', parseInt(e.target.value))}
                            className="hmk-manage-input"
                        />
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>Top P</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.chat.topP}
                            onChange={(e) => handleChatSettingChange('topP', parseFloat(e.target.value))}
                        />
                        <span>{settings.chat.topP}</span>
                    </div>
                </div>
            </div>

            <div className="hmk-manage-settings-section">
                <h3>TTS 설정</h3>
                <div className="hmk-manage-settings-grid">
                    <div className="hmk-manage-setting-item">
                        <label>모델</label>
                        <select
                            value={settings.tts.model}
                            onChange={(e) => handleTTSSettingChange('model', e.target.value)}
                            className="hmk-manage-select"
                        >
                            {renderTTSModelOptions()}
                        </select>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>음성</label>
                        <select
                            value={settings.tts.voice}
                            onChange={(e) => handleTTSSettingChange('voice', e.target.value)}
                            className="hmk-manage-select"
                        >
                            {renderTTSVoiceOptions()}
                        </select>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>재생 속도</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={settings.tts.speed}
                            onChange={(e) => handleTTSSettingChange('speed', parseFloat(e.target.value))}
                        />
                        <span>{settings.tts.speed}x</span>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>출력 파일 형식</label>
                        <select
                            value={settings.tts.outputFormat}
                            onChange={(e) => handleTTSSettingChange('outputFormat', e.target.value)}
                            className="hmk-manage-select"
                        >
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                            <option value="ogg">OGG</option>
                            <option value="flac">FLAC</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="hmk-manage-settings-section">
                <h3>STT 설정</h3>
                <div className="hmk-manage-settings-grid">
                    <div className="hmk-manage-setting-item">
                        <label>모델</label>
                        <select
                            value={settings.stt.model}
                            onChange={(e) => handleSTTSettingChange('model', e.target.value)}
                            className="hmk-manage-select"
                        >
                            {renderSTTModelOptions()}
                        </select>
                    </div>
                    <div className="hmk-manage-setting-item">
                        <label>입력 파일 형식</label>
                        <select
                            value={settings.stt.inputFormat}
                            onChange={(e) => handleSTTSettingChange('inputFormat', e.target.value)}
                            className="hmk-manage-select"
                        >
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                            <option value="ogg">OGG</option>
                            <option value="m4a">M4A</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="hmk-manage-settings-section">
                <button 
                    className="hmk-manage-accordion-header"
                    onClick={() => setIsTestExpanded(!isTestExpanded)}
                >
                    <h3>모델 테스트</h3>
                    <span className={`hmk-manage-accordion-icon ${isTestExpanded ? 'expanded' : ''}`}>
                        ▼
                    </span>
                </button>
                
                {isTestExpanded && (
                    <div className="hmk-manage-test-container">
                        <div className="hmk-manage-test-chat">
                            <h4>Chat 테스트</h4>
                            <div className="hmk-manage-test-options">
                                <div className="hmk-manage-setting-item">
                                    <label>Response Format</label>
                                    <select
                                        value={testSettings.responseFormat}
                                        onChange={(e) => setTestSettings({
                                            ...testSettings,
                                            responseFormat: e.target.value
                                        })}
                                        className="hmk-manage-select"
                                    >
                                        <option value="text">Text</option>
                                        <option value="json_object">JSON Object</option>
                                        <option value="json_schema">JSON Schema</option>
                                    </select>
                                </div>
                                <button 
                                    className="hmk-manage-button"
                                    onClick={() => setIsFunctionModalOpen(true)}
                                >
                                    Add Function
                                </button>
                            </div>
                            {functions.length > 0 && (
                                <div className="hmk-manage-functions-list">
                                    <h5>등록된 Functions</h5>
                                    {functions.map((func, index) => (
                                        <div key={index} className="hmk-manage-function-item">
                                            <span>{func.name}</span>
                                            <button 
                                                className="hmk-manage-button-small danger"
                                                onClick={() => setFunctions(functions.filter((_, i) => i !== index))}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="hmk-manage-test-input-group">
                                <textarea
                                    className="hmk-manage-test-input"
                                    placeholder="테스트할 프롬프트를 입력하세요..."
                                    rows={4}
                                    value={testSettings.prompt}
                                    onChange={(e) => setTestSettings({
                                        ...testSettings,
                                        prompt: e.target.value
                                    })}
                                />
                                <button 
                                    className="hmk-manage-button"
                                    onClick={handleTestChat}
                                >
                                    테스트 실행
                                </button>
                            </div>
                        </div>

                        <div className="hmk-manage-test-voice">
                            <h4>음성 변환 테스트</h4>
                            <div className="hmk-manage-test-input-group">
                                <input
                                    type="text"
                                    className="hmk-manage-test-input"
                                    placeholder="TTS로 변환할 텍스트를 입력하세요..."
                                    value={testSettings.ttsText}
                                    onChange={(e) => setTestSettings({
                                        ...testSettings,
                                        ttsText: e.target.value
                                    })}
                                />
                                <button 
                                    className="hmk-manage-button"
                                    onClick={handleTestTTS}
                                >
                                    TTS 테스트
                                </button>
                            </div>
                            <div className="hmk-manage-test-input-group">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    className="hmk-manage-test-input"
                                    onChange={(e) => setTestSettings({
                                        ...testSettings,
                                        sttFile: e.target.files[0]
                                    })}
                                />
                                <button 
                                    className="hmk-manage-button"
                                    onClick={handleTestSTT}
                                >
                                    STT 테스트
                                </button>
                            </div>
                        </div>

                        <div className="hmk-manage-test-results">
                            <h4>테스트 결과</h4>
                            <div className="hmk-manage-test-log">
                                <div className="hmk-manage-test-log-item">
                                    <span className="hmk-manage-test-timestamp">14:30:15</span>
                                    <span className="hmk-manage-test-type">Chat</span>
                                    <div className="hmk-manage-test-content">
                                        <div className="hmk-manage-test-prompt">
                                            Q: 이력서 작성 방법을 알려주세요.
                                        </div>
                                        <div className="hmk-manage-test-response">
                                            A: 이력서 작성 시에는 다음과 같은 사항을 고려하시면 좋습니다...
                                        </div>
                                    </div>
                                    <span className="hmk-manage-test-status success">성공</span>
                                </div>
                                <div className="hmk-manage-test-log-item">
                                    <span className="hmk-manage-test-timestamp">14:29:30</span>
                                    <span className="hmk-manage-test-type">TTS</span>
                                    <div className="hmk-manage-test-content">
                                        <audio controls src="test-audio-url.mp3"></audio>
                                    </div>
                                    <span className="hmk-manage-test-status success">성공</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FunctionModal 
                isOpen={isFunctionModalOpen}
                onClose={() => setIsFunctionModalOpen(false)}
                onSave={handleFunctionSave}
            />
        </div>
    );
};

export default ModelSettings; 