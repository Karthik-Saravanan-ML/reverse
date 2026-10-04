package com.crm.backend.controller;

import com.crm.backend.dto.*;
import com.crm.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints for the authenticated user's own profile and password.
 * Maps to frontend: GET/PUT /api/users/me, PUT /api/users/me/password
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/me — returns the logged-in user's profile */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getMe(userDetails.getUsername()));
    }

    /** PUT /api/users/me — update name, phone, department */
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMe(userDetails.getUsername(), request));
    }

    /** PUT /api/users/me/password — change own password */
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully"));
    }
}
