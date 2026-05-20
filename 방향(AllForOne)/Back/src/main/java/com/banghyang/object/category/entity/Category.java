package com.banghyang.object.category.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 카테고리 아이디
    private String name; // 카테고리명
    private LocalDateTime timeStamp; // 카테고리 등록일시

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    @Builder
    public Category(String name) {
        this.name = name;
    }
}
