package com.banghyang.object.spice.controller;

import com.banghyang.object.spice.dto.SpiceCreateRequest;
import com.banghyang.object.spice.dto.SpiceModifyRequest;
import com.banghyang.object.spice.dto.SpiceResponse;
import com.banghyang.object.spice.service.SpiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/spices")
@RestController
@RequiredArgsConstructor
@Slf4j
public class SpiceController {

    private final SpiceService spiceService;

    /**
     * 모든 향료 조회하기
     */
    @GetMapping
    public ResponseEntity<List<SpiceResponse>> getAllSpices() {
        return ResponseEntity.ok(spiceService.getAllSpiceResponse());
    }

    /**
     * 새로운 향료 등록하기
     */
    @PostMapping
    public ResponseEntity<?> createSpice(@RequestBody SpiceCreateRequest spiceCreateRequest) {
        spiceService.createSpice(spiceCreateRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 기존 향료 정보 수정하기
     */
    @PutMapping
    public ResponseEntity<?> modifySpice(@RequestBody SpiceModifyRequest spiceModifyRequest) {
        spiceService.modifySpice(spiceModifyRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 기존 향료 삭제하기
     */
    @DeleteMapping("/{spiceId}")
    public ResponseEntity<?> deleteSpice(@PathVariable Long spiceId) {
        spiceService.deleteSpice(spiceId);
        return ResponseEntity.ok().build();
    }
}
