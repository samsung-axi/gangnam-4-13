package com.banghyang.object.note.entity;

import com.banghyang.common.type.NoteType;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.spice.entity.Spice;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 노트 아이디
    private LocalDateTime timeStamp; // 노트 등록일시

    @Enumerated(EnumType.STRING)
    private NoteType noteType; // 노트 타입(SINGLE, TOP, MIDDLE, BASE)

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 노트 해당 제품 아이디

    @ManyToOne
    @JoinColumn(name = "spice_id", nullable = false)
    private Spice spice; // 노트 해당 향료 아이디

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Note(NoteType noteType, Product product, Spice spice) {
        this.noteType = noteType;
        this.product = product;
        this.spice = spice;
    }
}
