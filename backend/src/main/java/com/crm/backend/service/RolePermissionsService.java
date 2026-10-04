package com.crm.backend.service;

import com.crm.backend.model.*;
import com.crm.backend.repository.RolePermissionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolePermissionsService {

    private final RolePermissionsRepository repo;

    public List<RolePermissions> getMatrix() {
        return repo.findAll();
    }

    @Transactional
    public List<RolePermissions> saveMatrix(List<RolePermissions> incoming) {
        // Update each row by module name, preserving admin level
        for (RolePermissions updated : incoming) {
            repo.findByModule(updated.getModule()).ifPresent(existing -> {
                existing.setEmployeeLevel(updated.getEmployeeLevel());
                existing.setClientLevel(updated.getClientLevel());
                repo.save(existing);
            });
        }
        return repo.findAll();
    }
}
