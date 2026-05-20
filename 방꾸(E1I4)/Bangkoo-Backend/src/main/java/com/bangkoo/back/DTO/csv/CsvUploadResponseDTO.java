package com.bangkoo.back.dto.csv;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CsvUploadResponseDTO {
    private int successCount;
    private int failureCount;
    private List<String> errors;
}
