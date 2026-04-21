package com.smartmess.backend.summary;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberMonthlySummaryResponse {

    private Long messId;
    private String messName;
    private Integer month;
    private Integer year;
    private MemberSettlementResponse memberSummary;
}