package com.banghyang.chat.dto;

import com.banghyang.common.type.ChatMode;
import com.banghyang.common.type.ChatType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatResponse {
    private Long id;
    private Long memberId;
    private String content;
    private String imageUrl;
    private Long lineId;
    private ChatType type;
    private ChatMode mode;
    private LocalDateTime timeStamp;
}
