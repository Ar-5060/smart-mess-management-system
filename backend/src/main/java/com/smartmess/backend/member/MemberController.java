package com.smartmess.backend.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Member API is working");
    }

    @PostMapping
    public ResponseEntity<?> addMember(@Valid @RequestBody MemberRequest request) {
        MemberResponse member = memberService.addMember(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Member added successfully");
        response.put("member", member);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mess/{messId}")
    public ResponseEntity<List<MemberResponse>> getMembersByMessId(@PathVariable Long messId) {
        return ResponseEntity.ok(memberService.getMembersByMessId(messId));
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<MemberResponse> getMemberById(@PathVariable Long memberId) {
        return ResponseEntity.ok(memberService.getMemberById(memberId));
    }

    @PutMapping("/{memberId}/deactivate")
    public ResponseEntity<MemberResponse> deactivateMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(memberService.deactivateMember(memberId));
    }

    @PutMapping("/{memberId}/activate")
    public ResponseEntity<MemberResponse> activateMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(memberService.activateMember(memberId));
    }
}