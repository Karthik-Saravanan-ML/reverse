import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { userService } from '../../services/user.service';
import type { User, Role } from '../../types/auth';
import {
  Card, CardContent,
  Button, Input, Badge,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  ConfirmationDialog
} from '../../components/common';
import { AdminLayout } from '../../components/layout/AdminLayout';

type ActionType = 'deactivate' | 'reactivate' | 'delete' | null;

interface PendingAction {
  type: ActionType;
  userId: string;
  userName: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openConfirm = (type: NonNullable<ActionType>, userId: string, userName: string) => {
    setPendingAction({ type, userId, userName });
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setIsActioning(true);
    try {
      if (pendingAction.type === 'deactivate') {
        await userService.updateUserStatus(pendingAction.userId, 'INACTIVE');
      } else if (pendingAction.type === 'reactivate') {
        await userService.updateUserStatus(pendingAction.userId, 'ACTIVE');
      } else if (pendingAction.type === 'delete') {
        await userService.deleteUser(pendingAction.userId);
      }
      await fetchUsers();
    } finally {
      setIsActioning(false);
      setPendingAction(null);
    }
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const employees = users.filter(u => u.role === 'COMPANY_EMPLOYEE').length;
  const clients = users.filter(u => u.role === 'CLIENT').length;
  const pendingUsers = users.filter(u => u.status === 'PENDING').length;

  // Filtering
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN': return <Badge variant="danger">Admin</Badge>;
      case 'COMPANY_EMPLOYEE': return <Badge variant="primary">Employee</Badge>;
      case 'CLIENT': return <Badge variant="outline">Client</Badge>;
      default: return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Active</Badge>;
      case 'INACTIVE': return <Badge>Inactive</Badge>;
      case 'PENDING': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const statCards = [
    { label: 'Total Users', value: totalUsers, color: 'text-gray-900' },
    { label: 'Active Users', value: activeUsers, color: 'text-status-success' },
    { label: 'Employees', value: employees, color: 'text-primary-600' },
    { label: 'Clients', value: clients, color: 'text-gray-700' },
    { label: 'Pending', value: pendingUsers, color: 'text-status-warning' },
  ];

  // Dialog config per action
  const dialogConfig = pendingAction
    ? {
        deactivate: {
          title: 'Deactivate User',
          description: `Are you sure you want to deactivate ${pendingAction.userName}? They will lose access immediately.`,
          confirmLabel: 'Deactivate',
          isDestructive: false,
        },
        reactivate: {
          title: 'Reactivate User',
          description: `Restore access for ${pendingAction.userName}? They will be able to log in immediately.`,
          confirmLabel: 'Reactivate',
          isDestructive: false,
        },
        delete: {
          title: 'Delete User',
          description: `Permanently delete ${pendingAction.userName}? This action cannot be undone.`,
          confirmLabel: 'Delete User',
          isDestructive: true,
        },
      }[pendingAction.type!]
    : null;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-500 mt-1">Manage users, roles and access across the CRM platform.</p>
          </div>
          <Link to="/admin/users/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New User
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card */}
        <Card className="overflow-hidden">
          {/* Filters */}
          <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or role..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-10 w-full md:w-40 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="COMPANY_EMPLOYEE">Employee</option>
                <option value="CLIENT">Client</option>
              </select>
              <select
                className="h-10 w-full md:w-40 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      No users found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0 overflow-hidden">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.fullName} className="h-full w-full object-cover" />
                            ) : (
                              user.fullName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{user.department || '—'}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          {user.status === 'ACTIVE' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => openConfirm('deactivate', user.id, user.fullName)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => openConfirm('reactivate', user.id, user.fullName)}
                            >
                              Reactivate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-status-danger hover:text-red-700 hover:bg-red-50"
                            onClick={() => openConfirm('delete', user.id, user.fullName)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Row count */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-200 text-xs text-gray-500">
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
          )}
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {pendingAction && dialogConfig && (
        <ConfirmationDialog
          isOpen={!!pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirm}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmLabel={dialogConfig.confirmLabel}
          isDestructive={dialogConfig.isDestructive}
          isLoading={isActioning}
        />
      )}
    </AdminLayout>
  );
}
