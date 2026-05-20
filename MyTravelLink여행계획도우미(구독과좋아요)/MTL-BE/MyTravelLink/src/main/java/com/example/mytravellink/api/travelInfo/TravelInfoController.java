package com.example.mytravellink.api.travelInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import com.example.mytravellink.api.travelInfo.dto.travel.BooleanRequest;
import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookListResponse;
import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookResponse;
import com.example.mytravellink.api.travelInfo.dto.travel.StringRequest;
import com.example.mytravellink.api.travelInfo.dto.travel.PlaceSelectRequest;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoListResponse;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoPlaceResponse;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoUpdateTitleAndTravelDaysRequest;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoUrlResponse;
import com.example.mytravellink.auth.handler.JwtTokenProvider;
import com.example.mytravellink.domain.job.service.JobStatusService;
import com.example.mytravellink.domain.job.service.JobStatusService.JobStatus;
import com.example.mytravellink.domain.travel.entity.Guide;
import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.example.mytravellink.domain.travel.service.CourseServiceImpl;
import com.example.mytravellink.domain.travel.service.GuideServiceImpl;
import com.example.mytravellink.domain.travel.service.ImageService;
import com.example.mytravellink.domain.travel.service.PlaceServiceImpl;
import com.example.mytravellink.domain.travel.service.TravelInfoServiceImpl;
import com.example.mytravellink.domain.url.entity.Url;
import com.example.mytravellink.domain.url.service.UrlServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/travels")
@RequiredArgsConstructor
@Slf4j
public class TravelInfoController {

    private final TravelInfoServiceImpl travelInfoService;
    private final UrlServiceImpl urlService;
    private final PlaceServiceImpl placeService;
    private final GuideServiceImpl guideService;
    private final CourseServiceImpl courseService;
    private final ImageService imageService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JobStatusService jobStatusService;  // final 키워드 추가


