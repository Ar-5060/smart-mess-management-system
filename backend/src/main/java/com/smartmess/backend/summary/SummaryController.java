package com.smartmess.backend.summary;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Summary API is working");
    }

    @GetMapping("/monthly/{messId}")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @PathVariable Long messId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(summaryService.getMonthlySummary(messId, month, year));
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<MemberMonthlySummaryResponse> getMemberMonthlySummary(
            @PathVariable Long userId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(summaryService.getMemberMonthlySummary(userId, month, year));
    }
}