package com.smartmess.backend.expense;

import com.smartmess.backend.mess.Mess;
import com.smartmess.backend.mess.MessRepository;
import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final MessRepository messRepository;
    private final UserRepository userRepository;

    public ExpenseResponse addExpense(ExpenseRequest request) {
        Mess mess = messRepository.findById(request.getMessId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + request.getMessId()));

        User paidByUser = null;
        if (request.getPaidByUserId() != null) {
            paidByUser = userRepository.findById(request.getPaidByUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "User not found with id: " + request.getPaidByUserId()));

            if (paidByUser.getMess() == null || !paidByUser.getMess().getId().equals(mess.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Payer does not belong to this mess");
            }
        }

        Expense expense = Expense.builder()
                .mess(mess)
                .title(request.getTitle())
                .category(request.getCategory())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .paidBy(paidByUser)
                .notes(request.getNotes())
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    public List<ExpenseResponse> getExpensesByMessId(Long messId) {
        if (!messRepository.existsById(messId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Mess not found with id: " + messId);
        }

        return expenseRepository.findByMessIdOrderByExpenseDateDescIdDesc(messId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MonthlyExpenseSummaryResponse getMonthlyExpenseSummary(Long messId, Integer month, Integer year) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + messId));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Expense> expenses = expenseRepository.findByMessIdAndExpenseDateBetweenOrderByExpenseDateDescIdDesc(
                messId, startDate, endDate
        );

        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<ExpenseCategory, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        List<CategoryExpenseSummaryResponse> categorySummaries = Arrays.stream(ExpenseCategory.values())
                .filter(categoryTotals::containsKey)
                .map(category -> CategoryExpenseSummaryResponse.builder()
                        .category(category.name())
                        .totalAmount(categoryTotals.get(category))
                        .build())
                .toList();

        List<ExpenseResponse> expenseResponses = expenses.stream()
                .map(this::mapToResponse)
                .toList();

        return MonthlyExpenseSummaryResponse.builder()
                .messId(mess.getId())
                .messName(mess.getMessName())
                .month(month)
                .year(year)
                .totalExpense(totalExpense)
                .categorySummaries(categorySummaries)
                .expenses(expenseResponses)
                .build();
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .messId(expense.getMess().getId())
                .messName(expense.getMess().getMessName())
                .title(expense.getTitle())
                .category(expense.getCategory().name())
                .amount(expense.getAmount())
                .expenseDate(expense.getExpenseDate())
                .paidByUserId(expense.getPaidBy() != null ? expense.getPaidBy().getId() : null)
                .paidByUserName(expense.getPaidBy() != null ? expense.getPaidBy().getName() : null)
                .notes(expense.getNotes())
                .build();
    }
}