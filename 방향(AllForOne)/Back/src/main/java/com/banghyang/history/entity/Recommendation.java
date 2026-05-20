package com.banghyang.history.entity;

import com.banghyang.object.product.entity.Product;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table
@NoArgsConstructor
@Getter
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 추천 정보 아이디

    private String reason; // 추천하는 이유
    private String situation; // 추천하는 상황
    private LocalDateTime timeStamp; // 추천정보 생성일시

    @ManyToOne
    @JoinColumn(name = "history_id")
    private History history; // 추천내용이 담길 히스토리 아이디

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product; // 추천할 제품 아이디

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    @Builder
    public Recommendation(
            History history,
            Product product,
            String reason,
            String situation
    ) {
        this.history = history;
        this.product = product;
        this.reason = reason;
        this.situation = situation;
    }
}
