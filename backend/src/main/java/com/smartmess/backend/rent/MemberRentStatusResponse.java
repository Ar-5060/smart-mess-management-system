package com.smartmess.backend.rent;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class MemberRentStatusResponse {

    private Long userId;
    private String userName;
    private BigDecimal amountPaid;
    private BigDecimal expectedRentShare;
    private BigDecimal remainingDue;
    private String status;
}