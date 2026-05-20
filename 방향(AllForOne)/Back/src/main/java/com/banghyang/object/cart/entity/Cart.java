package com.banghyang.object.cart.entity;

import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "product_id"})
})
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private LocalDateTime timeStamp; // 생성일시

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;           // 사용자 아이디

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;         // 제품 아이디

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Cart(Member member, Product product, int quantity) {
        this.member = member;
        this.product = product;
        this.quantity = quantity;
    }



}
