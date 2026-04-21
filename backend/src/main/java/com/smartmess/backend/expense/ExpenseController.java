package com.smartmess.backend.expense;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Expense API is working");
    }

    @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse expense = expenseService.addExpense(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Expense added successfully");
        response.put("expense", expense);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mess/{messId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByMessId(@PathVariable Long messId) {
        return ResponseEntity.ok(expenseService.getExpensesByMessId(messId));
    }

    @GetMapping("/monthly/{messId}")
    public ResponseEntity<MonthlyExpenseSummaryResponse> getMonthlyExpenseSummary(
            @PathVariable Long messId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(expenseService.getMonthlyExpenseSummary(messId, month, year));
    }
}