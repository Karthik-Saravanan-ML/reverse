import { useState, useEffect } from 'react';
import { Shield, Briefcase, Users, Save } from 'lucide-react';
import { roleService, type RolePermissions, type PermissionLevel } from '../../services/role.service';
import {
  Card, CardContent, CardHeader, CardTitle, Badge,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button
} from '../../components/common';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { cn } from '../../utils/cn';

export default function RolesPermissions() {
  const [matrix, setMatrix] = useState<RolePermissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    setIsLoading(true);
    try {
      const data = await roleService.getPermissionMatrix();
      setMatrix(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (
    index: number,
    col: 'employeeLevel' | 'clientLevel',
    newLevel: PermissionLevel
  ) => {
    setMatrix(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [col]: newLevel };
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In production: PUT /api/roles/permissions with matrix payload
      await roleService.savePermissionMatrix(matrix);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getLevelStyle = (level: PermissionLevel) => {
    switch (level) {
      case 'Manage': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'Delete': return 'bg-red-50 text-red-700 border-red-200';
      case 'Edit': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Create': return 'bg-green-50 text-green-700 border-green-200';
      case 'View': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-200 border-dashed';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Roles & Permissions</h1>
            <p className="text-gray-500 mt-1">Control what each role can access across the CRM platform.</p>
          </div>
          {hasChanges && (
            <Button className="gap-2" onClick={handleSave} isLoading={isSaving}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border-t-4 border-t-primary-600">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary-50 p-2 rounded-md">
                    <Shield className="w-4 h-4 text-primary-600" />
                  </div>
                  <CardTitle className="text-base">Admin</CardTitle>
                </div>
                <Badge variant="primary">Full Access</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Full system administration. Can configure platform settings, manage all users, and override module restrictions.</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-violet-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-violet-50 p-2 rounded-md">
                    <Briefcase className="w-4 h-4 text-violet-600" />
                  </div>
                  <CardTitle className="text-base">Company Employee</CardTitle>
                </div>
                <Badge className="bg-violet-100 text-violet-800">Configurable</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Standard internal access. Works across CRM modules, manages specific projects, and collaborates internally.</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-gray-400">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <CardTitle className="text-base">Client</CardTitle>
                </div>
                <Badge variant="outline">Restricted</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Restricted external access. Can only view specific assigned projects, documents, and communications.</p>
            </CardContent>
          </Card>
        </div>

        {/* Permission Matrix */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Permission Matrix</CardTitle>
            {hasChanges && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                Unsaved changes
              </span>
            )}
          </CardHeader>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[260px] font-semibold text-gray-800">Module / Feature</TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary-600" /> Admin
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-violet-600" /> Company Employee
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-500" /> Client
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(4)].map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : matrix.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-gray-700 text-sm">{row.module}</TableCell>
                        {/* Admin — read-only, always full */}
                        <TableCell>
                          <span className={cn('inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border', getLevelStyle(row.adminLevel))}>
                            {row.adminLevel}
                          </span>
                        </TableCell>
                        {/* Employee — editable */}
                        <TableCell>
                          <select
                            className={cn(
                              'h-7 text-xs font-medium rounded-full border focus:outline-none focus:ring-1 focus:ring-primary-500 px-2.5 pr-6 cursor-pointer appearance-none',
                              getLevelStyle(row.employeeLevel)
                            )}
                            value={row.employeeLevel}
                            onChange={e => handlePermissionChange(i, 'employeeLevel', e.target.value as PermissionLevel)}
                          >
                            {(['None', 'View', 'Create', 'Edit', 'Delete', 'Manage'] as PermissionLevel[]).map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </TableCell>
                        {/* Client — editable */}
                        <TableCell>
                          <select
                            className={cn(
                              'h-7 text-xs font-medium rounded-full border focus:outline-none focus:ring-1 focus:ring-primary-500 px-2.5 pr-6 cursor-pointer appearance-none',
                              getLevelStyle(row.clientLevel)
                            )}
                            value={row.clientLevel}
                            onChange={e => handlePermissionChange(i, 'clientLevel', e.target.value as PermissionLevel)}
                          >
                            {(['None', 'View', 'Create', 'Edit', 'Delete', 'Manage'] as PermissionLevel[]).map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-200 text-xs text-gray-500">
            Admin permissions are fixed. Employee and Client permissions are configurable. Changes take effect immediately after saving.
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
