package com.smartmess.backend.meal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberMealSummaryResponse {

    private Long userId;
    private String userName;
    private Integer totalMeals;
}