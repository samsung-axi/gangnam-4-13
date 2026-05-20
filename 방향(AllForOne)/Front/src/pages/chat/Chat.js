import React, { memo } from 'react';
import ChatContainer from '../../components/chat/layout/ChatContainer';
import { useChat } from './hooks/useChat';

/**
 * Chat 페이지
 * 전체 채팅 기능의 진입점
 */
const Chat = memo(() => {
    const chatLogic = useChat();

    return <ChatContainer {...chatLogic} />;
});

export default Chat;
