package com.smartmess.backend.member;

import com.smartmess.backend.mess.Mess;
import com.smartmess.backend.mess.MessRepository;
import com.smartmess.backend.user.Role;
import com.smartmess.backend.user.User;
import com.smartmess.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;
    private final MessRepository messRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberResponse addMember(MemberRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Mess mess = messRepository.findById(request.getMessId())
                .orElseThrow(() -> new RuntimeException("Mess not found with id: " + request.getMessId()));

        User member = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.MEMBER)
                .status("ACTIVE")
                .mess(mess)
                .build();

        User savedMember = userRepository.save(member);
        return mapToResponse(savedMember);
    }

    public List<MemberResponse> getMembersByMessId(Long messId) {
        return userRepository.findByMessId(messId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MemberResponse getMemberById(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        return mapToResponse(member);
    }

    public MemberResponse deactivateMember(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        member.setStatus("INACTIVE");
        User updatedMember = userRepository.save(member);
        return mapToResponse(updatedMember);
    }

    public MemberResponse activateMember(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        member.setStatus("ACTIVE");
        User updatedMember = userRepository.save(member);
        return mapToResponse(updatedMember);
    }

    private MemberResponse mapToResponse(User user) {
        return MemberResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus())
                .joinDate(user.getJoinDate())
                .messId(user.getMess() != null ? user.getMess().getId() : null)
                .messName(user.getMess() != null ? user.getMess().getMessName() : null)
                .build();
    }
}