import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(false);
    const [isNotificationsOn, setIsNotificationsOn] = useState(false);

    const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    };

    return (
        <div className="flex justify-around items-center w-full mx-auto p-4 text-black bottom-0 min-h-screen overflow-y-auto">
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">테마변경</h1>
                <div className="flex justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-30 h-16 border-2 border-gray-300 flex items-center justify-center rounded-lg">
                            <span className="text-sm">라이트 모드</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-30 h-16 border-2 border-gray-300 flex items-center justify-center rounded-lg">
                            <span className="text-sm">다크모드</span>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-3">배경음악</span>
                        <div
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                                isBackgroundMusicOn ? 'bg-custom-purple' : 'bg-gray-300'
                            }`}
                            onClick={() => handleToggle(setIsBackgroundMusicOn)}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    isBackgroundMusicOn ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </div>
                    </label>
                </div>
                <div>
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-3">공지사항</span>
                        <div
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                                isNotificationsOn ? 'bg-custom-purple' : 'bg-gray-300'
                            }`}
                            onClick={() => handleToggle(setIsNotificationsOn)}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    isNotificationsOn ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;