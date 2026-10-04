package com.crm.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    private String userId;
    private String userEmail;
    
    @Column(length = 1000)
    private String details;
    
    private String ipAddress;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
