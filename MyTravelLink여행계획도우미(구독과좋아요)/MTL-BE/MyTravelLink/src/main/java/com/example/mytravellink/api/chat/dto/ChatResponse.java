package com.example.mytravellink.api.chat.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ChatResponse {

    private String response;
    private String source;
    private List<String> search_results;
}
