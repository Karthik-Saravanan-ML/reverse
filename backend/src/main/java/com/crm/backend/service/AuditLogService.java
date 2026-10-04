package com.crm.backend.service;

import com.crm.backend.model.AuditLogEntry;
import com.crm.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repo;

    public List<AuditLogEntry> getLogs() {
        return repo.findAllByOrderByTimestampDesc();
    }
}
