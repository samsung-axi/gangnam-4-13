package com.banghyang.object.wishlist.dto;

import com.banghyang.object.product.entity.Product;
import lombok.Data;

import java.util.List;

@Data
public class WishlistResponse {

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
    private final List<String> imageUrls;
    private final String singleNote;
    private final String topNote;
    private final String middleNote;
    private final String baseNote;

    public WishlistResponse(Product product, List<String> imageUrls,
                                 String singleNote, String topNote, String middleNote, String baseNote) {
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
        this.imageUrls = imageUrls.isEmpty()
                ? List.of("https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg")
                : imageUrls;
        this.singleNote = singleNote;
        this.topNote = topNote;
        this.middleNote = middleNote;
        this.baseNote = baseNote;
    }
}
