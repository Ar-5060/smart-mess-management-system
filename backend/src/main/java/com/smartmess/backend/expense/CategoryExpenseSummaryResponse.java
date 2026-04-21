package com.smartmess.backend.expense;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CategoryExpenseSummaryResponse {

    private String category;
    private BigDecimal totalAmount;
}