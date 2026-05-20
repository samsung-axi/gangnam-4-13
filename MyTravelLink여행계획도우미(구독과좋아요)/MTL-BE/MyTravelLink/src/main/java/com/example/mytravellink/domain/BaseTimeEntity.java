package com.example.mytravellink.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
public abstract class BaseTimeEntity {
    
    @CreatedDate
    @Column(name = "create_at", updatable = false)
    private LocalDateTime createAt;
    
    @LastModifiedDate
    @Column(name = "update_at")
    private LocalDateTime updateAt;
} 