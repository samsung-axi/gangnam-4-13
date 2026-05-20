package com.bangkoo.back.model.search;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-15
 *
 *  검색 기록용
 **/
@Data
@Document(collection = "search_logs")
public class SearchLog {
    @Id
    private String id;

    private String query;
    private String user_id;
    private Instant timestamp;
    private String source;
    private long count;
}
