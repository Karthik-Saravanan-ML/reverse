import type { User, Role } from '../types/auth';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Shared mock state for development
let mockUsers: User[] = [
  { id: '1', email: 'admin@ainativecrm.com', fullName: 'Admin User', role: 'ADMIN', department: 'IT', status: 'ACTIVE', lastLogin: new Date().toISOString() },
  { id: '2', email: 'employee@ainativecrm.com', fullName: 'Jane Employee', role: 'COMPANY_EMPLOYEE', department: 'Sales', status: 'ACTIVE', lastLogin: new Date().toISOString() },
  { id: '3', email: 'client@external.com', fullName: 'John Client', role: 'CLIENT', status: 'ACTIVE', lastLogin: new Date().toISOString() },
  { id: '4', email: 'inactive@ainativecrm.com', fullName: 'Old Employee', role: 'COMPANY_EMPLOYEE', department: 'Marketing', status: 'INACTIVE', lastLogin: '2025-10-01T10:00:00Z' },
  { id: '5', email: 'pending@external.com', fullName: 'New Client', role: 'CLIENT', status: 'PENDING' },
];

export const userService = {
  async getUsers(): Promise<User[]> {
    await delay(800);
    return [...mockUsers];
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    await delay(1000);
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateUserRole(userId: string, newRole: Role): Promise<void> {
    await delay(600);
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.role = newRole;
  },

  async updateUserStatus(userId: string, newStatus: User['status']): Promise<void> {
    await delay(600);
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.status = newStatus;
  },

  async deleteUser(userId: string): Promise<void> {
    await delay(800);
    mockUsers = mockUsers.filter(u => u.id !== userId);
  },

  async updateProfile(userId: string, data: { fullName: string; phone?: string; department?: string }): Promise<User> {
    await delay(800);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
    };
    return { ...mockUsers[userIndex] };
  },

  async updatePassword(_userId: string, _current: string, _newPass: string): Promise<void> {
    await delay(1000);
    // Mock success
  }
};
