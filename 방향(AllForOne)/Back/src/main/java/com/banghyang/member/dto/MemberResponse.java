package com.banghyang.member.dto;

import com.banghyang.member.entity.Member;
import com.banghyang.common.type.MemberRoleType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MemberResponse {
    private String email;
    private String name;
    private String gender;
    private String birthyear;
    private MemberRoleType role;
    private LocalDateTime createdAt;

    public MemberResponse from(Member memberEntity) {
        this.email = memberEntity.getEmail();
        this.name = memberEntity.getName();
        this.gender = memberEntity.getGender();
        this.birthyear = memberEntity.getBirthyear();
        this.role = memberEntity.getRole();
        this.createdAt = memberEntity.getCreatedAt();
        return this;
    }
}
