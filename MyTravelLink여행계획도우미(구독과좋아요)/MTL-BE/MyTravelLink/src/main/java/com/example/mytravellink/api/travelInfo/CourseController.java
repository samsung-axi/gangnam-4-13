package com.example.mytravellink.api.travelInfo;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mytravellink.api.travelInfo.dto.course.PlaceAddRequest;
import com.example.mytravellink.api.travelInfo.dto.course.PlaceDeleteRequest;
import com.example.mytravellink.api.travelInfo.dto.course.PlaceMoveRequest;
import com.example.mytravellink.api.travelInfo.dto.course.PlaceRequest;
import com.example.mytravellink.auth.handler.JwtTokenProvider;
import com.example.mytravellink.domain.travel.service.CourseService;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseController {

    private final CourseService courseService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PutMapping("/")
    public ResponseEntity<String> updateCoursePlace(@RequestHeader("Authorization") String token, @RequestBody PlaceRequest request) {
        try {
            String userEmail = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
            List<String> placeIds = request.getPlaceIds();
                
            courseService.updateCoursePlace(request.getId(), placeIds, userEmail);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        }
    }



    @PutMapping("/places/add")
    public ResponseEntity<String> addCoursePlace(@RequestBody PlaceAddRequest request) {
        try {
            List<String> placeIds = request.getPlaceIds();
            List<String> courseIds = request.getCourseIds();
            courseService.addCoursePlace(courseIds, placeIds);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        }
    }

    @PutMapping("/place/move")
    public ResponseEntity<String> moveCoursePlace( @RequestBody PlaceMoveRequest request) {
        try {
            courseService.moveCoursePlace(request.getPlaceId(), request.getBeforeCourseId(), request.getAfterCourseId(), request.getPlaceId());
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        }
    }

    @DeleteMapping("/places/delete")
    public ResponseEntity<String> deleteCoursePlace(@RequestBody PlaceDeleteRequest request) {
        try {
            String courseId = request.getCourseId();
            List<String> placeIds = request.getPlaceIds();
            courseService.deleteCoursePlace(courseId, placeIds);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        }
    }
}

