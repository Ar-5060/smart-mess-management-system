package com.smartmess.backend.meal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Meal API is working");
    }

    @PostMapping
    public ResponseEntity<?> addMeal(@Valid @RequestBody MealRequest request) {
        MealResponse meal = mealService.addMeal(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Meal entry created successfully");
        response.put("meal", meal);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{mealId}")
    public ResponseEntity<MealResponse> updateMeal(
            @PathVariable Long mealId,
            @Valid @RequestBody MealRequest request) {
        return ResponseEntity.ok(mealService.updateMeal(mealId, request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealResponse>> getMealsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(mealService.getMealsByUserId(userId));
    }

    @GetMapping("/mess/{messId}/monthly")
    public ResponseEntity<MonthlyMealSummaryResponse> getMonthlySummary(
            @PathVariable Long messId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(mealService.getMonthlySummaryByMessId(messId, month, year));
    }
}