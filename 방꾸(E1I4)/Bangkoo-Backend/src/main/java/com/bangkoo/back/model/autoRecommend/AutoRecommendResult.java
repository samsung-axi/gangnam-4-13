package com.bangkoo.back.model.autoRecommend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 최초 작성자 : 김병훈
 *
 * Ai 분석 결과 객체 model
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoRecommendResult {
    private String style;
    private String category;
}
