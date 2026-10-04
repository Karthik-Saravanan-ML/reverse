package com.crm.backend.controller;

import com.crm.backend.model.RolePermissions;
import com.crm.backend.service.RolePermissionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only role/permission matrix endpoints.
 * GET /api/admin/roles          — retrieve full matrix
 * PUT /api/admin/roles          — bulk-save updated matrix
 */
@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RolePermissionsController {

    private final RolePermissionsService service;

    @GetMapping
    public ResponseEntity<List<RolePermissions>> getMatrix() {
        return ResponseEntity.ok(service.getMatrix());
    }

    @PutMapping
    public ResponseEntity<List<RolePermissions>> saveMatrix(
            @RequestBody List<RolePermissions> matrix) {
        return ResponseEntity.ok(service.saveMatrix(matrix));
    }
}
