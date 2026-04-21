package com.smartmess.backend.rent;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rent-payments")
@RequiredArgsConstructor
public class RentPaymentController {

    private final RentPaymentService rentPaymentService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Rent Payment API is working");
    }

    @PostMapping
    public ResponseEntity<?> recordRentPayment(@Valid @RequestBody RentPaymentRequest request) {
        RentPaymentResponse payment = rentPaymentService.recordRentPayment(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Rent payment recorded successfully");
        response.put("payment", payment);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/monthly/{messId}")
    public ResponseEntity<MonthlyRentSummaryResponse> getMonthlyRentSummary(
            @PathVariable Long messId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(rentPaymentService.getMonthlyRentSummary(messId, month, year));
    }
}