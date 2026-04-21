package com.smartmess.backend.rent;

import com.smartmess.backend.mess.Mess;
import com.smartmess.backend.mess.MessRepository;
import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RentPaymentService {

    private final RentPaymentRepository rentPaymentRepository;
    private final MessRepository messRepository;
    private final UserRepository userRepository;

    public RentPaymentResponse recordRentPayment(RentPaymentRequest request) {
        Mess mess = messRepository.findById(request.getMessId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + request.getMessId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + request.getUserId()));

        if (user.getMess() == null || !user.getMess().getId().equals(mess.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User does not belong to this mess");
        }

        BigDecimal expectedShare = calculateExpectedRentShare(mess);

        RentPayment payment = rentPaymentRepository
                .findByMessIdAndUserIdAndPaymentMonthAndPaymentYear(
                        request.getMessId(),
                        request.getUserId(),
                        request.getMonth(),
                        request.getYear()
                )
                .orElseGet(() -> RentPayment.builder()
                        .mess(mess)
                        .user(user)
                        .paymentMonth(request.getMonth())
                        .paymentYear(request.getYear())
                        .amount(BigDecimal.ZERO)
                        .status(RentPaymentStatus.UNPAID)
                        .build());

        payment.setAmount(payment.getAmount().add(request.getAmount()));
        payment.setPaymentDate(request.getPaymentDate());
        payment.setStatus(calculateStatus(payment.getAmount(), expectedShare));

        RentPayment savedPayment = rentPaymentRepository.save(payment);

        return mapToResponse(savedPayment, expectedShare);
    }

    public MonthlyRentSummaryResponse getMonthlyRentSummary(Long messId, Integer month, Integer year) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mess not found with id: " + messId));

        List<User> activeUsers = userRepository.findByMessId(messId).stream()
                .filter(user -> "ACTIVE".equalsIgnoreCase(user.getStatus()))
                .toList();

        if (activeUsers.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No active users found in this mess");
        }

        BigDecimal monthlyRent = mess.getMonthlyRent() != null ? mess.getMonthlyRent() : BigDecimal.ZERO;
        BigDecimal expectedShare = monthlyRent.divide(
                BigDecimal.valueOf(activeUsers.size()), 2, RoundingMode.HALF_UP
        );

        List<RentPayment> payments = rentPaymentRepository.findByMessIdAndPaymentMonthAndPaymentYear(
                messId, month, year
        );

        Map<Long, RentPayment> paymentMap = payments.stream()
                .collect(Collectors.toMap(payment -> payment.getUser().getId(), Function.identity()));

        List<MemberRentStatusResponse> memberStatuses = activeUsers.stream()
                .map(user -> {
                    RentPayment payment = paymentMap.get(user.getId());
                    BigDecimal paidAmount = payment != null ? payment.getAmount() : BigDecimal.ZERO;
                    BigDecimal remainingDue = expectedShare.subtract(paidAmount).max(BigDecimal.ZERO);
                    RentPaymentStatus status = calculateStatus(paidAmount, expectedShare);

                    return MemberRentStatusResponse.builder()
                            .userId(user.getId())
                            .userName(user.getName())
                            .amountPaid(paidAmount)
                            .expectedRentShare(expectedShare)
                            .remainingDue(remainingDue)
                            .status(status.name())
                            .build();
                })
                .sorted(Comparator.comparing(MemberRentStatusResponse::getUserName))
                .toList();

        BigDecimal totalCollected = memberStatuses.stream()
                .map(MemberRentStatusResponse::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDue = memberStatuses.stream()
                .map(MemberRentStatusResponse::getRemainingDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return MonthlyRentSummaryResponse.builder()
                .messId(mess.getId())
                .messName(mess.getMessName())
                .month(month)
                .year(year)
                .monthlyRent(monthlyRent)
                .activeMembers(activeUsers.size())
                .expectedRentSharePerMember(expectedShare)
                .totalCollected(totalCollected)
                .totalDue(totalDue)
                .memberStatuses(memberStatuses)
                .build();
    }

    private BigDecimal calculateExpectedRentShare(Mess mess) {
        List<User> activeUsers = userRepository.findByMessId(mess.getId()).stream()
                .filter(user -> "ACTIVE".equalsIgnoreCase(user.getStatus()))
                .toList();

        if (activeUsers.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No active users found in this mess");
        }

        BigDecimal monthlyRent = mess.getMonthlyRent() != null ? mess.getMonthlyRent() : BigDecimal.ZERO;

        return monthlyRent.divide(
                BigDecimal.valueOf(activeUsers.size()), 2, RoundingMode.HALF_UP
        );
    }

    private RentPaymentStatus calculateStatus(BigDecimal paidAmount, BigDecimal expectedShare) {
        if (paidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return RentPaymentStatus.UNPAID;
        }
        if (paidAmount.compareTo(expectedShare) < 0) {
            return RentPaymentStatus.PARTIAL;
        }
        return RentPaymentStatus.PAID;
    }

    private RentPaymentResponse mapToResponse(RentPayment payment, BigDecimal expectedShare) {
        BigDecimal remainingDue = expectedShare.subtract(payment.getAmount()).max(BigDecimal.ZERO);

        return RentPaymentResponse.builder()
                .id(payment.getId())
                .messId(payment.getMess().getId())
                .messName(payment.getMess().getMessName())
                .userId(payment.getUser().getId())
                .userName(payment.getUser().getName())
                .month(payment.getPaymentMonth())
                .year(payment.getPaymentYear())
                .amountPaid(payment.getAmount())
                .expectedRentShare(expectedShare)
                .remainingDue(remainingDue)
                .status(payment.getStatus().name())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}