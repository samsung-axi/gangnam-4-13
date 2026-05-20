package com.banghyang.object.spice.entity;

import com.banghyang.object.line.entity.Line;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Spice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 향료 아이디
    private String nameEn; // 향료 영문명
    private String nameKr; // 향료 한글명
    @Lob
    @Column(columnDefinition = "TEXT")
    private String contentEn; // 향료 영문설명
    @Lob
    @Column(columnDefinition = "TEXT")
    private String contentKr; // 향료 한글설명
    private LocalDateTime timeStamp; // 향료 등록일시
    @ManyToOne
    @JoinColumn(name = "line_id", nullable = false)
    private Line line; // 향료의 계열 아이디

    @PrePersist
    public void prePersist() {
        timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Spice(String nameEn, String nameKr, String contentEn, String contentKr, Line line) {
        this.nameEn = nameEn;
        this.nameKr = nameKr;
        this.contentEn = contentEn;
        this.contentKr = contentKr;
        this.line = line;
    }

    // 향료 정보 수정 메소드
    public void modify(Spice modifySpiceEntity) {
        this.nameEn = modifySpiceEntity.getNameEn();
        this.nameKr = modifySpiceEntity.getNameKr();
        this.contentEn = modifySpiceEntity.getContentEn();
        this.contentKr = modifySpiceEntity.getContentKr();
        this.line = modifySpiceEntity.getLine();
    }
}
