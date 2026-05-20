package com.banghyang.object.product.entity;

import com.banghyang.object.category.entity.Category;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;            // 제품 아이디
    private String nameEn;      // 제품 영문명
    private String nameKr;      // 제품 한글명
    private String brand;       // 제품 브랜드
    private String grade;       // 제품 부향률
    private String content;     // 제품 설명
    private String sizeOption;  // 제품 용량
    private String mainAccord;  // 제품 메인향
    private Long price;         // 제품 가격

    @Lob
    @Column(columnDefinition = "TEXT") // mysql 에서 text 로 저장하게하여 길이 늘리기
    private String ingredients; // 제품 성분

    private LocalDateTime timeStamp;    // 제품 등록일시

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // 제품 카테고리

    // 생성시간 자동 입력
    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Product(String nameEn, String nameKr, String brand, String grade, String content, String sizeOption, String mainAccord, String ingredients, Category category, Long price) {
        this.nameEn = nameEn;
        this.nameKr = nameKr;
        this.brand = brand;
        this.grade = grade;
        this.content = content;
        this.sizeOption = sizeOption;
        this.mainAccord = mainAccord;
        this.ingredients = ingredients;
        this.category = category;
        this.price = price;
    }

    // 제품 정보 수정 메소드
    public void modify(Product modifyProductEntity) {
        this.nameEn = modifyProductEntity.getNameEn();
        this.nameKr = modifyProductEntity.getNameKr();
        this.brand = modifyProductEntity.getBrand();
        this.grade = modifyProductEntity.getGrade();
        this.content = modifyProductEntity.getContent();
        this.sizeOption = modifyProductEntity.getSizeOption();
        this.mainAccord = modifyProductEntity.getMainAccord();
        this.ingredients = modifyProductEntity.getIngredients();
        this.category = modifyProductEntity.getCategory();
    }
}
