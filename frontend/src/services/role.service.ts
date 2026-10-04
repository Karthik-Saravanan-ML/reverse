const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type ModuleName = 
  | 'Dashboard' 
  | 'User Management' 
  | 'Client Management' 
  | 'Project Management' 
  | 'Communication Management' 
  | 'Document Management' 
  | 'Project Memory' 
  | 'AI Assistant' 
  | 'Search & Knowledge Retrieval' 
  | 'Activity Timeline';

export type PermissionLevel = 'View' | 'Create' | 'Edit' | 'Delete' | 'Manage' | 'None';

export interface RolePermissions {
  module: ModuleName;
  adminLevel: PermissionLevel;
  employeeLevel: PermissionLevel;
  clientLevel: PermissionLevel;
}

const mockMatrix: RolePermissions[] = [
  { module: 'Dashboard', adminLevel: 'Manage', employeeLevel: 'View', clientLevel: 'View' },
  { module: 'User Management', adminLevel: 'Manage', employeeLevel: 'None', clientLevel: 'None' },
  { module: 'Client Management', adminLevel: 'Manage', employeeLevel: 'Edit', clientLevel: 'None' },
  { module: 'Project Management', adminLevel: 'Manage', employeeLevel: 'Edit', clientLevel: 'View' },
  { module: 'Communication Management', adminLevel: 'Manage', employeeLevel: 'Create', clientLevel: 'View' },
  { module: 'Document Management', adminLevel: 'Manage', employeeLevel: 'Create', clientLevel: 'View' },
  { module: 'Project Memory', adminLevel: 'Manage', employeeLevel: 'View', clientLevel: 'None' },
  { module: 'AI Assistant', adminLevel: 'Manage', employeeLevel: 'View', clientLevel: 'View' },
  { module: 'Search & Knowledge Retrieval', adminLevel: 'Manage', employeeLevel: 'View', clientLevel: 'View' },
  { module: 'Activity Timeline', adminLevel: 'Manage', employeeLevel: 'View', clientLevel: 'None' },
];

export const roleService = {
  async getPermissionMatrix(): Promise<RolePermissions[]> {
    await delay(500);
    return [...mockMatrix];
  },

  /**
   * MOCK SAVE: In production → PUT /api/roles/permissions
   * Persists the full updated matrix to the backend.
   */
  async savePermissionMatrix(matrix: RolePermissions[]): Promise<void> {
    await delay(600);
    matrix.forEach(updated => {
      const item = mockMatrix.find(m => m.module === updated.module);
      if (item) {
        item.employeeLevel = updated.employeeLevel;
        item.clientLevel = updated.clientLevel;
      }
    });
  },

  async updatePermission(module: ModuleName, role: 'adminLevel' | 'employeeLevel' | 'clientLevel', newLevel: PermissionLevel): Promise<void> {
    await delay(300);
    const item = mockMatrix.find(m => m.module === module);
    if (item) {
      item[role] = newLevel;
    }
  }
};
