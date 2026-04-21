package com.smartmess.backend.rent;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class MonthlyRentSummaryResponse {

    private Long messId;
    private String messName;
    private Integer month;
    private Integer year;
    private BigDecimal monthlyRent;
    private Integer activeMembers;
    private BigDecimal expectedRentSharePerMember;
    private BigDecimal totalCollected;
    private BigDecimal totalDue;
    private List<MemberRentStatusResponse> memberStatuses;
}