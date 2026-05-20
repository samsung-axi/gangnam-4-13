package com.banghyang.object.product.service;

import com.banghyang.common.type.NoteType;
import com.banghyang.object.category.entity.Category;
import com.banghyang.object.category.entity.repository.CategoryRepository;
import com.banghyang.object.note.entity.Note;
import com.banghyang.object.note.repository.NoteRepository;
import com.banghyang.object.product.dto.*;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import com.banghyang.object.spice.entity.Spice;
import com.banghyang.object.spice.repository.SpiceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final NoteRepository noteRepository;
    private final SpiceRepository spiceRepository;
    private final SimilarPerfumeService similarPerfumeService;

    /**
     * @return 모든 향수 response 리스트(name 기준 오름차순 정렬)
     */
    @Cacheable(value = "products") // 캐싱 사용
    public List<PerfumeResponse> getAllPerfumeResponses() {
        // perfume 엔티티 전체 가져와서 리스트에 담기
        List<Product> perfumeEntityList = productRepository.findByCategoryId(1L); // 향수 카테고리 아이디는 1(Long)

        // 향수 엔티티 리스트에 stream 으로 항목마다 접근하여 response 로 변환하는 작업 거치기
        return perfumeEntityList.stream().map(perfumeEntity -> {
                    PerfumeResponse perfumeResponse = new PerfumeResponse();
                    perfumeResponse.setId(perfumeEntity.getId()); // 아이디
                    perfumeResponse.setNameEn(perfumeEntity.getNameEn()); // 영문명
                    perfumeResponse.setNameKr(perfumeEntity.getNameKr()); // 한글명
                    perfumeResponse.setBrand(perfumeEntity.getBrand()); // 브랜드
                    perfumeResponse.setGrade(perfumeEntity.getGrade()); // 부향률
                    perfumeResponse.setContent(perfumeEntity.getContent()); // 설명
                    perfumeResponse.setSizeOption(perfumeEntity.getSizeOption()); // 용량 옵션
                    perfumeResponse.setMainAccord(perfumeEntity.getMainAccord()); // 메인어코드
                    perfumeResponse.setIngredients(perfumeEntity.getIngredients()); // 성분

                    // 이미지
                    perfumeResponse.setImageUrlList(
                            productImageRepository.findByProduct(perfumeEntity).stream()
                                    .map(productImage -> {
                                        if (productImage.getNoBgUrl() != null) {
                                            // 배경제거 이미지가 있으면 배경 제거 이미지 URL 로 반환
                                            return productImage.getNoBgUrl();
                                        } else {
                                            // 배경제거 이미지가 없으면 기존 이미지로 반환
                                            return productImage.getUrl();
                                        }
                                    }).toList()
                    );

                    // 노트 조회
                    List<Note> noteEntityList = noteRepository.findByProduct(perfumeEntity);
                    setNotesByType(perfumeResponse, noteEntityList);

                    return perfumeResponse;
                })
                .sorted(Comparator.comparing(PerfumeResponse::getNameKr)) // 한글명순으로 정렬
                .toList();
    }
    /**
     *자체제작 향수 조회하기
     */
    public List<PerfumeResponse> getAllProductResponses() {
        // perfume 엔티티 전체 가져와서 리스트에 담기
        List<Product> perfumeEntityList = productRepository.findByCategoryId(3L); // 자체제작 향수 카테고리 아이디는 3(Long)

        // 향수 엔티티 리스트에 stream 으로 항목마다 접근하여 response 로 변환하는 작업 거치기
        return perfumeEntityList.stream().map(perfumeEntity -> {
                    PerfumeResponse perfumeResponse = new PerfumeResponse();
                    perfumeResponse.setId(perfumeEntity.getId()); // 아이디
                    perfumeResponse.setNameEn(perfumeEntity.getNameEn()); // 영문명
                    perfumeResponse.setNameKr(perfumeEntity.getNameKr()); // 한글명
                    perfumeResponse.setBrand(perfumeEntity.getBrand()); // 브랜드
                    perfumeResponse.setGrade(perfumeEntity.getGrade()); // 부향률
                    perfumeResponse.setContent(perfumeEntity.getContent()); // 설명
                    perfumeResponse.setSizeOption(perfumeEntity.getSizeOption()); // 용량 옵션
                    perfumeResponse.setMainAccord(perfumeEntity.getMainAccord()); // 메인어코드
                    perfumeResponse.setIngredients(perfumeEntity.getIngredients()); // 성분
                    perfumeResponse.setPrice(perfumeEntity.getPrice());

                    // 이미지
                    perfumeResponse.setImageUrlList(
                            productImageRepository.findByProduct(perfumeEntity).stream()
                                    .map(productImage -> {
                                        if (productImage.getUrl() != null) {
                                            // 기존 이미지(배경있는 이미지)가 있으면 기존 이미지 URL로 반환
                                            return productImage.getUrl();
                                        } else {
                                            // 기존 이미지가 없으면 배경제거 이미지로 반환
                                            return productImage.getNoBgUrl();
                                        }
                                    }).toList()
                    );

                    // 노트 조회
                    List<Note> noteEntityList = noteRepository.findByProduct(perfumeEntity);
                    setNotesByType(perfumeResponse, noteEntityList);

                    return perfumeResponse;
                })
                .sorted(Comparator.comparing(PerfumeResponse::getNameKr)) // 한글명순으로 정렬
                .toList();
    }

    /**
     * 노트 데이터를 타입별 문자열로 변환하여 응답객체에 설정
     * @param perfumeResponse 노트 정보가 설정될 향수 응답 객체
     * @param notes 타입별로 그룹화하여 문자열로 변환할 노트 리스트
     */
    private void setNotesByType(PerfumeResponse perfumeResponse, List<Note> notes) {
        Map<NoteType, String> noteMap = notes.stream()
                .collect(Collectors.groupingBy(
                        Note::getNoteType,
                        Collectors.mapping(
                                note -> note.getSpice().getNameKr(),
                                Collectors.joining(", ")
                        )
                ));

        perfumeResponse.setSingleNote(noteMap.getOrDefault(NoteType.SINGLE, ""));
        perfumeResponse.setTopNote(noteMap.getOrDefault(NoteType.TOP, ""));
        perfumeResponse.setMiddleNote(noteMap.getOrDefault(NoteType.MIDDLE, ""));
        perfumeResponse.setBaseNote(noteMap.getOrDefault(NoteType.BASE, ""));
    }

    /**
     * 새로운 제품 정보 등록 메소드
     */
    @CacheEvict(value = "products", allEntries = true) // 캐시를 갱신하려면 모든 캐시를 삭제해야 합니다.
    public void createProduct(ProductCreateRequest productCreateRequest) {

        // 카테고리 조회 시, 값이 없으면 예외 처리
        Category category = categoryRepository.findCategoryById(1L)
                .orElseThrow(() -> new RuntimeException("Category not found for id: 1"));

        // 제품 정보 등록
        Product newProductEntity = Product.builder()
                .nameEn(productCreateRequest.getNameEn())
                .nameKr(productCreateRequest.getNameKr())
                .brand(productCreateRequest.getBrand())
                .grade(productCreateRequest.getGrade())
                .content(productCreateRequest.getContent())
                .sizeOption(productCreateRequest.getSizeOption())
                .mainAccord(productCreateRequest.getMainAccord())
                .ingredients(productCreateRequest.getIngredients())
                .category(category)
                .build();
        productRepository.save(newProductEntity); // 새로운 제품 정보 저장

        // 이미지 처리
        saveProductImages(productCreateRequest.getImageUrlList(), newProductEntity);

        // 노트 처리
        processNotes(productCreateRequest, newProductEntity);
    }

    /**
     * 제품 이미지를 처리하는 메소드
     */
    private void saveProductImages(List<String> imageUrlList, Product newProductEntity) {
        if (imageUrlList != null && !imageUrlList.isEmpty()) {
            imageUrlList.forEach(imageUrl -> {
                ProductImage newProductImageEntity = ProductImage.builder()
                        .product(newProductEntity)
                        .url(imageUrl)
                        .build();
                productImageRepository.save(newProductImageEntity);
            });
        }
    }

    /**
     * 노트를 처리하는 메소드
     */
    private void processNotes(ProductCreateRequest productCreateRequest, Product newProductEntity) {
        boolean hasSingleNote = !productCreateRequest.getSingleNoteList().isEmpty();
        boolean hasOtherNotes = !productCreateRequest.getTopNoteList().isEmpty() ||
                !productCreateRequest.getMiddleNoteList().isEmpty() ||
                !productCreateRequest.getBaseNoteList().isEmpty();

        // 싱글 노트와 다른 타입의 노트가 함께 존재할 수 없으므로 조건 검사
        if (hasSingleNote && hasOtherNotes) {
            throw new IllegalArgumentException("[제품-서비스-생성] 싱글 타입과 다른 타입의 노트가 함께 존재할 수 없습니다.");
        }

        if (hasSingleNote) {
            // 싱글 노트 처리
            productCreateRequest.getSingleNoteList().forEach(spiceNameKr -> {
                processNoteForSingle(spiceNameKr, newProductEntity);
            });
        }

        // 싱글 노트가 없는 경우에만 나머지 노트 처리
        if (!hasSingleNote) {
            processOtherNotes(productCreateRequest, newProductEntity);
        }
    }

    /**
     * 싱글 노트를 처리하는 메소드
     */
    private void processNoteForSingle(String spiceNameKr, Product newProductEntity) {
        Spice targetSpice = spiceRepository.findByNameKr(spiceNameKr);

        if (targetSpice != null) {
            createAndSaveNote(newProductEntity, targetSpice, NoteType.SINGLE);
        } else {
            Spice newSpiceEntity = createAndSaveSpice(spiceNameKr);
            createAndSaveNote(newProductEntity, newSpiceEntity, NoteType.SINGLE);
        }
    }

    /**
     * 탑, 미들, 베이스 노트를 처리하는 메소드
     */
    private void processOtherNotes(ProductCreateRequest productCreateRequest, Product newProductEntity) {
        productCreateRequest.getTopNoteList().forEach(spiceNameKr ->
                processNote(spiceNameKr, newProductEntity, NoteType.TOP));

        productCreateRequest.getMiddleNoteList().forEach(spiceNameKr ->
                processNote(spiceNameKr, newProductEntity, NoteType.MIDDLE));

        productCreateRequest.getBaseNoteList().forEach(spiceNameKr ->
                processNote(spiceNameKr, newProductEntity, NoteType.BASE));
    }

    /**
     * 공통적인 노트 처리 메소드
     */
    private void processNote(String spiceNameKr, Product newProductEntity, NoteType noteType) {
        Spice targetSpice = spiceRepository.findByNameKr(spiceNameKr);
        if (targetSpice != null) {
            createAndSaveNote(newProductEntity, targetSpice, noteType);
        } else {
            Spice newSpiceEntity = createAndSaveSpice(spiceNameKr);
            createAndSaveNote(newProductEntity, newSpiceEntity, noteType);
        }
    }

    /**
     * 새로운 향료를 저장하는 메소드
     */
    private Spice createAndSaveSpice(String spiceNameKr) {
        Spice newSpiceEntity = Spice.builder()
                .nameKr(spiceNameKr)
                .build();
        return spiceRepository.save(newSpiceEntity);
    }

    /**
     * 노트를 생성하고 저장하는 메소드
     */
    private void createAndSaveNote(Product newProductEntity, Spice spice, NoteType noteType) {
        Note newNoteEntity = Note.builder()
                .product(newProductEntity)
                .spice(spice)
                .noteType(noteType)
                .build();
        noteRepository.save(newNoteEntity);
    }

    /**
     * 제품 정보 수정 메소드
     */
    @CacheEvict(value = "products") // 수정 시마다 캐시 데이터 함께 업데이트
    public void modifyProduct(ProductModifyRequest productModifyRequest) {
        // productModifyRequest가 null일 경우 예외 처리
        if (productModifyRequest == null) {
            throw new IllegalArgumentException("Product modify request cannot be null");
        }

        // null 처리 및 빈 리스트로 초기화
        List<String> topNoteList = Optional.ofNullable(productModifyRequest.getTopNoteList()).orElse(new ArrayList<>());
        List<String> middleNoteList = Optional.ofNullable(productModifyRequest.getMiddleNoteList()).orElse(new ArrayList<>());
        List<String> baseNoteList = Optional.ofNullable(productModifyRequest.getBaseNoteList()).orElse(new ArrayList<>());
        List<String> singleNoteList = Optional.ofNullable(productModifyRequest.getSingleNoteList()).orElse(new ArrayList<>());

        // 수정할 제품 엔티티 request의 id 값으로 찾아오기
        Product targetProductEntity = productRepository.findById(productModifyRequest.getId()).orElseThrow(() ->
                new EntityNotFoundException("[제품-서비스-수정]아이디에 해당하는 제품 엔티티를 찾을 수 없습니다."));

        Category category = categoryRepository.findCategoryById(1L)
                .orElseThrow(() -> new RuntimeException("Category not found for id: 1"));

        // request 정보 담기
        Product modifyProductEntity = Product.builder()
                .nameEn(productModifyRequest.getNameEn())
                .nameKr(productModifyRequest.getNameKr())
                .brand(productModifyRequest.getBrand())
                .grade(productModifyRequest.getGrade())
                .content(productModifyRequest.getContent())
                .sizeOption(productModifyRequest.getSizeOption())
                .mainAccord(productModifyRequest.getMainAccord())
                .ingredients(productModifyRequest.getIngredients())
                .category(category)
                .build();

        // 조건 1: 싱글 노트를 갖고 있으면 다른 노트들을 설정할 수 없음
        if (!singleNoteList.isEmpty()) {
            // 싱글 노트가 있으면 탑, 미들, 베이스 노트는 비워두기
            topNoteList.clear();
            middleNoteList.clear();
            baseNoteList.clear();
        } else {
            // 조건 2: 탑 노트가 있으면 미들, 베이스 노트는 반드시 있어야 함
            if (!topNoteList.isEmpty()) {
                // 미들 노트와 베이스 노트가 없다면 기본값을 추가
                if (middleNoteList.isEmpty()) {
                    middleNoteList.add("defaultMiddleNote");  // 기본 미들 노트
                }
                if (baseNoteList.isEmpty()) {
                    baseNoteList.add("defaultBaseNote");  // 기본 베이스 노트
                }
            }
        }

        // 엔티티 수정 적용
        targetProductEntity.modify(modifyProductEntity);

        // 이미지 처리
        processImages(productModifyRequest, targetProductEntity);

        // 노트 처리
        processNotes(targetProductEntity, topNoteList, middleNoteList, baseNoteList, singleNoteList);
    }

    private void processImages(ProductModifyRequest productModifyRequest, Product targetProductEntity) {
        List<ProductImage> targetProductImageEntityList = productImageRepository.findByProduct(targetProductEntity);
        Set<String> targetProductImageUrlSet = targetProductImageEntityList.stream()
                .map(ProductImage::getUrl)
                .collect(Collectors.toSet());

        List<ProductImage> productImagesToDelete = targetProductImageEntityList.stream()
                .filter(productImageEntity -> !productModifyRequest.getImageUrlList().contains(productImageEntity.getUrl()))
                .toList();

        productImageRepository.deleteAll(productImagesToDelete);

        List<ProductImage> productImagesToAdd = productModifyRequest.getImageUrlList().stream()
                .filter(url -> !targetProductImageUrlSet.contains(url))
                .map(url -> ProductImage.builder()
                        .product(targetProductEntity)
                        .url(url)
                        .build())
                .toList();

        productImageRepository.saveAll(productImagesToAdd);
    }

    private void processNotes(Product targetProductEntity, List<String> topNoteList, List<String> middleNoteList, List<String> baseNoteList, List<String> singleNoteList) {
        // 싱글 노트 처리
        if (!singleNoteList.isEmpty() && topNoteList.isEmpty() && middleNoteList.isEmpty() && baseNoteList.isEmpty()) {
            processSingleNotes(targetProductEntity, singleNoteList);
        } else {
            if (!singleNoteList.isEmpty()) {
                throw new IllegalArgumentException("[제품-서비스-수정]싱글 타입과 다른 타입의 노트가 동시에 존재할 수 없습니다.");
            }
            // 나머지 노트 처리 (Top, Middle, Base)
            processNotesByType(targetProductEntity, topNoteList, NoteType.TOP);
            processNotesByType(targetProductEntity, middleNoteList, NoteType.MIDDLE);
            processNotesByType(targetProductEntity, baseNoteList, NoteType.BASE);
        }
    }

    private void processSingleNotes(Product targetProductEntity, List<String> singleNoteList) {
        List<Note> targetNoteEntityList = noteRepository.findByProduct(targetProductEntity);
        Set<String> targetSingleSpiceNameKrSet = targetNoteEntityList.stream()
                .filter(noteEntity -> noteEntity.getNoteType().equals(NoteType.SINGLE))
                .map(noteEntity -> noteEntity.getSpice().getNameKr())
                .collect(Collectors.toSet());

        List<Note> singleNotesToDelete = targetNoteEntityList.stream()
                .filter(noteEntity -> noteEntity.getNoteType().equals(NoteType.SINGLE))
                .filter(noteEntity -> !singleNoteList.contains(noteEntity.getSpice().getNameKr()))
                .toList();

        List<Note> otherTypeNotesList = targetNoteEntityList.stream()
                .filter(noteEntity -> !noteEntity.getNoteType().equals(NoteType.SINGLE))
                .toList();

        List<Note> notesToDelete = new ArrayList<>();
        notesToDelete.addAll(singleNotesToDelete);
        notesToDelete.addAll(otherTypeNotesList);
        noteRepository.deleteAll(notesToDelete);

        singleNoteList.stream()
                .filter(spiceNameKr -> !targetSingleSpiceNameKrSet.contains(spiceNameKr))
                .forEach(spiceNameKr -> {
                    Spice targetSpice = spiceRepository.findByNameKr(spiceNameKr);
                    if (targetSpice != null) {
                        Note newNoteEntity = Note.builder()
                                .product(targetProductEntity)
                                .spice(targetSpice)
                                .noteType(NoteType.SINGLE)
                                .build();
                        noteRepository.save(newNoteEntity);
                    } else {
                        Spice newSpiceEntity = Spice.builder()
                                .nameKr(spiceNameKr)
                                .build();
                        spiceRepository.save(newSpiceEntity);
                        Note newNoteEntity = Note.builder()
                                .product(targetProductEntity)
                                .spice(newSpiceEntity)
                                .noteType(NoteType.SINGLE)
                                .build();
                        noteRepository.save(newNoteEntity);
                    }
                });
    }

    private void processNotesByType(Product targetProductEntity, List<String> noteList, NoteType noteType) {
        if (!noteList.isEmpty()) {
            List<Note> targetNoteEntityList = noteRepository.findByProduct(targetProductEntity);
            Set<String> targetNoteSpiceNameKrSet = targetNoteEntityList.stream()
                    .filter(noteEntity -> noteEntity.getNoteType().equals(noteType))
                    .map(noteEntity -> noteEntity.getSpice().getNameKr())
                    .collect(Collectors.toSet());

            List<Note> notesToDelete = targetNoteEntityList.stream()
                    .filter(noteEntity -> noteEntity.getNoteType().equals(noteType))
                    .filter(noteEntity -> !noteList.contains(noteEntity.getSpice().getNameKr()))
                    .toList();

            List<Note> singleNotesToDelete = targetNoteEntityList.stream()
                    .filter(noteEntity -> noteEntity.getNoteType().equals(NoteType.SINGLE))
                    .toList();

            if (singleNotesToDelete.isEmpty()) {
                noteRepository.deleteAll(notesToDelete);
            } else {
                List<Note> notesToDeleteFinal = new ArrayList<>(notesToDelete);
                notesToDeleteFinal.addAll(singleNotesToDelete);
                noteRepository.deleteAll(notesToDeleteFinal);
            }

            noteList.stream()
                    .filter(spiceNameKr -> !targetNoteSpiceNameKrSet.contains(spiceNameKr))
                    .forEach(spiceNameKr -> {
                        if (spiceNameKr != null && !spiceNameKr.trim().isEmpty()) {
                            Spice targetSpice = spiceRepository.findByNameKr(spiceNameKr);
                            if (targetSpice != null) {
                                Note newNoteEntity = Note.builder()
                                        .product(targetProductEntity)
                                        .spice(targetSpice)
                                        .noteType(noteType)
                                        .build();
                                noteRepository.save(newNoteEntity);
                            } else {
                                Spice newSpiceEntity = Spice.builder()
                                        .nameKr(spiceNameKr)
                                        .build();
                                spiceRepository.save(newSpiceEntity);
                                Note newNoteEntity = Note.builder()
                                        .product(targetProductEntity)
                                        .spice(newSpiceEntity)
                                        .noteType(noteType)
                                        .build();
                                noteRepository.save(newNoteEntity);
                            }
                        }
                    });
        }
    }

    /**
     * 제품 삭제 메소드
     */
    @CacheEvict(value = "products") // 수정 시 마다 캐시데이터 함께 업데이트
    public void deletePerfume(Long perfumeId) {
        // 삭제할 제품 엔티티
        Product targetProductEntity = productRepository.findById(perfumeId).orElseThrow(() ->
                new EntityNotFoundException("[제품-서비스-삭제]삭제하려는 제품의 정보를 찾을 수 업습니다."));
        // 삭제할 제품 이미지들
        List<ProductImage> imagesToDelete = productImageRepository.findByProduct(targetProductEntity);
        // 삭제할 노트들
        List<Note> notesToDelete = noteRepository.findByProduct(targetProductEntity);

        productImageRepository.deleteAll(imagesToDelete);
        noteRepository.deleteAll(notesToDelete);
        productRepository.delete(targetProductEntity);
    }

    /**
     * 특정 향수의 유사 향수 조회
     */
    public ProductDetailSimilarResponse getProductDetailSimilar(Long productId) {
        // 유사 향수 데이터 가져오기 (note_based, design_based)
        Map<String, List<SimilarPerfumeResponse>> similarPerfumes = similarPerfumeService.getSimilarPerfumes(productId);

        // Map 타입 그대로 전달
        return new ProductDetailSimilarResponse(similarPerfumes);
    }


}
