package com.example.mytravellink.api.chat;

import com.example.mytravellink.api.chat.dto.ChatRequest;
import com.example.mytravellink.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage (@RequestBody ChatRequest chatRequest){

        String response = chatService.sendMessageToFastAPI(chatRequest);
        return ResponseEntity.ok(response);
    }
}
