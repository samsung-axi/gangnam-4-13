package com.bangkoo.back.repository.search;

import com.bangkoo.back.model.search.CandidateFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CandidateFeedbackRepository
        extends MongoRepository<CandidateFeedback, String> {

    Optional<CandidateFeedback> findByCandidateIdAndUserId(String candidateId, String userId);

}
