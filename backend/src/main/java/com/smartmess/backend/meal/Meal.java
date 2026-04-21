package com.smartmess.backend.meal;

import com.smartmess.backend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "meals",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_meal_user_date", columnNames = {"user_id", "meal_date"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate;

    @Column(name = "breakfast_count", nullable = false)
    private Integer breakfastCount;

    @Column(name = "lunch_count", nullable = false)
    private Integer lunchCount;

    @Column(name = "dinner_count", nullable = false)
    private Integer dinnerCount;

    @Column(name = "total_meal_units", nullable = false)
    private Integer totalMealUnits;

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