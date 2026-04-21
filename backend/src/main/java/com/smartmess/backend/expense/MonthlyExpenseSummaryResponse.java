package com.smartmess.backend.expense;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class MonthlyExpenseSummaryResponse {

    private Long messId;
    private String messName;
    private Integer month;
    private Integer year;
    private BigDecimal totalExpense;
    private List<CategoryExpenseSummaryResponse> categorySummaries;
    private List<ExpenseResponse> expenses;
}