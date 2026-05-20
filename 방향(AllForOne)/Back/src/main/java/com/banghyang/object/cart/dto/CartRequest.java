package com.banghyang.object.cart.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CartRequest {

    private Long memberId;
    private Long productId;

    @Min(value = 1, message = "수량은 1개 이상이어야 합니다")
    @Max(value = 99, message = "수량은 99개를 초과할 수 없습니다")
    private int quantity = 1;
}
