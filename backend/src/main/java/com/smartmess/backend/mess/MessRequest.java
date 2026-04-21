package com.smartmess.backend.mess;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class MessRequest {

    @NotBlank(message = "Mess name is required")
    private String messName;

    @NotBlank(message = "Address is required")
    private String address;

    @Min(value = 1, message = "Total members must be at least 1")
    private Integer totalMembers;

    private BigDecimal monthlyRent;

    private LocalDate rentDueDate;

    private Long createdBy;
}