package com.example.mytravellink.domain.chat.service;

import com.example.mytravellink.api.chat.dto.ChatRequest;

public interface ChatService {

    String sendMessageToFastAPI(ChatRequest chatRequest);

}
