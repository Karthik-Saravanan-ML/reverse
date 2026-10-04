package com.crm.backend.dto;

import com.crm.backend.model.Role;
import com.crm.backend.model.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private Role role;
    private UserStatus status;
    private LocalDateTime lastLogin;
}
