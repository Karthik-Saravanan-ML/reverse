package com.crm.backend.service;

import com.crm.backend.dto.*;
import com.crm.backend.model.*;
import com.crm.backend.repository.AuditLogRepository;
import com.crm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Current user profile ──────────────────────────────────────────────────

    public UserDTO getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    @Transactional
    public UserDTO updateMe(String email, UpdateProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setDepartment(req.getDepartment());
        userRepository.save(user);

        logAudit(AuditAction.PASSWORD_CHANGE, user, "Profile updated", "system");
        return toDTO(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (req.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        logAudit(AuditAction.PASSWORD_CHANGE, user, "Password changed", "system");
    }

    // ── Admin: User CRUD ──────────────────────────────────────────────────────

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO getUserById(String id) {
        return toDTO(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id)));
    }

    @Transactional
    public UserDTO createUser(CreateUserRequest req, String actorEmail) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }

        User newUser = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                // Temporary password — user should reset via invitation flow
                .password(passwordEncoder.encode("Temp@1234"))
                .role(req.getRole())
                .department(req.getDepartment())
                .status(req.getStatus() != null ? req.getStatus() : UserStatus.PENDING)
                .build();

        User saved = userRepository.save(newUser);

        userRepository.findByEmail(actorEmail).ifPresent(actor ->
            logAudit(AuditAction.USER_CREATED, saved, "User created by " + actorEmail, "system")
        );

        return toDTO(saved);
    }

    @Transactional
    public UserDTO updateUser(String id, CreateUserRequest req, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        Role oldRole = user.getRole();
        user.setFullName(req.getFullName());
        user.setDepartment(req.getDepartment());
        if (req.getRole() != null) user.setRole(req.getRole());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        userRepository.save(user);

        if (req.getRole() != null && req.getRole() != oldRole) {
            logAudit(AuditAction.ROLE_CHANGED, user,
                    "Role changed from " + oldRole + " to " + req.getRole() + " by " + actorEmail, "system");
        }
        return toDTO(user);
    }

    @Transactional
    public void updateUserStatus(String id, UserStatus newStatus, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setStatus(newStatus);
        userRepository.save(user);

        AuditAction action = newStatus == UserStatus.INACTIVE
                ? AuditAction.USER_DEACTIVATED : AuditAction.USER_CREATED;
        logAudit(action, user, "Status changed to " + newStatus + " by " + actorEmail, "system");
    }

    @Transactional
    public void deleteUser(String id, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        logAudit(AuditAction.USER_DEACTIVATED, user, "User deleted by " + actorEmail, "system");
        userRepository.delete(user);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .role(user.getRole())
                .status(user.getStatus())
                .lastLogin(user.getLastLogin())
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
