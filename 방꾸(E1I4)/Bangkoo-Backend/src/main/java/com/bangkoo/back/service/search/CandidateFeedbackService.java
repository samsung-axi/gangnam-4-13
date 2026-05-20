package com.bangkoo.back.service.search;

import com.bangkoo.back.model.search.CandidateFeedback;
import com.bangkoo.back.repository.search.CandidateFeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class CandidateFeedbackService {
    private final CandidateFeedbackRepository repo;

    public CandidateFeedbackService(CandidateFeedbackRepository repo) {
        this.repo = repo;
    }

    /**
     * @param candidates  Python → Java 로 전달된 후보 리스트
     * @param userId      로그인된 유저 ID (없으면 null)
     */
    public void saveImpressions(List<Map<String,Object>> candidates, String userId) {
        Date now = new Date();
        for (Map<String,Object> cand : candidates) {

            Object rawLink = cand.get("링크");
            if (rawLink == null) {
                // '링크' 필드가 없으면 로그만 남기고 다음으로
//                System.out.println("saveImpressions: '링크' 키가 없습니다. cand={}" + cand);
                continue;
            }

            String candidateId = cand.get("링크").toString();
            // id 조합
            String docId = candidateId + "_" + (userId != null ? userId : "ANON");

            // 복합 조회
            CandidateFeedback fb = repo.findById(docId)
                    .orElse(CandidateFeedback.builder()
                            .id(docId)
                            .candidateId(candidateId)
                            .userId(userId)
                            .impressions(0)
                            .clicks(0)
                            .lastUpdated(now)
                            .build());

            fb.setImpressions(fb.getImpressions() + 1);
            fb.setLastUpdated(now);
            repo.save(fb);
        }
    }
}
