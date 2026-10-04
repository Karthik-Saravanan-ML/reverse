package com.crm.backend.controller;

import com.crm.backend.dto.AuthResponse;
import com.crm.backend.dto.LoginRequest;
import com.crm.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        return ResponseEntity.ok(authService.login(request, ipAddress));
    }

    // Reset password endpoints can be added here
}
