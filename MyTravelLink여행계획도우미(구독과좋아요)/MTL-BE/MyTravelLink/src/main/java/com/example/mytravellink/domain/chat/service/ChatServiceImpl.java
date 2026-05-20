package com.example.mytravellink.domain.chat.service;

import com.example.mytravellink.api.chat.dto.ChatRequest;
import com.example.mytravellink.infrastructure.ai.chat.AIChatInfrastructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    private final AIChatInfrastructure aiChatInfrastructure;

    @Autowired
    public ChatServiceImpl(AIChatInfrastructure aiChatInfrastructure) {
        this.aiChatInfrastructure = aiChatInfrastructure;
    }

    /*
     * 챗팅 보내기
     * @param sendChat
     * @return Chat
     * */
    @Override
    public String sendMessageToFastAPI(ChatRequest chatRequest){
        return aiChatInfrastructure.callFastAPI(chatRequest);
    }
}
