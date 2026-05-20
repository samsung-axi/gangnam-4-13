package com.example.mytravellink.api.url.dto;

import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Location {
    private BigDecimal lat;
    private BigDecimal lng;
}
