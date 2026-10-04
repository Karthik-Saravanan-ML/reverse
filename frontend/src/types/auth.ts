export type Role = 'ADMIN' | 'COMPANY_EMPLOYEE' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  department?: string;
  profileImage?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}


export type Permission = 
  | 'VIEW_DASHBOARD'
  | 'MANAGE_USERS'
  | 'VIEW_CLIENTS'
  | 'MANAGE_CLIENTS'
  | 'VIEW_PROJECTS'
  | 'MANAGE_PROJECTS'
  | 'MANAGE_ROLES';

// Update User type to include permissions if provided by backend, or we can handle it via role maps.
// For now, we will add permissions to the User interface
export interface UserWithPermissions extends User {
  permissions?: Permission[];
}
