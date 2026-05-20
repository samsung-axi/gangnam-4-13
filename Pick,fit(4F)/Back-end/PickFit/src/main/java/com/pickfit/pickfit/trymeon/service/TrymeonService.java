package com.pickfit.pickfit.trymeon.service;

import com.pickfit.pickfit.trymeon.entity.TrymeonEntity; // 엔티티 클래스 가져오기
import com.pickfit.pickfit.trymeon.repository.TrymeonRepository; // 레포지토리 인터페이스 가져오기
import org.springframework.beans.factory.annotation.Autowired; // 의존성 주입을 위한 어노테이션
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service; // 스프링 서비스 계층으로 선언
import org.springframework.web.server.ResponseStatusException;

import java.util.List; // 리스트 타입 사용
import java.util.Optional; // Optional 사용

@Service // 서비스 어노테이션 추가
public class TrymeonService {

    private final TrymeonRepository trymeonRepository;

    @Autowired // 의존성 주입
    public TrymeonService(TrymeonRepository trymeonRepository) {
        this.trymeonRepository = trymeonRepository;
    }

    // 이미지 URL을 DB에 저장하는 메서드
    public TrymeonEntity saveTrymeonImage(String imageUrl, String userEmail, Long productId) {
        // 입력 데이터 검증
        if (imageUrl == null || imageUrl.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image URL cannot be null or empty.");
        }
        if (userEmail == null || userEmail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User email cannot be null or empty.");
        }
        if (productId == null || productId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID must be a valid positive number.");
        }

        // 엔티티 생성
        TrymeonEntity trymeonEntity = new TrymeonEntity.Builder(userEmail, productId)
                .setImageUrl(imageUrl) // 이미지 URL 설정
                .build();

        return trymeonRepository.save(trymeonEntity); // 엔티티 저장
    }

    // 특정 사용자와 상품 ID로 삭제되지 않은 데이터를 조회
    public TrymeonEntity getTrymeonImage(String userEmail, Long productId) {
        if (userEmail == null || userEmail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User email cannot be null or empty.");
        }
        if (productId == null || productId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID must be a valid positive number.");
        }

        return Optional.ofNullable(trymeonRepository.findByUserEmailAndProductIdAndDeletedFalse(userEmail, productId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TryMeOn image not found for the specified user and product."));
    }

    // 삭제되지 않은 모든 데이터를 조회
    public List<TrymeonEntity> getAllImages() {
        List<TrymeonEntity> images = trymeonRepository.findAllByDeletedFalse();
        if (images.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No TryMeOn images found.");
        }
        return images;
    }

    // 특정 ID의 데이터를 소프트 삭제 처리
    public void deleteTrymeonImage(Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID must be a valid positive number.");
        }

        TrymeonEntity entity = trymeonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image with the specified ID not found."));

        if (entity.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Image is already deleted.");
        }

        // 삭제 상태로 변경
        entity = new TrymeonEntity.Builder(entity.getUserEmail(), entity.getProductId())
                .setImageUrl(entity.getImageUrl())
                .setDeleted(true)
                .build();

        trymeonRepository.save(entity); // 변경된 데이터 저장
    }
}
