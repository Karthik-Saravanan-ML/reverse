import type { AuditLogEntry } from '../types/admin';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockAuditLogs: AuditLogEntry[] = [
  { id: '1', action: 'USER_CREATED', userId: '1', userEmail: 'admin@ainativecrm.com', details: 'Created user Jane Employee', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), ipAddress: '192.168.1.1' },
  { id: '2', action: 'ROLE_CHANGED', userId: '1', userEmail: 'admin@ainativecrm.com', details: 'Changed role for Jane Employee to COMPANY_EMPLOYEE', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), ipAddress: '192.168.1.1' },
  { id: '3', action: 'LOGIN', userId: '2', userEmail: 'employee@ainativecrm.com', details: 'Successful login', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), ipAddress: '192.168.1.5' },
  { id: '4', action: 'FAILED_LOGIN', userId: 'unknown', userEmail: 'hacker@bad.com', details: 'Failed login attempt: Invalid credentials', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), ipAddress: '10.0.0.99' },
  { id: '5', action: 'PERMISSION_CHANGED', userId: '1', userEmail: 'admin@ainativecrm.com', details: 'Updated Project Management permission for Company Employee', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ipAddress: '192.168.1.1' },
];

export const auditService = {
  async getLogs(): Promise<AuditLogEntry[]> {
    await delay(600);
    return [...mockAuditLogs];
  }
};
