package com.smartmess.backend.mess;

import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessService {

    private final MessRepository messRepository;
    private final UserRepository userRepository;

    public Mess createMess(MessRequest request) {
        User creator = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with id: " + request.getCreatedBy()
                ));

        Mess mess = Mess.builder()
                .messName(request.getMessName())
                .address(request.getAddress())
                .totalMembers(request.getTotalMembers())
                .monthlyRent(request.getMonthlyRent())
                .rentDueDate(request.getRentDueDate())
                .createdBy(request.getCreatedBy())
                .build();

        Mess savedMess = messRepository.save(mess);

        creator.setMess(savedMess);
        userRepository.save(creator);

        return savedMess;
    }

    public List<Mess> getAllMesses() {
        return messRepository.findAll();
    }

    public Mess getMessById(Long id) {
        return messRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mess not found with id: " + id));
    }
}