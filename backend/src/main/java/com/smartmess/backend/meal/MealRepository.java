package com.smartmess.backend.meal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {

    Optional<Meal> findByUserIdAndMealDate(Long userId, LocalDate mealDate);

    List<Meal> findByUserIdOrderByMealDateDesc(Long userId);

    List<Meal> findByUserMessIdAndMealDateBetween(Long messId, LocalDate startDate, LocalDate endDate);
}