    /**
     * 여행정보 ID 기준 여행정보 및 URL정보 조회
     * @param travelId
     * @return ResponseEntity<TravelInfoResponse>
     */
    @GetMapping("/travelInfos/{travelId}")
    public ResponseEntity<TravelInfoUrlResponse> travelInfo(@PathVariable String travelId) {
        try {
            TravelInfo travelInfo = travelInfoService.getTravelInfo(travelId);
            List<Url> urlList = urlService.findUrlByTravelInfoId(travelInfo);

            List<TravelInfoUrlResponse.Url> urlResponseList = urlList.stream()
                .map(url -> TravelInfoUrlResponse.Url.builder()
                    .urlId(url.getId())
                    .urlAddress(url.getUrl())
                    .title(url.getUrlTitle())
                    .author(url.getUrlAuthor())
                    .build())
                .collect(Collectors.toList());

            TravelInfoUrlResponse travelInfoUrlResponse = TravelInfoUrlResponse.builder()
                .success("success")
                .message("success")
                .travelInfoId(travelInfo.getId())
                .travelInfoTitle(travelInfo.getTitle())
                .travelDays(travelInfo.getTravelDays())
                .urlCnt(urlList.size())
                .urlList(urlResponseList)
                .build();

            return new ResponseEntity<>(travelInfoUrlResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * URL ID 기준 장소 조회
     * @param urlId
     * @return ResponseEntity<TravelInfoPlaceResponse>
     */
    @GetMapping("/travelInfos/urls/{urlId}")
    public ResponseEntity<TravelInfoPlaceResponse> travelInfoUrl(@PathVariable String urlId) {
        try {
            List<Place> urlPlaceList = urlService.findPlaceByUrlId(urlId);
            //이미지 URL 리다이렉션
            List<Place> imageConvertPlaceList = imageService.redirectImageUrlPlace(urlPlaceList);

            List<TravelInfoPlaceResponse.Place> placeResponseList = imageConvertPlaceList.stream()
                .map(place -> TravelInfoPlaceResponse.Place.builder()
                    .placeId(place.getId().toString())
                    .placeType(place.getType())
                    .placeName(place.getTitle())
                    .placeAddress(place.getAddress())
                    .placeImage(place.getImage())
                    .placeDescription(place.getDescription())
                    .intro(place.getIntro())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .build())
                .collect(Collectors.toList());


                TravelInfoPlaceResponse travelInfoPlaceResponse = TravelInfoPlaceResponse.builder()
                .success("success")
                .message("success")
                .content(placeResponseList)
                .build();

            return new ResponseEntity<>(travelInfoPlaceResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 여행정보 ID 기준 장소 조회
     * @param travelId
     * @return ResponseEntity<TravelInfoPlaceResponse>
     */
    @GetMapping("/travelInfos/{travelId}/places")
    public ResponseEntity<TravelInfoPlaceResponse> travelInfoPlace(@PathVariable String travelId) {
        try {
            log.info("Fetching places for travelId: {}", travelId);
            List<Place> placeList = travelInfoService.getTravelInfoPlace(travelId);

            // 빈 리스트인 경우에도 정상적인 응답을 반환
            List<Place> imageConvertPlaceList = imageService.redirectImageUrlPlace(placeList);
            List<TravelInfoPlaceResponse.Place> placeResponseList = imageConvertPlaceList.stream()
                .map(place -> TravelInfoPlaceResponse.Place.builder()
                    .placeId(place.getId().toString())
                    .placeType(place.getType())
                    .placeName(place.getTitle())
                    .placeAddress(place.getAddress())
                    .placeImage(place.getImage())
                    .placeDescription(place.getDescription())
                    .intro(place.getIntro())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .build())
                .collect(Collectors.toList());

            TravelInfoPlaceResponse travelInfoPlaceResponse = TravelInfoPlaceResponse.builder()
                .success("success")
                .message("success")
                .content(placeResponseList)
                .build();

            return new ResponseEntity<>(travelInfoPlaceResponse, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching places for travelId: {} - {}", travelId, e.getMessage(), e);
            TravelInfoPlaceResponse errorResponse = TravelInfoPlaceResponse.builder()
                .success("error")
                .message(e.getMessage())
                .content(new ArrayList<>())
                .build();
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 여행 정보 ID 기준 여행 정보 수정
     * 여행일, 여행제목 수정
     * @param travelInfoId
     * @return
     */
    @PutMapping("/travelInfos/{travelInfoId}")
    public ResponseEntity<String> updateTravelInfo(@PathVariable String travelInfoId, @RequestBody TravelInfoUpdateTitleAndTravelDaysRequest travelInfoUpdateTitleAndTravelDaysRequest) {
        try {
            String travelInfoTitle = travelInfoUpdateTitleAndTravelDaysRequest.getTravelInfoTitle();
            Integer travelDays = travelInfoUpdateTitleAndTravelDaysRequest.getTravelDays();
            travelInfoService.updateTravelInfo(travelInfoId, travelInfoTitle, travelDays);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }          
    }

    /**
     * 여행정보 ID 기준 여행 정보 삭제
     * @param travelInfoId
     * @return
     */
    @DeleteMapping("/travelInfos/{travelInfoId}")
    public ResponseEntity<String> deleteTravelInfo(@PathVariable StringRequest request) {
        try {
            travelInfoService.deleteTravelInfo(request.getValue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
   /**
     * 여행정보 ID 기준 AI 추천 장소
     * @param travelInfoId
     * @return ResponseEntity<TravelInfoPlaceResponse>
     */
    @GetMapping("travelInfos/{travelInfoId}/aiSelect")
    public ResponseEntity<TravelInfoPlaceResponse> aiSelect(
        @PathVariable String travelInfoId, 
        @RequestHeader(value = "Authorization", required = true) String token
        ) {
        try {
            log.info("=== AI 추천 컨트롤러 시작 ===");
            log.info("travelInfoId: {}", travelInfoId);
            String userEmail = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
            if(!travelInfoService.isUser(travelInfoId, userEmail)){
                HttpHeaders headers = new HttpHeaders();
                headers.add("X-Error-Message", "토큰 불일치");  // 커스텀 헤더에 에러 메시지 추가
                
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .headers(headers)
                    .build();
            }
            // 1. 여행 정보 조회
            TravelInfo travelInfo = travelInfoService.getTravelInfo(travelInfoId);
            Integer travelDays = travelInfo.getTravelDays();
            
            // 2. 여행 정보에 포함된 모든 장소 조회
            List<Place> places = travelInfoService.getTravelInfoPlace(travelInfoId);
            
            if (places.isEmpty()) {
                return new ResponseEntity<>(
                    TravelInfoPlaceResponse.builder()
                        .success("error")
                        .message("No places found for recommendation")
                        .content(new ArrayList<>())
                        .build(),
                    HttpStatus.BAD_REQUEST
                );
            }
            
            // 3. FastAPI AI 서비스 호출을 위한 요청 데이터 준비
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("travelInfoId", travelInfoId);
            requestBody.put("travelDays", travelDays);
            requestBody.put("places", places.stream().map(place -> {
                Map<String, Object> placeMap = new HashMap<>();
                placeMap.put("placeId", place.getId().toString());
                placeMap.put("placeType", place.getType() != null ? place.getType() : "unknown");
                placeMap.put("placeName", place.getTitle());
                placeMap.put("placeAddress", place.getAddress());
                placeMap.put("placeImage", place.getImage());
                placeMap.put("placeDescription", place.getDescription());
                placeMap.put("intro", place.getIntro());
                placeMap.put("latitude", place.getLatitude() != null ? place.getLatitude() : BigDecimal.ZERO);
                placeMap.put("longitude", place.getLongitude() != null ? place.getLongitude() : BigDecimal.ZERO);
                return placeMap;
            }).filter(placeMap -> placeMap.get("placeType") != null).collect(Collectors.toList()));
            
            log.info("FastAPI 요청 데이터: {}", requestBody);
            
            // 4. FastAPI AI 서비스 호출
            RestTemplate restTemplate = new RestTemplate();

            String aiServiceUrl = "http://221.148.97.237:28001/api/v1/ai/recommend/places";
            ResponseEntity<Map> aiResponse = restTemplate.postForEntity(
                aiServiceUrl,
                requestBody,
                Map.class
            );
            
            // 5. AI 서비스 응답 처리
            if (aiResponse.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = aiResponse.getBody();
                List<Map<String, Object>> recommendedPlaces = (List<Map<String, Object>>) responseBody.get("content");
                
                List<TravelInfoPlaceResponse.Place> placeResponseList = recommendedPlaces.stream()
                    .map(placeData -> {
                        // null 체크 추가
                        String placeId = String.valueOf(placeData.getOrDefault("placeId", ""));
                        String placeType = String.valueOf(placeData.getOrDefault("placeType", "unknown"));
                        String placeName = String.valueOf(placeData.getOrDefault("placeName", ""));
                        String placeAddress = String.valueOf(placeData.getOrDefault("placeAddress", ""));
                        String placeImage = String.valueOf(placeData.getOrDefault("placeImage", ""));
                        String placeDescription = String.valueOf(placeData.getOrDefault("placeDescription", ""));
                        String intro = String.valueOf(placeData.getOrDefault("intro", ""));
                        
                        // 숫자 데이터 안전하게 변환
                        BigDecimal latitude = new BigDecimal(String.valueOf(placeData.getOrDefault("latitude", "0.0")));
                        BigDecimal longitude = new BigDecimal(String.valueOf(placeData.getOrDefault("longitude", "0.0")));
                        
                        return TravelInfoPlaceResponse.Place.builder()
                            .placeId(placeId)
                            .placeType(placeType)
                            .placeName(placeName)
                            .placeAddress(placeAddress)
                            .placeImage(placeImage)
                            .placeDescription(placeDescription)
                            .intro(intro)
                            .latitude(latitude)
                            .longitude(longitude)
                            .build();
                    })
                    .collect(Collectors.toList());
                
                log.info("FastAPI 응답 상태: {}", aiResponse.getStatusCode());
                log.info("FastAPI 응답 데이터: {}", responseBody);
                
                return new ResponseEntity<>(
                    TravelInfoPlaceResponse.builder()
                        .success("success")
                        .message("Successfully recommended places")
                        .content(placeResponseList)
                        .build(),
                    HttpStatus.OK
                );
            } else {
                throw new RuntimeException("AI service returned error: " + aiResponse.getStatusCode());
            }
        } catch (Exception e) {
            log.error("AI 추천 에러: ", e);
            return new ResponseEntity<>(
                TravelInfoPlaceResponse.builder()
                    .success("error")
                    .message("Failed to get AI recommendations: " + e.getMessage())
                    .content(new ArrayList<>())
                    .build(),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    /**
     * 사용자 email 기준 여행 정보 조회
     * @param CustomUserDetails
     * @return TravelInfoListResponse
     */
    @GetMapping("/travelInfos/list")
    public ResponseEntity<TravelInfoListResponse> travelInfoList(
        @RequestHeader(value = "Authorization", required = true) String token
        ) {
        try{
            String userEmail = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
            // String userEmail = "user1@example.com";
            List<TravelInfo> travelInfoList = travelInfoService.getTravelInfoList(userEmail);
            List<TravelInfoListResponse.Infos> infosList = new ArrayList<>();
            for(TravelInfo travelInfo : travelInfoList){
                String imgUrl = placeService.getPlaceImage(travelInfo.getId());
                TravelInfoListResponse.Infos infos = TravelInfoListResponse.convertToInfos(travelInfo, imgUrl);
                infosList.add(infos);
            }
            TravelInfoListResponse travelInfoListResponse = TravelInfoListResponse.builder()
                .success("success")
                .message("success")
                .travelInfoList(infosList)
                .build();
            return new ResponseEntity<>(travelInfoListResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 여행 정보 ID 기준 즐겨찾기 여부 수정
     * @param travelInfoId
     * @return ResponseEntity<TravelInfoListResponse>
     */
    @PutMapping("/travelInfos/{travelInfoId}/favorite")
    public ResponseEntity<String> updateFavorite(@PathVariable String travelInfoId, @RequestBody BooleanRequest booleanRequst) {
        try {
            travelInfoService.updateFavorite(travelInfoId, booleanRequst.getIsTrue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 여행 정보 ID 기준 고정 여부 수정
     * @param placeSelectRequst
     * @return
     */
    @PutMapping("/travelInfos/{travelInfoId}/fixed")
    public ResponseEntity<String> updateFixed(@PathVariable String travelInfoId, @RequestBody BooleanRequest booleanRequst) {
        try {
            travelInfoService.updateFixed(travelInfoId, booleanRequst.getIsTrue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    

    /*
     * 가이드 북 비동기 생성성
     */
    @PostMapping("/guidebook/async")
    public ResponseEntity<Map<String, String>> createGuideAsync(
        @RequestHeader("Authorization") String token,
        @RequestBody PlaceSelectRequest placeSelectRequest
    ) {
        try {
            String jobId = UUID.randomUUID().toString();
            String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
            
            // 작업 상태 초기화 (jobId, status, result, error)
            jobStatusService.setJobStatus(jobId, "PROCESSING", null, null);
            
            // 비동기 가이드 생성 시작
            guideService.createGuideAsync(placeSelectRequest, jobId, email);
            
            // 응답 생성
            Map<String, String> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "PROCESSING");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to start async guide creation", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to start guide creation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /*
     * 가이드 북 비동기 생성 상태 조회
     * @param jobId
     * @return ResponseEntity<Map<String, Object>>
     */
    @GetMapping("/guidebook/status/{jobId}")
    public ResponseEntity<Map<String, String>> getGuideBookStatus(@PathVariable String jobId) {
        JobStatusService.JobStatus status = jobStatusService.getJobStatus(jobId);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", status.getStatus());
        
        if (status.getResult() != null) {
            response.put("guideId", status.getResult());
        }
        if (status.getError() != null) {
            response.put("error", status.getError());
        }
        
        return ResponseEntity.ok(response);
    }



    // /**
    //  * 가이드 북 생성
    //  * @param PlaceSelectRequest
    //  * @return
    //  */
    // @PostMapping("/guidebook")
    // public ResponseEntity<StringResponse> createGuide(
    //     @RequestHeader("Authorization") String token,
    //     @RequestBody PlaceSelectRequest placeSelectRequest
    //     ) {
    //         String jobId = UUID.randomUUID().toString();
    //     try {
    //         String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
    //         // String email = "user1@example.com";
    //         // 1. AI 코스 추천에 요청할 데이터 형식 설정
    //         AIGuideCourseRequest aiGuideCourseRequest = guideService.convertToAIGuideCourseRequest(placeSelectRequest);

    //         System.out.println("AI 요청 데이터: " + aiGuideCourseRequest);

    //         // 2. AI 코스 추천 데이터 받기
    //         List<AIGuideCourseResponse> aiGuideCourseResponses = placeService.getAIGuideCourse(aiGuideCourseRequest,placeSelectRequest.getTravelDays());

    //         System.out.println("AI 응답 데이터: " + aiGuideCourseResponses);

    //         String title = "가이드북" + travelInfoService.getGuideCount(email);

    //         // 3. 가이드북 생성
    //         Guide guide = Guide.builder()
    //                 .travelInfo(travelInfoService.getTravelInfo(placeSelectRequest.getTravelInfoId()))
    //                 .title(title)
    //                 .travelDays(placeSelectRequest.getTravelDays())
    //                 .courseCount(placeSelectRequest.getTravelDays())
    //                 .planTypes(placeSelectRequest.getTravelTaste()) // 타입별 수정해야됨
    //                 .isFavorite(false)
    //                 .fixed(false)
    //                 .isDelete(false)
    //                 .build();

    //         // Guide 객체 확인
    //         System.out.println("Created Guide: " + guide);

    //         // 가이드, 코스, 코스 장소 생성(트랜잭션 처리)
    //         if (aiGuideCourseResponses == null) {
    //             System.out.println("aiGuideCourseResponses is null");
    //             return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    //         } else {
    //             System.out.println("AI 코스 데이터 전달 전 확인: " + aiGuideCourseResponses);
    //         }
            
    //         jobStatusService.setStatus(jobId, "Processing");
    //             // 4. 가이드, 코스, 코스 장소 생성
    //             CompletableFuture<String> guideId = guideService.createGuideAndCourses(guide, aiGuideCourseResponses);
                
    //             // 작업 완료 및 결과 저장
    //             jobStatusService.setStatus( jobId, "Completed");
    //             jobStatusService.setResult(jobId, guideId.get());
    //             log.info("가이드북 생성 완료. JobID: {}, GuideID: {}", jobId, guideId.get());

    //         return new ResponseEntity<>(StringResponse.builder()
    //             .success("success")
    //             .message("success")
    //             .value(guideId.get())
    //             .build(), HttpStatus.OK);
    

    //         } catch (Exception e) {
    //             jobStatusService.setStatus(jobId, "Failed");
    //             jobStatusService.setResult(jobId, null);
    //             return new ResponseEntity<>(StringResponse.builder()
    //                 .success("error")
    //                 .message("error")
    //                 .value(null)
    //                 .build(), HttpStatus.INTERNAL_SERVER_ERROR);
    //         }
    //     }

    /**
     * 가이드 ID 기준 가이드 조회
     * @param guideId
     * @return ResponseEntity<GuideBookResponse>
     */
    @GetMapping("/guidebooks/{guideId}")
    public ResponseEntity<GuideBookResponse> guideInfo(@PathVariable String guideId) {
        try {
            Guide guide = guideService.getGuide(guideId);
            TravelInfo travelInfo = guideService.getTravelInfo(guide.getTravelInfo().getId());
            List<GuideBookResponse.CourseList> courseListResp = courseService.getCoursePlace(guideId);
            //이미지 URL 리다이렉션
            // List<GuideBookResponse.CourseList> imageUrlList = imageService.redirectImageUrl(courseListResp);

        GuideBookResponse guideBookResponse = GuideBookResponse.builder()
            .success("success")
            .message("success")
            .guideBookTitle(guide.getTitle())
            .travelInfoTitle(travelInfo.getTitle()) 
            .travelInfoId(travelInfo.getId())
            .courseCnt(guide.getCourseCount())
            // .courses(imageUrlList)
            .courses(courseListResp)
            .build();

            return new ResponseEntity<>(guideBookResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 가이드 북 목록 조회
     * @param CustomUserDetails
     * @return ResponseEntity<GuideBookListResponse>
     */
    @Transactional(readOnly = true)
    @GetMapping("/guidebooks/list")
    public ResponseEntity<GuideBookListResponse> guideBookList(
        // @AuthenticationPrincipal CustomUserDetails user
    ) {
        try {
            //TO-DO: String userEmail = user.getEmail();
            String userEmail = "user1@example.com";
            List<Guide> guideList = guideService.getGuideList(userEmail);
            List<GuideBookListResponse.GuideList> guideListResponse = new ArrayList<>();
            for(Guide guide : guideList){
                List<String> authors = travelInfoService.getUrlAuthors(guide.getTravelInfo().getId());
                TravelInfo travelInfo = guide.getTravelInfo();
                GuideBookListResponse.GuideList tmpGuideList = GuideBookListResponse.GuideList.builder()
                    .id(guide.getId())
                    .title(guide.getTitle())
                    .travelInfoTitle(travelInfo.getTitle())
                    .createAt(guide.getCreateAt().toString())
                    .courseCount(guide.getCourseCount())
                    .isFavorite(guide.isFavorite())
                    .fixed(guide.isFixed())
                    .authors(authors)
                    .build();
                guideListResponse.add(tmpGuideList);
            }
            GuideBookListResponse guideBookListResponse = GuideBookListResponse.builder()
                .success("success")
                .message("success")
                .guideBooks(guideListResponse)
                .build();
            return new ResponseEntity<>(guideBookListResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 가이드 북 제목 수정
     * @param guideId
     * @return ResponseEntity<String>
     */
    @PutMapping("/guidebooks/{guideId}/title")
    public ResponseEntity<String> updateGuideBookTitle(@PathVariable String guideId, @RequestBody StringRequest request) {
        try {
            guideService.updateGuideBookTitle(guideId, request.getValue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 가이드 북 즐겨찾기 여부 수정
     * @param guideId
     * @return ResponseEntity<String>
     */
    @PutMapping("/guidebooks/{guideId}/favorite")
    public ResponseEntity<String> updateGuideBookFavorite(@PathVariable String guideId, @RequestBody BooleanRequest booleanRequest) {
        try {
            guideService.updateGuideBookFavorite(guideId, booleanRequest.getIsTrue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * 가이드 북 고정 여부 수정
     * @param guideId
     * @return ResponseEntity<String>
     */
    @PutMapping("/guidebooks/{guideId}/fixed")
    public ResponseEntity<String> updateGuideBookFixed(@PathVariable String guideId, @RequestBody BooleanRequest booleanRequest) {
        try {
            guideService.updateGuideBookFixed(guideId, booleanRequest.getIsTrue());
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 가이드 북 삭제
     * @param guideId
     * @return ResponseEntity<String>
     */
    @DeleteMapping("/guidebooks/{guideId}")
    public ResponseEntity<String> deleteGuideBook(@PathVariable String guideId) {
        try {
            guideService.deleteGuideBook(guideId);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @PostMapping("/guidebook/async")
    // public ResponseEntity<Map<String, String>> createGuideAsync(
    //     @RequestHeader("Authorization") String token,
    //     @RequestBody PlaceSelectRequest placeSelectRequest
    // ) {
    //     String jobId = UUID.randomUUID().toString();
        
    //     // 비동기 작업 시작
    //     CompletableFuture.runAsync(() -> {
    //         try {
    //             // 기존 가이드북 생성 로직
    //             String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
    //             AIGuideCourseRequest aiGuideCourseRequest = guideService.convertToAIGuideCourseRequest(placeSelectRequest);
    //             // ... 나머지 로직
    //         } catch (Exception e) {
    //             jobStatusService.setStatus(jobId, "FAILED");
    //         }
    //     });

    //     // 즉시 jobId 반환
    //     Map<String, String> response = new HashMap<>();
    //     response.put("jobId", jobId);
    //     response.put("status", "PROCESSING");
        
    //     return ResponseEntity.ok(response);
    // }

}

