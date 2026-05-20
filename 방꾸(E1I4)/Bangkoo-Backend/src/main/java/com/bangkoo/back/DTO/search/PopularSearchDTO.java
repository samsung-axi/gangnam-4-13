package com.bangkoo.back.dto.search;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-15
 *
 *  인기 검색 기록용
 **/

@Data
@AllArgsConstructor
public class PopularSearchDTO {
    private String query;
    private long count;
}
