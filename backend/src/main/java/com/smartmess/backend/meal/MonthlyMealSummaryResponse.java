package com.smartmess.backend.meal;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MonthlyMealSummaryResponse {

    private Long messId;
    private String messName;
    private Integer month;
    private Integer year;
    private Integer totalMeals;
    private List<MemberMealSummaryResponse> memberSummaries;
}