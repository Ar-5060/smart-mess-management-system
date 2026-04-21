package com.smartmess.backend.expense;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class ExpenseResponse {

    private Long id;
    private Long messId;
    private String messName;
    private String title;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private Long paidByUserId;
    private String paidByUserName;
    private String notes;
}