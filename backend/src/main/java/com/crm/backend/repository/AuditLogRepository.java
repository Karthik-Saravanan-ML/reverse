package com.crm.backend.repository;

import com.crm.backend.model.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, String> {
    List<AuditLogEntry> findAllByOrderByTimestampDesc();
}
