package com.smartmess.backend.meal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MealRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Meal date is required")
    private LocalDate mealDate;

    @NotNull(message = "Breakfast count is required")
    @Min(value = 0, message = "Breakfast count cannot be negative")
    private Integer breakfastCount;

    @NotNull(message = "Lunch count is required")
    @Min(value = 0, message = "Lunch count cannot be negative")
    private Integer lunchCount;

    @NotNull(message = "Dinner count is required")
    @Min(value = 0, message = "Dinner count cannot be negative")
    private Integer dinnerCount;
}