package com.banghyang.member.controller;

import com.banghyang.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/members")
@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

//    @GetMapping
//    public ResponseEntity<List<MemberResponse>> getAllMembers() {
//        return ResponseEntity.ok(memberService.getAllMembers());
//    }

    @PutMapping("/{memberId}")
    public ResponseEntity<?> setMemberLeave(@PathVariable Long memberId) {
        memberService.setMemberLeave(memberId);
        return ResponseEntity.ok().build();
    }
}
