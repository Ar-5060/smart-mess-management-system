package com.smartmess.backend.rent;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class RentPaymentResponse {

    private Long id;
    private Long messId;
    private String messName;
    private Long userId;
    private String userName;
    private Integer month;
    private Integer year;
    private BigDecimal amountPaid;
    private BigDecimal expectedRentShare;
    private BigDecimal remainingDue;
    private String status;
    private LocalDate paymentDate;
}