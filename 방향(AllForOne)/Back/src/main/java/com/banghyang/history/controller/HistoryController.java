package com.banghyang.history.controller;

import com.banghyang.history.dto.HistoryResponse;
import com.banghyang.history.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/histories")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @PostMapping
    public ResponseEntity<?> createHistory(@RequestBody Map<String, String> request) {
        System.out.println("[History Controller] 히스토리 생성 컨트롤러 진입 / URL값 : " + request.get("chatId"));
        historyService.createHistoryByChat(request.get("chatId"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<List<HistoryResponse>> getMembersHistory(@PathVariable Long memberId) {
        return ResponseEntity.ok(historyService.getMembersHistory(memberId));
    }

    @DeleteMapping("/{historyId}")
    public ResponseEntity<?> deleteHistory(@PathVariable Long historyId) {
        historyService.deleteHistory(historyId);
        return ResponseEntity.ok().build();
    }
}
