import type { Role, Permission } from './auth';

export interface AuditLogEntry {
  id: string;
  action: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE' | 'PASSWORD_RESET' | 'USER_CREATED' | 'USER_DEACTIVATED' | 'ROLE_CHANGED' | 'PERMISSION_CHANGED';
  userId: string;
  userEmail: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface RolePermissionMatrix {
  role: Role;
  description: string;
  permissions: Permission[];
}
