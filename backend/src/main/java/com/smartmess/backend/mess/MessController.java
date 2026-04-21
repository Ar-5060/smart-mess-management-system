package com.smartmess.backend.mess;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messes")
@RequiredArgsConstructor
public class MessController {

    private final MessService messService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Mess API is working");
    }

    @PostMapping
    public ResponseEntity<?> createMess(@Valid @RequestBody MessRequest request) {
        Mess savedMess = messService.createMess(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Mess created successfully");
        response.put("id", savedMess.getId());
        response.put("messName", savedMess.getMessName());
        response.put("address", savedMess.getAddress());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<Mess>> getAllMesses() {
        return ResponseEntity.ok(messService.getAllMesses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mess> getMessById(@PathVariable Long id) {
        return ResponseEntity.ok(messService.getMessById(id));
    }
}