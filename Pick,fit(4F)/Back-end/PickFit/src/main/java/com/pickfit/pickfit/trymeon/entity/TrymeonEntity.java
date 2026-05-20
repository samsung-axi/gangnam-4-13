package com.pickfit.pickfit.trymeon.entity;

import jakarta.persistence.*; // JPA 관련 어노테이션 가져오기

@Entity // JPA 엔티티 클래스를 선언. 데이터베이스 테이블과 매핑됨
@Table(name = "TryMeOn") // 데이터베이스 테이블 이름을 "TryMeOn"으로 설정
public class TrymeonEntity {

    @Id // 기본 키(primary key)로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 값을 자동 증가하도록 설정
    private Long id; // 엔티티 고유 ID. 데이터베이스에서 자동 생성

    private String imageUrl; // 결과 이미지 URL 저장
    private String userEmail; // 사용자 이메일 저장
    private Long productId; // 상품 ID 저장

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE") // 삭제 여부 필드, 기본값 false
    private boolean deleted = false; // 소프트 삭제 여부를 나타내는 플래그

    // 기본 생성자 (JPA에서 필요)
    public TrymeonEntity() {}

    // 빌더 패턴 사용을 위한 생성자
    private TrymeonEntity(Builder builder) {
        this.imageUrl = builder.imageUrl;
        this.userEmail = builder.userEmail;
        this.productId = builder.productId;
        this.deleted = builder.deleted;
    }

    // Getter 메서드들
    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public String getUserEmail() { return userEmail; }
    public Long getProductId() { return productId; }
    public boolean isDeleted() { return deleted; }

    // 빌더 클래스
    public static class Builder {
        private String imageUrl;
        private String userEmail;
        private Long productId;
        private boolean deleted = false; // 기본값 설정

        public Builder(String userEmail, Long productId) {
            this.userEmail = userEmail;
            this.productId = productId;
        }

        public Builder setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder setDeleted(boolean deleted) {
            this.deleted = deleted;
            return this;
        }

        public TrymeonEntity build() {
            return new TrymeonEntity(this);
        }
    }

    @Override
    public String toString() {
        return "TrymeonEntity{" +
                "id=" + id +
                ", imageUrl='" + imageUrl + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", productId=" + productId +
                ", deleted=" + deleted +
                '}';
    }
}
