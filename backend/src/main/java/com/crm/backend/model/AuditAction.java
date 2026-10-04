package com.crm.backend.model;

public enum AuditAction {
    LOGIN,
    LOGOUT,
    FAILED_LOGIN,
    PASSWORD_CHANGE,
    PASSWORD_RESET,
    USER_CREATED,
    USER_DEACTIVATED,
    ROLE_CHANGED,
    PERMISSION_CHANGED
}
