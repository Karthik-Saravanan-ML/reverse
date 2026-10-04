package com.crm.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolePermissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String module;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionLevel adminLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionLevel employeeLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionLevel clientLevel;
}
