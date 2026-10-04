package com.crm.backend.controller;

import com.crm.backend.dto.*;
import com.crm.backend.model.UserStatus;
import com.crm.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only user management endpoints.
 * All routes are already guarded at SecurityConfig level (/api/admin/** → ROLE_ADMIN).
 * Method-level @PreAuthorize provides an extra explicit declaration.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    /** GET /api/admin/users */
    @GetMapping
    public ResponseEntity<List<UserDTO>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** GET /api/admin/users/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /** POST /api/admin/users */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal UserDetails actor) {
        return ResponseEntity.ok(userService.createUser(request, actor.getUsername()));
    }

    /** PUT /api/admin/users/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable String id,
            @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal UserDetails actor) {
        return ResponseEntity.ok(userService.updateUser(id, request, actor.getUsername()));
    }

    /** PATCH /api/admin/users/{id}/status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails actor) {
        UserStatus newStatus = UserStatus.valueOf(body.get("status"));
        userService.updateUserStatus(id, newStatus, actor.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("User status updated"));
    }

    /** DELETE /api/admin/users/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails actor) {
        userService.deleteUser(id, actor.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("User deleted"));
    }
}
