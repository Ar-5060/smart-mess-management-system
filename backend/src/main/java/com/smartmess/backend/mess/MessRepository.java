package com.smartmess.backend.mess;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MessRepository extends JpaRepository<Mess, Long> {
}