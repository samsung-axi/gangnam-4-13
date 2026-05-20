package com.bangkoo.back.model.detection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

import lombok.Data;
import lombok.ToString;
@Data
@ToString
public class DetectionResult {
    @JsonProperty("class")
    private String className;  // class는 Java 예약어이므로 이름 변경
    private double score;
    private List<Integer> bbox;
    private List<List<Integer>> mask;
    private String thumbnail;  // ✅ 이거 추가!
    // getters and setters
}