package com.crm.backend.config;

import com.crm.backend.model.*;
import com.crm.backend.repository.RolePermissionsRepository;
import com.crm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the database on first startup with:
 *   - A default admin user
 *   - The default 10-module permission matrix
 *
 * Rows are only inserted if they don't already exist, so reruns are safe.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RolePermissionsRepository rolePermissionsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedPermissionMatrix();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@ainativecrm.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@ainativecrm.com")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .department("IT")
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@ainativecrm.com / Admin@1234");
        }
    }

    private void seedPermissionMatrix() {
        List<String> modules = List.of(
                "Dashboard",
                "User Management",
                "Client Management",
                "Project Management",
                "Communication Management",
                "Document Management",
                "Project Memory",
                "AI Assistant",
                "Search & Knowledge Retrieval",
                "Activity Timeline"
        );

        for (String module : modules) {
            if (rolePermissionsRepository.findByModule(module).isEmpty()) {
                RolePermissions rp = RolePermissions.builder()
                        .module(module)
                        .adminLevel(PermissionLevel.Manage)
                        .employeeLevel(PermissionLevel.Edit)
                        .clientLevel(PermissionLevel.View)
                        .build();
                rolePermissionsRepository.save(rp);
            }
        }
        log.info("Permission matrix seeded ({} modules)", modules.size());
    }
}
