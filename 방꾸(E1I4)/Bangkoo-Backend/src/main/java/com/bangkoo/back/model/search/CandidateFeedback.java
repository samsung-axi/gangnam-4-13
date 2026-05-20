package com.bangkoo.back.model.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection="candidate_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateFeedback {
    @Id
    private String id;

    private String candidateId;
    private String userId;
    private long impressions;
    private long clicks;
    private Date lastUpdated;

}
