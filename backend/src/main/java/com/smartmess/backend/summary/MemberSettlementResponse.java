package com.smartmess.backend.summary;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class MemberSettlementResponse {

    private Long userId;
    private String userName;

    private Integer totalMeals;
    private BigDecimal mealCost;

    private BigDecimal rentShare;
    private BigDecimal otherSharedCostShare;

    private BigDecimal totalPayable;

    private BigDecimal expensePaid;
    private BigDecimal rentPaid;
    private BigDecimal totalPaid;

    private BigDecimal balance;
    private BigDecimal dueAmount;
    private BigDecimal advanceAmount;

    private String settlementStatus;
}