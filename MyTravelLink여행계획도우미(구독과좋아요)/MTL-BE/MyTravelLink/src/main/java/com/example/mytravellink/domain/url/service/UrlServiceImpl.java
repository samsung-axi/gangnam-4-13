package com.example.mytravellink.domain.url.service;

import com.example.mytravellink.api.user.dto.LinkDataResponse;
import com.example.mytravellink.api.url.dto.*;
import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.example.mytravellink.domain.travel.entity.TravelInfoPlace;
import com.example.mytravellink.domain.travel.repository.PlaceRepository;
import com.example.mytravellink.domain.travel.repository.TravelInfoRepository;
import com.example.mytravellink.domain.travel.service.ImageService;
import com.example.mytravellink.domain.travel.repository.TravelInfoPlaceRepository;
import com.example.mytravellink.domain.travel.entity.TravelInfoUrl;
import com.example.mytravellink.domain.travel.entity.TravelInfoUrlId;
import com.example.mytravellink.domain.url.entity.Url;
import com.example.mytravellink.domain.url.entity.UrlPlace;
import com.example.mytravellink.domain.url.repository.TravelInfoUrlRepository;
import com.example.mytravellink.domain.url.repository.UrlPlaceRepository;
import com.example.mytravellink.domain.url.repository.UrlRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.entity.UsersUrl;
import com.example.mytravellink.domain.users.entity.UsersUrlId;
import com.example.mytravellink.domain.users.repository.UsersRepository;
import com.example.mytravellink.domain.users.repository.UsersUrlRepository;
import lombok.RequiredArgsConstructor;
import java.net.URI;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import com.example.mytravellink.domain.job.service.JobStatusService;

