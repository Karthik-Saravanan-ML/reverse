package com.crm.backend.repository;

import com.crm.backend.model.RolePermissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolePermissionsRepository extends JpaRepository<RolePermissions, Long> {
    Optional<RolePermissions> findByModule(String module);
}
