package com.pickfit.pickfit.wishlist.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")  // "wishlist" 테이블과 매핑
public class WishlistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ID 자동 생성
    private Integer id;

    @Column(name = "user_email", nullable = false)  // 사용자 이메일 컬럼
    private String userEmail;

    @Column(name = "image_url", nullable = false)  // 상품 이미지 URL 컬럼
    private String imageUrl;

    @Column(name = "user_name", nullable = false)  // 사용자 이름 컬럼
    private String userName;

    @Column(name = "price", nullable = false)  // 상품 가격 컬럼
    private String price;

    @Column(name = "product_id", nullable = false)  // 상품 ID 컬럼
    private Long productId;

    @Column(name = "title", nullable = false)  // 상품 제목 컬럼
    private String title;

    @Column(name = "isDeleted")
    private boolean isDeleted = false; // 기본값: false (삭제되지 않은 상태)




    public WishlistEntity() {}

    public WishlistEntity(String userEmail, String imageUrl, String userName, String price, Long productId, String title, boolean isDeleted) {
        this.userEmail = userEmail;
        this.imageUrl = imageUrl;
        this.userName = userName;
        this.price = price;
        this.productId = productId;
        this.title = title;
        this.isDeleted = isDeleted;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }



    @Override
    public String toString() {
        return "WishlistEntity{" +
                "isDeleted=" + isDeleted +
                ", title='" + title + '\'' +
                ", productId=" + productId +
                ", price='" + price + '\'' +
                ", userName='" + userName + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", userEmail='" + userEmail + '\'' +
                '}';
    }
}
