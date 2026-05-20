package com.banghyang.chat.dto;

import com.banghyang.chat.entity.Chat;
import com.banghyang.common.type.ChatMode;
import com.banghyang.common.type.ChatType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserChatResponse {
    private String id;
    private Long memberId;
    private ChatMode mode;
    private ChatType type;
    private String content;
    private Long lineId;
    private Long recommendationType; // 1: 일반추천, 2: 패션, 3: 인테리어, 4: 테라피, 0: 일반대화
    private String imageUrl;
    private List<Chat.Recommendation> recommendations;
    private LocalDateTime timeStamp;
}
