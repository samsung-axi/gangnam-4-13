package com.banghyang.object.line.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Line {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 계열 아이디

    private String name; // 계열명
    private String content; // 계열설명
    private LocalDateTime timeStamp; // 계열 등록일시

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    @Builder
    public Line(String name, String content) {
        this.name = name;
        this.content = content;
    }
}
