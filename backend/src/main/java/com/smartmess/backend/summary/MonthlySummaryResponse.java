package com.smartmess.backend.summary;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class MonthlySummaryResponse {

    private Long messId;
    private String messName;

    private Integer month;
    private Integer year;

    private Integer activeMembers;

    private Integer totalMeals;
    private BigDecimal totalMealExpense;
    private BigDecimal mealRate;

    private BigDecimal totalOtherSharedExpense;
    private BigDecimal totalRent;

    private BigDecimal rentSharePerMember;
    private BigDecimal otherSharedCostSharePerMember;

    private BigDecimal totalPayableByAll;
    private BigDecimal totalPaidByAll;

    private BigDecimal totalDue;
    private BigDecimal totalAdvance;

    private List<MemberSettlementResponse> memberSummaries;
}