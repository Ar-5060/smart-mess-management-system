package com.smartmess.backend.mess;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "messes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Mess name is required")
    @Column(name = "mess_name", nullable = false)
    private String messName;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @Min(value = 1, message = "Total members must be at least 1")
    @Column(name = "total_members")
    private Integer totalMembers;

    @Column(name = "monthly_rent", precision = 12, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "rent_due_date")
    private LocalDate rentDueDate;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}