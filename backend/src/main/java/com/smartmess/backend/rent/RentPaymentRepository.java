package com.smartmess.backend.rent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RentPaymentRepository extends JpaRepository<RentPayment, Long> {

    Optional<RentPayment> findByMessIdAndUserIdAndPaymentMonthAndPaymentYear(
            Long messId, Long userId, Integer paymentMonth, Integer paymentYear
    );

    List<RentPayment> findByMessIdAndPaymentMonthAndPaymentYear(
            Long messId, Integer paymentMonth, Integer paymentYear
    );

    List<RentPayment> findByUserIdAndPaymentMonthAndPaymentYear(
            Long userId, Integer paymentMonth, Integer paymentYear
    );
}