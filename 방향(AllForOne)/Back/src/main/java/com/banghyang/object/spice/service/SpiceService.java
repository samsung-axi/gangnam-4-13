package com.banghyang.object.spice.service;

import com.banghyang.common.util.ValidUtils;
import com.banghyang.object.line.entity.Line;
import com.banghyang.object.line.repository.LineRepository;
import com.banghyang.object.spice.dto.SpiceCreateRequest;
import com.banghyang.object.spice.dto.SpiceModifyRequest;
import com.banghyang.object.spice.dto.SpiceResponse;
import com.banghyang.object.spice.entity.Spice;
import com.banghyang.object.spice.entity.SpiceImage;
import com.banghyang.object.spice.repository.SpiceImageRepository;
import com.banghyang.object.spice.repository.SpiceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SpiceService {

    private final SpiceRepository spiceRepository;
    private final SpiceImageRepository spiceImageRepository;
    private final LineRepository lineRepository;

    /**
     * 모든 향료 response 리스트 (영문명 오름차순 정렬)
     */
    public List<SpiceResponse> getAllSpiceResponse() {
        // 모든 향료 entity 가져와서 리스트에 담기
        List<Spice> spiceEntityList = spiceRepository.findAll();

        // 향료 엔티티 리스트 항목들에 접근하여 response 로 변환하여 리턴
        return spiceEntityList.stream().map(spiceEntity -> {
            SpiceResponse spiceResponse = new SpiceResponse();
            spiceResponse.setId(spiceEntity.getId());
            spiceResponse.setNameKr(spiceEntity.getNameKr());
            spiceResponse.setNameEn(spiceEntity.getNameEn());
            spiceResponse.setContentEn(spiceEntity.getContentEn());
            spiceResponse.setContentKr(spiceEntity.getContentKr());
            spiceResponse.setLineId(spiceEntity.getLine().getId());
            spiceResponse.setLineName(spiceEntity.getLine().getName());
            // 이미지는 필수정보가 아니므로 존재유무 확인 후 처리
            List<SpiceImage> spiceImageEntityList = spiceImageRepository.findBySpice(spiceEntity);
            if (!spiceImageEntityList.isEmpty()) {
                List<String> imageUrls = spiceImageEntityList.stream()
                        .map(SpiceImage::getUrl)
                        .toList();
                spiceResponse.setImageUrlList(imageUrls);
            }
            return spiceResponse;
        }).sorted(Comparator.comparing(SpiceResponse::getNameKr)).toList();
    }

    /**
     * 새로운 향로 생성 메소드(향료, 향료이미지)
     */
    public void createSpice(SpiceCreateRequest spiceCreateRequest) {
        if (ValidUtils.isNotBlank(spiceCreateRequest.getLineName())) {
            // 계열 이름이 존재할 시에만 생성 진행
            // 계열이름으로 계열 엔티티 찾아오기
            Line lineEntity = lineRepository.findByName(spiceCreateRequest.getLineName());

            if (lineEntity != null) {
                // 계열 엔티티를 잘 찾아왔으면 생성 진행
                Spice newSpiceEntity = Spice.builder()
                        .nameEn(spiceCreateRequest.getNameEn())
                        .nameKr(spiceCreateRequest.getNameKr())
                        .contentEn(spiceCreateRequest.getContentEn())
                        .contentKr(spiceCreateRequest.getContentKr())
                        .line(lineEntity)
                        .build();
                spiceRepository.save(newSpiceEntity);

                // 이미지 처리
                if (!spiceCreateRequest.getImageUrlList().isEmpty()) {
                    spiceCreateRequest.getImageUrlList().forEach(imageUrl -> {
                        SpiceImage newSpiceImageEntity = SpiceImage.builder()
                                .spice(newSpiceEntity)
                                .url(imageUrl)
                                .build();
                        spiceImageRepository.save(newSpiceImageEntity);
                    });
                }
            } else {
                // 계열 엔티티 찾아오지 못했을 시 예외 발생시키기
                throw new IllegalArgumentException("[향료-서비스-생성]계열명에 해당하는 계열 엔티티를 찾을 수 없습니다.");
            }
        } else {
            // 계열 정보가 존재하지 않는다면 예외 발생시키기
            throw new IllegalArgumentException("[향료-서비스-생성]향료 등록에 필요한 계열 정보가 존재하지 않습니다.");
        }
    }

    /**
     * 향료 정보 수정 메소드
     */
    public void modifySpice(SpiceModifyRequest spiceModifyRequest) {
        // 수정할 향료 엔티티 찾아오기
        Spice targetSpiceEntity = spiceRepository.findById(spiceModifyRequest.getId()).orElseThrow(() ->
                new EntityNotFoundException("[향료-서비스-수정]아이디에 해당하는 향료 엔티티를 찾을 수 없습니다."));
        // 입력된 계열 이름으로 계열 엔티티 찾아오기
        Line lineEntity = lineRepository.findByName(spiceModifyRequest.getLineName());
        if (lineEntity != null) {
            // 계열까지 잘 찾아왔다면 수정 진행
            Spice modifySpiceEntity = Spice.builder()
                    .nameEn(spiceModifyRequest.getNameEn())
                    .nameKr(spiceModifyRequest.getNameKr())
                    .contentEn(spiceModifyRequest.getContentEn())
                    .contentKr(spiceModifyRequest.getContentKr())
                    .line(lineEntity)
                    .build();
            // 향료 엔티티 클래스에 만들어둔 수정 메소드로 수정 진행
            targetSpiceEntity.modify(modifySpiceEntity);
        } else {
            throw new IllegalArgumentException("[향료-서비스-수정]계열명에 해당하는 계열 엔티티를 찾을 수 없습니다.");
        }

        // 이미지 처리
        // 향료에 해당하는 모든 이미지 엔티티 가져오기
        List<SpiceImage> targetSpiceImageEntityList = spiceImageRepository.findBySpice(targetSpiceEntity);
        // 이미지 엔티티 리스트의 항목들에 접근하여 url 만 모아 set 으로 만들기
        Set<String> targetSpiceImageUrlSet = targetSpiceImageEntityList.stream()
                .map(SpiceImage::getUrl)
                .collect(Collectors.toSet());
        // 삭제할 이미지 리스트
        List<SpiceImage> spiceImagesToDelete = targetSpiceImageEntityList.stream()
                .filter(spiceImageEntity ->
                        // 기존에 존재하는 이미지들 중 수정요청 정보에 없는 이미지들 골라내기
                        !spiceModifyRequest.getImageUrlList().contains(spiceImageEntity.getUrl()))
                .toList();
        spiceImageRepository.deleteAll(spiceImagesToDelete);
        // 추가할 이미지 리스트
        List<SpiceImage> spiceImagesToAdd = spiceModifyRequest.getImageUrlList().stream()
                // 수정요청 정보에서 기존 이미지에 해당하지 않는 url 만 골라내기
                .filter(url -> !targetSpiceImageUrlSet.contains(url))
                // 골라낸 url 로 새로운 이미지 엔티티 생성
                .map(url -> SpiceImage.builder()
                        .spice(targetSpiceEntity)
                        .url(url)
                        .build())
                .toList();
        spiceImageRepository.saveAll(spiceImagesToAdd);
        // 기존 이미지와 동일한 수정 요청 정보는 별도의 처리없이 그대로 유지
    }

    /**
     * 향료 삭제 메소드
     * 향료 연관 정보들이 많은 관계로 삭제보단 비활성화 처리로 변경하기
     */
    public void deleteSpice(Long spiceId) {
        // 삭제하려는 향료 엔티티 찾아오기
        Spice targetSpiceEntity = spiceRepository.findById(spiceId).orElseThrow(() ->
                new EntityNotFoundException("[향료-서비스-삭제]아이디에 해당하는 향료 엔티티를 찾을 수 없습니다."));
        // 삭제하려는 향료의 이미지 엔티티 찾아오기
        List<SpiceImage> targetSpiceImageEntityList = spiceImageRepository.findBySpice(targetSpiceEntity);
        // 해당하는 향료 이미지 삭제
        spiceImageRepository.deleteAll(targetSpiceImageEntityList);
        // 해당하는 향료 삭제
        spiceRepository.delete(targetSpiceEntity);
    }
}
