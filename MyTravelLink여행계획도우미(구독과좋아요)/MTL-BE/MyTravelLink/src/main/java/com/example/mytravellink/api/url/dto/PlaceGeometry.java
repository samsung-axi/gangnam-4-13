package com.example.mytravellink.api.url.dto;

import lombok.*;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class PlaceGeometry {
    private BigDecimal latitude;
    private BigDecimal longitude;
} 