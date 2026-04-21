package com.smartmess.backend.meal;

import com.smartmess.backend.mess.Mess;
import com.smartmess.backend.mess.MessRepository;
import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;
    private final MessRepository messRepository;

    public MealResponse addMeal(MealRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + request.getUserId()));

        if (user.getMess() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User is not assigned to any mess");
        }

        mealRepository.findByUserIdAndMealDate(request.getUserId(), request.getMealDate())
                .ifPresent(existing -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Meal entry already exists for this user on " + request.getMealDate());
                });

        Meal meal = Meal.builder()
                .user(user)
                .mealDate(request.getMealDate())
                .breakfastCount(request.getBreakfastCount())
                .lunchCount(request.getLunchCount())
                .dinnerCount(request.getDinnerCount())
                .totalMealUnits(calculateTotalMeals(
                        request.getBreakfastCount(),
                        request.getLunchCount(),
                        request.getDinnerCount()))
                .build();

        Meal savedMeal = mealRepository.save(meal);
        return mapToResponse(savedMeal);
    }

    public MealResponse updateMeal(Long mealId, MealRequest request) {
        Meal existingMeal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Meal not found with id: " + mealId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + request.getUserId()));

        if (user.getMess() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User is not assigned to any mess");
        }

        mealRepository.findByUserIdAndMealDate(request.getUserId(), request.getMealDate())
                .ifPresent(found -> {
                    if (!found.getId().equals(mealId)) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Another meal entry already exists for this user on " + request.getMealDate());
                    }
                });

        existingMeal.setUser(user);
        existingMeal.setMealDate(request.getMealDate());
        existingMeal.setBreakfastCount(request.getBreakfastCount());
        existingMeal.setLunchCount(request.getLunchCount());
        existingMeal.setDinnerCount(request.getDinnerCount());
        existingMeal.setTotalMealUnits(calculateTotalMeals(
                request.getBreakfastCount(),
                request.getLunchCount(),
                request.getDinnerCount()));

        Meal updatedMeal = mealRepository.save(existingMeal);
        return mapToResponse(updatedMeal);
    }

    public List<MealResponse> getMealsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found with id: " + userId);
        }

        return mealRepository.findByUserIdOrderByMealDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MonthlyMealSummaryResponse getMonthlySummaryByMessId(Long messId, Integer month, Integer year) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + messId));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Meal> meals = mealRepository.findByUserMessIdAndMealDateBetween(messId, startDate, endDate);

        Map<Long, List<Meal>> mealsByUser = meals.stream()
                .collect(Collectors.groupingBy(meal -> meal.getUser().getId()));

        List<MemberMealSummaryResponse> memberSummaries = mealsByUser.values().stream()
                .map(userMeals -> {
                    Meal firstMeal = userMeals.get(0);
                    int totalMeals = userMeals.stream()
                            .mapToInt(Meal::getTotalMealUnits)
                            .sum();

                    return MemberMealSummaryResponse.builder()
                            .userId(firstMeal.getUser().getId())
                            .userName(firstMeal.getUser().getName())
                            .totalMeals(totalMeals)
                            .build();
                })
                .sorted(Comparator.comparing(MemberMealSummaryResponse::getUserName))
                .toList();

        int grandTotalMeals = meals.stream()
                .mapToInt(Meal::getTotalMealUnits)
                .sum();

        return MonthlyMealSummaryResponse.builder()
                .messId(mess.getId())
                .messName(mess.getMessName())
                .month(month)
                .year(year)
                .totalMeals(grandTotalMeals)
                .memberSummaries(memberSummaries)
                .build();
    }

    private Integer calculateTotalMeals(Integer breakfast, Integer lunch, Integer dinner) {
        return breakfast + lunch + dinner;
    }

    private MealResponse mapToResponse(Meal meal) {
        return MealResponse.builder()
                .id(meal.getId())
                .userId(meal.getUser().getId())
                .userName(meal.getUser().getName())
                .messId(meal.getUser().getMess() != null ? meal.getUser().getMess().getId() : null)
                .messName(meal.getUser().getMess() != null ? meal.getUser().getMess().getMessName() : null)
                .mealDate(meal.getMealDate())
                .breakfastCount(meal.getBreakfastCount())
                .lunchCount(meal.getLunchCount())
                .dinnerCount(meal.getDinnerCount())
                .totalMealUnits(meal.getTotalMealUnits())
                .build();
    }
}