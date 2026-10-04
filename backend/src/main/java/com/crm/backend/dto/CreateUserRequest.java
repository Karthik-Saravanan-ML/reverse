package com.crm.backend.dto;

import com.crm.backend.model.Role;
import com.crm.backend.model.UserStatus;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String fullName;
    private String email;
    private Role role;
    private String department;
    private UserStatus status;
}
