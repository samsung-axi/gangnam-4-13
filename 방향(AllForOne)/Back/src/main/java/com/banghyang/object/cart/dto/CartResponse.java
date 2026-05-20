package com.banghyang.object.cart.dto;

import com.banghyang.object.product.entity.Product;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {

    private final Long productId;
    private final String nameEn;
    private final String nameKr;
    private final String brand;
    private final String grade;
    private final String content;
    private final String sizeOption;
    private final String mainAccord;
    private final String ingredients;
    private final Long price;
    private final int quantity;
    private final List<String> imageUrls;


        public CartResponse(Product product, List<String> imageUrls, int quantity) {
            this.productId = product.getId();
            this.nameEn = product.getNameEn();
            this.nameKr = product.getNameKr();
            this.brand = product.getBrand();
            this.grade = product.getGrade();
            this.content = product.getContent();
            this.sizeOption = product.getSizeOption();
            this.mainAccord = product.getMainAccord();
            this.ingredients = product.getIngredients();
            this.price = product.getPrice();
            this.quantity = quantity;
            this.imageUrls = imageUrls.isEmpty()
                    ? List.of("https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg")
                    : imageUrls;
        }

}
