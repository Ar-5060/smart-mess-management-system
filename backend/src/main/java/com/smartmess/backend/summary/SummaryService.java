package com.smartmess.backend.summary;

import com.smartmess.backend.expense.Expense;
import com.smartmess.backend.expense.ExpenseCategory;
import com.smartmess.backend.expense.ExpenseRepository;
import com.smartmess.backend.meal.Meal;
import com.smartmess.backend.meal.MealRepository;
import com.smartmess.backend.mess.Mess;
import com.smartmess.backend.mess.MessRepository;
import com.smartmess.backend.rent.RentPayment;
import com.smartmess.backend.rent.RentPaymentRepository;
import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final MessRepository messRepository;
    private final UserRepository userRepository;
    private final MealRepository mealRepository;
    private final ExpenseRepository expenseRepository;
    private final RentPaymentRepository rentPaymentRepository;

    public MonthlySummaryResponse getMonthlySummary(Long messId, Integer month, Integer year) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + messId));

        List<User> activeUsers = userRepository.findByMessId(messId).stream()
                .filter(user -> "ACTIVE".equalsIgnoreCase(user.getStatus()))
                .sorted(Comparator.comparing(User::getName))
                .toList();

        if (activeUsers.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No active users found in this mess");
        }

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Meal> monthlyMeals = mealRepository.findByUserMessIdAndMealDateBetween(
                messId, startDate, endDate
        );

        List<Expense> monthlyExpenses = expenseRepository.findByMessIdAndExpenseDateBetweenOrderByExpenseDateDescIdDesc(
                messId, startDate, endDate
        );

        List<RentPayment> monthlyRentPayments = rentPaymentRepository.findByMessIdAndPaymentMonthAndPaymentYear(
                messId, month, year
        );

        BigDecimal totalRent = defaultIfNull(mess.getMonthlyRent());

        BigDecimal totalMealExpense = monthlyExpenses.stream()
                .filter(expense -> expense.getCategory() == ExpenseCategory.BAZAR)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOtherSharedExpense = monthlyExpenses.stream()
                .filter(expense -> expense.getCategory() != ExpenseCategory.BAZAR)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalMeals = monthlyMeals.stream()
                .mapToInt(Meal::getTotalMealUnits)
                .sum();

        BigDecimal mealRate = totalMeals > 0
                ? totalMealExpense.divide(BigDecimal.valueOf(totalMeals), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal rentSharePerMember = totalRent.divide(
                BigDecimal.valueOf(activeUsers.size()), 2, RoundingMode.HALF_UP
        );

        BigDecimal otherSharedCostSharePerMember = totalOtherSharedExpense.divide(
                BigDecimal.valueOf(activeUsers.size()), 2, RoundingMode.HALF_UP
        );

        Map<Long, Integer> mealsByUser = monthlyMeals.stream()
                .collect(Collectors.groupingBy(
                        meal -> meal.getUser().getId(),
                        Collectors.summingInt(Meal::getTotalMealUnits)
                ));

        Map<Long, BigDecimal> expensesPaidByUser = monthlyExpenses.stream()
                .filter(expense -> expense.getPaidBy() != null)
                .collect(Collectors.groupingBy(
                        expense -> expense.getPaidBy().getId(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        Map<Long, BigDecimal> rentPaidByUser = monthlyRentPayments.stream()
                .collect(Collectors.groupingBy(
                        payment -> payment.getUser().getId(),
                        Collectors.reducing(BigDecimal.ZERO, RentPayment::getAmount, BigDecimal::add)
                ));

        List<MemberSettlementResponse> memberSummaries = activeUsers.stream()
                .map(user -> buildMemberSummary(
                        user,
                        mealsByUser,
                        expensesPaidByUser,
                        rentPaidByUser,
                        mealRate,
                        rentSharePerMember,
                        otherSharedCostSharePerMember
                ))
                .toList();

        BigDecimal totalPayableByAll = memberSummaries.stream()
                .map(MemberSettlementResponse::getTotalPayable)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaidByAll = memberSummaries.stream()
                .map(MemberSettlementResponse::getTotalPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDue = memberSummaries.stream()
                .map(MemberSettlementResponse::getDueAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAdvance = memberSummaries.stream()
                .map(MemberSettlementResponse::getAdvanceAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return MonthlySummaryResponse.builder()
                .messId(mess.getId())
                .messName(mess.getMessName())
                .month(month)
                .year(year)
                .activeMembers(activeUsers.size())
                .totalMeals(totalMeals)
                .totalMealExpense(scale(totalMealExpense))
                .mealRate(scale(mealRate))
                .totalOtherSharedExpense(scale(totalOtherSharedExpense))
                .totalRent(scale(totalRent))
                .rentSharePerMember(scale(rentSharePerMember))
                .otherSharedCostSharePerMember(scale(otherSharedCostSharePerMember))
                .totalPayableByAll(scale(totalPayableByAll))
                .totalPaidByAll(scale(totalPaidByAll))
                .totalDue(scale(totalDue))
                .totalAdvance(scale(totalAdvance))
                .memberSummaries(memberSummaries)
                .build();
    }

    public MemberMonthlySummaryResponse getMemberMonthlySummary(Long userId, Integer month, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + userId));

        if (user.getMess() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User is not assigned to any mess");
        }

        MonthlySummaryResponse monthlySummary = getMonthlySummary(user.getMess().getId(), month, year);

        MemberSettlementResponse memberSummary = monthlySummary.getMemberSummaries().stream()
                .filter(member -> member.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Member summary not found for user id: " + userId));

        return MemberMonthlySummaryResponse.builder()
                .messId(monthlySummary.getMessId())
                .messName(monthlySummary.getMessName())
                .month(monthlySummary.getMonth())
                .year(monthlySummary.getYear())
                .memberSummary(memberSummary)
                .build();
    }

    private MemberSettlementResponse buildMemberSummary(
            User user,
            Map<Long, Integer> mealsByUser,
            Map<Long, BigDecimal> expensesPaidByUser,
            Map<Long, BigDecimal> rentPaidByUser,
            BigDecimal mealRate,
            BigDecimal rentShare,
            BigDecimal otherSharedCostShare
    ) {
        int totalMeals = mealsByUser.getOrDefault(user.getId(), 0);

        BigDecimal mealCost = mealRate.multiply(BigDecimal.valueOf(totalMeals));
        BigDecimal expensePaid = expensesPaidByUser.getOrDefault(user.getId(), BigDecimal.ZERO);
        BigDecimal rentPaid = rentPaidByUser.getOrDefault(user.getId(), BigDecimal.ZERO);

        BigDecimal totalPayable = mealCost.add(rentShare).add(otherSharedCostShare);
        BigDecimal totalPaid = expensePaid.add(rentPaid);
        BigDecimal balance = totalPaid.subtract(totalPayable);

        BigDecimal dueAmount = totalPayable.subtract(totalPaid).max(BigDecimal.ZERO);
        BigDecimal advanceAmount = totalPaid.subtract(totalPayable).max(BigDecimal.ZERO);

        String settlementStatus;
        if (advanceAmount.compareTo(BigDecimal.ZERO) > 0) {
            settlementStatus = "ADVANCE";
        } else if (dueAmount.compareTo(BigDecimal.ZERO) > 0) {
            settlementStatus = "DUE";
        } else {
            settlementStatus = "SETTLED";
        }

        return MemberSettlementResponse.builder()
                .userId(user.getId())
                .userName(user.getName())
                .totalMeals(totalMeals)
                .mealCost(scale(mealCost))
                .rentShare(scale(rentShare))
                .otherSharedCostShare(scale(otherSharedCostShare))
                .totalPayable(scale(totalPayable))
                .expensePaid(scale(expensePaid))
                .rentPaid(scale(rentPaid))
                .totalPaid(scale(totalPaid))
                .balance(scale(balance))
                .dueAmount(scale(dueAmount))
                .advanceAmount(scale(advanceAmount))
                .settlementStatus(settlementStatus)
                .build();
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}