@Service
@EnableAsync  // 비동기 처리 활성화
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final PlaceRepository placeRepository;
    private final RestTemplate restTemplate;
    private final UrlRepository urlRepository;
    private final UrlPlaceRepository urlPlaceRepository;
    private final TravelInfoUrlRepository travelInfoUrlRepository;
    private final TravelInfoRepository travelInfoRepository;
    private final UsersRepository usersRepository;
    private final UsersUrlRepository usersUrlRepository;
    private final TravelInfoPlaceRepository travelInfoPlaceRepository;
    private final ImageService imageService;
    private final JobStatusService jobStatusService;
    private final Logger log = LoggerFactory.getLogger(UrlServiceImpl.class);
    private final ObjectMapper objectMapper;  // ObjectMapper 추가


    @Value("${ai.server.url}")  // application.yml에서 설정
    private String fastAPiUrl;

    @Override
    public UrlResponse processUrl(UrlRequest urlRequest) {
        // URL 리스트가 비어있으면 예외 처리
        if (urlRequest.getUrls() == null || urlRequest.getUrls().isEmpty()) {
            throw new IllegalArgumentException("URL 리스트가 비어있습니다.");
        }
        // 여기서는 리스트의 첫 번째 URL로 처리합니다.
        String urlStr = urlRequest.getUrls().get(0);

        // 1. DB에서 기존 데이터 조회
        Optional<Url> existingData = urlRepository.findByUrl(urlStr);
        // 기존 매핑을 따로 저장하여 업데이트할 수 있도록 함
        List<UsersUrl> oldMappings = new ArrayList<>();

        if (existingData.isPresent()) {
            Url cachedUrl = existingData.get();
            // URL에 해당하는 매핑 정보들을 모두 조회 (매핑이 여러 건일 수 있으므로)
            List<UsersUrl> mappings = usersUrlRepository.findAllByUrl(cachedUrl);
            oldMappings.addAll(mappings);
            // 매핑 정보 중 하나라도 is_use가 true이면 캐시 사용 안하도록 처리
            boolean hasActiveMapping = mappings.stream()
                    .anyMatch(mapping -> mapping.isUse());
            if (hasActiveMapping) {
                existingData = Optional.empty();
            }
        }

        // 2. 기존 데이터가 있으면 해당 데이터로 반환 (active 매핑이 없는 경우)
        if (existingData.isPresent()) {
            Url url = existingData.get();
            ObjectMapper objectMapper = new ObjectMapper();

            List<PlaceInfo> placeInfoList = url.getUrlPlaces().stream()
                    .map(urlPlace -> {
                        Place place = urlPlace.getPlace();
                        // 이미지 변환
                        List<PlacePhoto> images;
                        try {
                            images = place.getImage() != null
                                    ? objectMapper.readValue(place.getImage(), new TypeReference<List<PlacePhoto>>() {})
                                    : Collections.emptyList();
                        } catch (Exception e) {
                            images = Collections.emptyList();
                        }
                        // 영업시간 변환
                        List<String> openHours;
                        try {
                            openHours = place.getOpenHours() != null
                                    ? objectMapper.readValue(place.getOpenHours(), new TypeReference<List<String>>() {})
                                    : Collections.emptyList();
                        } catch (Exception e) {
                            openHours = Collections.emptyList();
                        }

                        return new PlaceInfo(
                                place.getTitle(),
                                place.getDescription(),
                                place.getAddress(),
                                images,
                                place.getPhone(),
                                place.getWebsite(),
                                place.getRating(),
                                openHours,
                                place.getIntro()
                        );
                    })
                    .toList();

            return UrlResponse.builder()
                    .contentInfos(Collections.emptyList())
                    .placeDetails(placeInfoList)
                    .processingTimeSeconds(0)
                    .build();
        }

        // 3. 기존 데이터가 없거나 active 매핑(is_use==true)이 존재할 경우 -> FastAPI 호출하여 데이터 처리
        String requestUrl = fastAPiUrl + "/api/v1/contentanalysis";

        // DTO에 전달된 URL 리스트 그대로 전송 (여러 URL 지원)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("urls", urlRequest.getUrls());

        ResponseEntity<UrlResponse> response = restTemplate.postForEntity(
                requestUrl, requestBody, UrlResponse.class
        );

        UrlResponse urlResponse = response.getBody();
        if (urlResponse != null) {

            // ★ 기존 active 매핑(is_use==true)이 있었다면, new analysis를 위해 해당 매핑들을 모두 false로 업데이트합니다.
            for (UsersUrl mapping : oldMappings) {
                if (mapping.isUse()) {
                    mapping.setUse(false);
                    usersUrlRepository.save(mapping);
                }
            }

            // 4. 새로운 URL 엔티티 저장 (첫 번째 URL 사용)
            Url newUrl = Url.builder()
                    .urlTitle(urlStr)
                    .urlAuthor(urlStr)
                    .url(urlStr)
                    .build();
            urlRepository.save(newUrl);



            // 6. FASTAPI에서 추출한 장소 데이터를 DB의 Place에 저장
            // (기존 로직 그대로)
            for (PlaceInfo placeInfo : urlResponse.getPlaceDetails()) {
                
                List<PlacePhoto> photos = placeInfo.getPhotos();
                PlacePhoto photo = photos.get(0);
                String imageUrl = photo.getUrl();
                String redirectImageUrl = imageService.redirectImageUrl(imageUrl);
                photo.setUrl(redirectImageUrl);
        
                Place place = placeRepository.findByTitle(placeInfo.getName())
                        .orElseGet(() -> {
                            // opening_hours가 빈 리스트이거나 null이면 null 처리
                            String openHours = Optional.ofNullable(placeInfo.getOpen_hours())
                                    .filter(list -> !list.isEmpty() && list.stream().anyMatch(str -> !str.isBlank()))
                                    .map(Object::toString)
                                    .orElse(null);

                            Place newPlace = Place.builder()
                                    .title(placeInfo.getName())
                                    .description(placeInfo.getDescription())
                                    .address(placeInfo.getFormattedAddress())
                                    .image(placeInfo.getPhotos() != null && !placeInfo.getPhotos().isEmpty() ? 
                                        placeInfo.getPhotos().get(0).getUrl() : "https://via.placeholder.com/300x200?text=No+Image")
                                    .phone(placeInfo.getPhone())
                                    .intro(placeInfo.getOfficialDescription())
                                    .website(placeInfo.getWebsite())
                                    .rating(placeInfo.getRating())
                                    .openHours(openHours)
                                    .type(placeInfo.getType())  // type 설정
                                    .latitude(placeInfo.getGeometry() != null ? placeInfo.getGeometry().getLatitude() : null)  // latitude 설정
                                    .longitude(placeInfo.getGeometry() != null ? placeInfo.getGeometry().getLongitude() : null)  // longitude 설정
                                    .build();
                            return placeRepository.save(newPlace);
                        });

                // Url과 Place 연관 매핑 저장
                UrlPlace urlPlace = UrlPlace.builder()
                        .url(newUrl)
                        .place(place)
                        .build();
                urlPlaceRepository.save(urlPlace);
            }
        }
        return urlResponse;
    }

    // 나머지 메서드들은 기존 로직 유지...

    @Override
    public List<Url> findUrlByTravelInfoId(TravelInfo travelInfo) {
        if(travelInfo == null) {
            return Collections.emptyList();
        }

        List<String> urlIds = travelInfoUrlRepository.findUrlIdByTravelInfoId(travelInfo);

        if (urlIds == null || urlIds.isEmpty()) {
            return Collections.emptyList();
        }

        return urlRepository.findByIdIn(urlIds);
    }

    @Override
    public List<Place> findPlaceByUrlId(String urlId) {
        List<UrlPlace> urlPlaces = urlPlaceRepository.findByUrl_Id(urlId);
        return urlPlaces.stream()
                .map(UrlPlace::getPlace)
                .toList();
    }

    @Override
    public void saveUrl(String travelInfoId, String url, String title, String author) {
        Url newUrl = Url.builder()
            .urlTitle(title)
            .urlAuthor(author)
            .url(url)
            .build();
        urlRepository.save(newUrl);
        TravelInfo travelInfo = travelInfoRepository.findById(travelInfoId)
            .orElseThrow(() -> new RuntimeException("TravelInfo not found"));
        TravelInfoUrl travelInfoUrl = TravelInfoUrl.builder()
            .travelInfo(travelInfo)
            .url(newUrl)
            .build();
        travelInfoUrl.setId(TravelInfoUrlId.builder()
                .travelInfoId(travelInfo.getId())
                .urlId(newUrl.getId())
                .build());
        travelInfoUrlRepository.save(travelInfoUrl);
    }

    @Override
    @Transactional
    public void saveUserUrl(String email, UserUrlRequest request) {
        String urlStr = request.getUrl();
        Url urlEntity = urlRepository.findById(generateUrlId(urlStr)).orElseGet(() -> {
            Url newUrl = Url.builder()
                    .url(urlStr)
                    .urlTitle(request.getTitle())
                    .urlAuthor(request.getAuthor())
                    .build();
            return urlRepository.save(newUrl);
        });

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UsersUrlId mappingId = new UsersUrlId(user.getEmail(), urlEntity.getId());

        if (!usersUrlRepository.existsById(mappingId)) {
            UsersUrl usersUrlMapping = UsersUrl.builder()
                    .id(mappingId)
                    .user(user)
                    .url(urlEntity)
                    .isUse(true)
                    .build();
            usersUrlRepository.save(usersUrlMapping);
        }
    }

    @Override
    @Transactional
    public void deleteUserUrl(String email, String urlId) {
        if (urlRepository.existsById(urlId)) {
            urlRepository.deleteById(urlId);
        }
    }

    private String generateUrlId(String url) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            byte[] hash = digest.digest(url.getBytes(StandardCharsets.UTF_8));
            BigInteger number = new BigInteger(1, hash);
            StringBuilder hexString = new StringBuilder(number.toString(16));
            while (hexString.length() < 128) {
                hexString.insert(0, '0');
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-512 해시 생성 중 오류 발생", e);
        }
    }

    @Override
    @Transactional
    public void deleteUserUrlByUrl(String email, String url) {
        String id = generateUrlId(url);
        UsersUrlId mappingId = UsersUrlId.builder()
                            .email(email)
                            .urlId(id)
                            .build();
        if (usersUrlRepository.existsById(mappingId)) {
            usersUrlRepository.deleteById(mappingId);
        }
        if (urlRepository.existsById(id)) {
            urlRepository.deleteById(id);
        }
    }

    private String extractYoutubeVideoId(String url) {
        try {
            URI uri = new URI(url);
            String query = uri.getQuery();
            if(query != null) {
                String[] params = query.split("&");
                for (String param : params) {
                    String[] keyValue = param.split("=");
                    if (keyValue[0].equals("v") && keyValue.length > 1) {
                        return keyValue[1];
                    }
                }
            }
        } catch (Exception e) {
            // 추출 실패 시 빈 문자열 반환
        }
        return "";
    }

    @Override
    @Transactional
    public String mappingUrl(UrlRequest request, String email) {
        if (request.getUrls() == null || request.getUrls().isEmpty()) {
            throw new IllegalArgumentException("URL 리스트가 비어있습니다.");
        }

        // 사용자 조회
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // TravelInfo 생성
        TravelInfo travelInfo = TravelInfo.builder()
                .user(user)
                .travelDays(request.getDays())
                .placeCount(0)  // 초기값 0으로 설정
                .title("여행지")  // 첫 번째 URL을 title로 설정
                .isFavorite(false)
                .fixed(false)
                .isDelete(false)
                .extPlaceListId("")  // 빈 문자열로 초기화
                .travelTasteId("")  // 빈 문자열로 초기화
                .build();

        travelInfo = travelInfoRepository.save(travelInfo);

        // URL들의 모든 Place를 중복 없이 저장하기 위한 Set
        Set<Place> uniquePlaces = new HashSet<>();

        // URL 처리 및 매핑
        for (String urlStr : request.getUrls()) {
            Url url = urlRepository.findByUrl(urlStr)
                    .orElseGet(() -> {
                        Url newUrl = Url.builder()
                                .url(urlStr)
                                .urlTitle(urlStr)
                                .urlAuthor(email)
                                .build();
                        return urlRepository.save(newUrl);
                    });

            // TravelInfo와 URL 연결
            TravelInfoUrl travelInfoUrl = TravelInfoUrl.builder()
                    .travelInfo(travelInfo)
                    .url(url)
                    .build();
            travelInfoUrlRepository.save(travelInfoUrl);

            // URL에 연결된 모든 Place 수집
            List<UrlPlace> urlPlaces = urlPlaceRepository.findByUrl_Id(url.getId());
            urlPlaces.forEach(urlPlace -> uniquePlaces.add(urlPlace.getPlace()));
        }

        // 수집된 모든 Place를 TravelInfo와 매핑
        for (Place place : uniquePlaces) {
            TravelInfoPlace travelInfoPlace = TravelInfoPlace.builder()
                    .travelInfo(travelInfo)
                    .place(place)
                    .build();
            travelInfoPlaceRepository.save(travelInfoPlace);
        }

        // 최종 placeCount 업데이트
        travelInfo.setPlaceCount(uniquePlaces.size());
        travelInfoRepository.save(travelInfo);

        return travelInfo.getId();
    }

    @Override
    public boolean checkYoutubeSubtitles(String videoUrl) {
        try {
            // FastAPI의 유튜브 자막 체크 엔드포인트 호출 (예: http://.../api/v1/youtube/check_subtitles)
            String subtitleUrl = fastAPiUrl + "/api/v1/youtube/check_subtitles";
            Map<String, String> payload = new HashMap<>();
            payload.put("video_url", videoUrl);
            ResponseEntity<Map> response = restTemplate.postForEntity(subtitleUrl, payload, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object hasSubtitles = response.getBody().get("has_subtitles");
                if (hasSubtitles instanceof Boolean) {
                    return (Boolean) hasSubtitles;
                }
            }
        } catch (Exception e) {
            // 에러 로그 기록 (필요 시)
            e.printStackTrace();
        }
        return false;
    }

    @Async("asyncTaskExecutor")
    public void processUrlAsync(UrlRequest request, String jobId) {
        try {
            // 작업 시작 상태 설정
            jobStatusService.setJobStatus(jobId, "PROCESSING", null, null);

            // URL 처리 로직
            UrlResponse response = processUrl(request);
            
            // 결과를 JSON 문자열로 변환
            String result = objectMapper.writeValueAsString(response);

            // 작업 완료 상태 설정
            jobStatusService.setJobStatus(jobId, "COMPLETED", result, null);
            log.info("URL 처리 완료. JobID: {}, Result: {}", jobId, result);

        } catch (Exception e) {
            log.error("URL 처리 실패. JobID: {}", jobId, e);
            // 작업 실패 상태 설정
            jobStatusService.setJobStatus(jobId, "FAILED", null, e.getMessage());
        }
    }
    public boolean isUser(String urlId, String userEmail) {
        return usersUrlRepository.existsByIdAndUserEmail(urlId, userEmail);
    }

    
}