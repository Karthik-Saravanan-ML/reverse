package com.crm.backend.controller;

import com.crm.backend.model.AuditLogEntry;
import com.crm.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * GET /api/admin/audit — returns all audit entries, newest first.
 * Admin-only: guarded at SecurityConfig + method level.
 */
@RestController
@RequestMapping("/api/admin/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService service;

    @GetMapping
    public ResponseEntity<List<AuditLogEntry>> getLogs() {
        return ResponseEntity.ok(service.getLogs());
    }
}
