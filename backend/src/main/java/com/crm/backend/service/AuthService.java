package com.crm.backend.service;

import com.crm.backend.dto.AuthResponse;
import com.crm.backend.dto.LoginRequest;
import com.crm.backend.dto.UserDTO;
import com.crm.backend.model.AuditAction;
import com.crm.backend.model.AuditLogEntry;
import com.crm.backend.model.User;
import com.crm.backend.model.UserStatus;
import com.crm.backend.repository.AuditLogRepository;
import com.crm.backend.repository.UserRepository;
import com.crm.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            // Log failed login
            userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                logAudit(AuditAction.FAILED_LOGIN, user, "Failed login attempt", ipAddress);
            });
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User account is not active");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        logAudit(AuditAction.LOGIN, user, "Successful login", ipAddress);

        String jwtToken = jwtTokenProvider.generateToken(user);

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .role(user.getRole())
                .status(user.getStatus())
                .lastLogin(user.getLastLogin())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDTO)
                .build();
    }

    private void logAudit(AuditAction action, User user, String details, String ipAddress) {
        AuditLogEntry entry = AuditLogEntry.builder()
                .action(action)
                .userId(user.getId())
                .userEmail(user.getEmail())
                .details(details)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(entry);
    }
}
