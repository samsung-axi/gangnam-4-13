package com.bangkoo.back.model.detection;

import lombok.Data;

@Data
public class Detection {
    private String label;
    private float confidence;
    private int x;
    private int y;
    private int width;
    private int height;
}


