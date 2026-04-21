package com.smartmess.backend.meal;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MealResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long messId;
    private String messName;
    private LocalDate mealDate;
    private Integer breakfastCount;
    private Integer lunchCount;
    private Integer dinnerCount;
    private Integer totalMealUnits;
}