package com.crm.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String department;
}
