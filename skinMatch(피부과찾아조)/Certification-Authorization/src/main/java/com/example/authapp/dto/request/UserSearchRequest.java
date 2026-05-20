package com.example.authapp.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSearchRequest {
    private String search;     // 검색어 (이름, 이메일, 사용자명)
    private String status;     // 사용자 상태 (all, active, inactive)
}
