package com.bangkoo.back.dto.detection;

import com.bangkoo.back.model.detection.DetectionResult;
import lombok.Data;
import java.util.List;

@Data
public class DetectionResponseDTO {
    private List<DetectionResult> results;
    private String final_image_base64;
    private List<String> thumbnails_base64;
    private String original_image_base64;
}
