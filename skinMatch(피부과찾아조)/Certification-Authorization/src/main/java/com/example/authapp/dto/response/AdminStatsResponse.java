package com.example.authapp.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private Long totalUsers;        // 총 사용자 수
    private Long onlineUsers;       // 현재 접속 중인 사용자 수
    private Long recentlyActiveUsers; // 최근 활동 사용자 수 (5분 이내)
    private Long newUsersToday;     // 오늘 가입한 사용자 수
    private Long totalAnalyses;     // 총 분석 수 (나중에 AI 분석 서비스와 연동)
    private Long analysesToday;     // 오늘 분석 수
}
