package com.pickfit.pickfit.trymeon.dto;

// DTO (Data Transfer Object) 클래스 선언
public class TrymeonDTO {

    private String clothImageUrl; // 클라이언트에서 보낸 옷 이미지 URL
    private String personImageUrl; // 클라이언트에서 보낸 모델 이미지 URL
    private String bigCategory; // 대분류 카테고리
    private String userEmail; // 사용자 이메일
    private Long productId; // 상품 ID

    // 기본 생성자 (스프링에서 자동으로 객체를 매핑하기 위해 필요)
    public TrymeonDTO() {}

    // 모든 필드를 포함한 생성자
    public TrymeonDTO(String clothImageUrl, String personImageUrl, String bigCategory, String userEmail, Long productId) {
        this.clothImageUrl = clothImageUrl;
        this.personImageUrl = personImageUrl;
        this.bigCategory = bigCategory;
        this.userEmail = userEmail;
        this.productId = productId;
    }

    // Getter 및 Setter 메서드 (각 필드에 접근 및 수정 가능)
    public String getClothImageUrl() {
        return clothImageUrl;
    }

    public void setClothImageUrl(String clothImageUrl) {
        this.clothImageUrl = clothImageUrl;
    }

    public String getPersonImageUrl() {
        return personImageUrl;
    }

    public void setPersonImageUrl(String personImageUrl) {
        this.personImageUrl = personImageUrl;
    }

    public String getBigCategory() {
        return bigCategory;
    }

    public void setBigCategory(String bigCategory) {
        this.bigCategory = bigCategory;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    @Override
    public String toString() {
        // DTO 객체를 문자열로 표현 (디버깅 용도)
        return "TrymeonDTO{" +
                "clothImageUrl='" + clothImageUrl + '\'' +
                ", personImageUrl='" + personImageUrl + '\'' +
                ", bigCategory='" + bigCategory + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", productId=" + productId +
                '}';
    }
}
