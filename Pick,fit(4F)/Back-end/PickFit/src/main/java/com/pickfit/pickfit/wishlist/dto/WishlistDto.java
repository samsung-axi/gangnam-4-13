package com.pickfit.pickfit.wishlist.dto;

public class WishlistDto {

    private String userEmail;
    private String imageUrl;
    private String userName;
    private String price;
    private Long productId;
    private String title;

    public WishlistDto() {}

    public WishlistDto(String userEmail, String imageUrl, String userName, String price, Long productId, String title) {
        this.userEmail = userEmail;
        this.imageUrl = imageUrl;
        this.userName = userName;
        this.price = price;
        this.productId = productId;
        this.title = title;
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

    @Override
    public String toString() {
        return "WishlistDto{" +
                "userEmail='" + userEmail + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", userName='" + userName + '\'' +
                ", price='" + price + '\'' +
                ", productId=" + productId +
                ", title='" + title + '\'' +
                '}';
    }
}
