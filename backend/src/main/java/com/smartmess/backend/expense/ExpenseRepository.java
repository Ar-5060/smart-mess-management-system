package com.smartmess.backend.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByMessIdOrderByExpenseDateDescIdDesc(Long messId);

    List<Expense> findByMessIdAndExpenseDateBetweenOrderByExpenseDateDescIdDesc(
            Long messId, LocalDate startDate, LocalDate endDate
    );
}