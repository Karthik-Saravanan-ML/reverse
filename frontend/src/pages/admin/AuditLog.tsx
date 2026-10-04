import { useState, useEffect } from 'react';
import { auditService } from '../../services/audit.service';
import type { AuditLogEntry } from '../../types/admin';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/common';
import {
  LogIn, LogOut, XCircle, KeyRound, RotateCcw,
  UserPlus, UserX, ShieldAlert, ShieldCheck, Activity
} from 'lucide-react';

const ACTION_CONFIG: Record<AuditLogEntry['action'], {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  LOGIN: { icon: LogIn, label: 'Login', color: 'text-green-600', bgColor: 'bg-green-100' },
  LOGOUT: { icon: LogOut, label: 'Logout', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  FAILED_LOGIN: { icon: XCircle, label: 'Failed Login', color: 'text-status-danger', bgColor: 'bg-red-100' },
  PASSWORD_CHANGE: { icon: KeyRound, label: 'Password Change', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  PASSWORD_RESET: { icon: RotateCcw, label: 'Password Reset', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  USER_CREATED: { icon: UserPlus, label: 'User Created', color: 'text-primary-600', bgColor: 'bg-primary-100' },
  USER_DEACTIVATED: { icon: UserX, label: 'User Deactivated', color: 'text-status-danger', bgColor: 'bg-red-100' },
  ROLE_CHANGED: { icon: ShieldAlert, label: 'Role Changed', color: 'text-violet-600', bgColor: 'bg-violet-100' },
  PERMISSION_CHANGED: { icon: ShieldCheck, label: 'Permission Changed', color: 'text-violet-600', bgColor: 'bg-violet-100' },
};

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    auditService.getLogs().then(data => {
      setLogs(data);
      setIsLoading(false);
    });
  }, []);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.action === filter);

  const totalLoginAttempts = logs.filter(l => l.action === 'LOGIN' || l.action === 'FAILED_LOGIN').length;
  const failedLogins = logs.filter(l => l.action === 'FAILED_LOGIN').length;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary-600" />
            Audit Log
          </h1>
          <p className="text-gray-500 mt-1">Security events and administrative activity across the CRM platform.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Events</p>
              <p className="text-3xl font-bold mt-1 text-gray-900">{logs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Login Attempts</p>
              <p className="text-3xl font-bold mt-1 text-primary-600">{totalLoginAttempts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Failed Logins</p>
              <p className="text-3xl font-bold mt-1 text-status-danger">{failedLogins}</p>
            </CardContent>
          </Card>
        </div>

        {/* Log Timeline Card */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle>Security Events</CardTitle>
              <select
                className="h-9 w-full sm:w-56 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="ALL">All Events</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="FAILED_LOGIN">Failed Login</option>
                <option value="USER_CREATED">User Created</option>
                <option value="USER_DEACTIVATED">User Deactivated</option>
                <option value="ROLE_CHANGED">Role Changed</option>
                <option value="PERMISSION_CHANGED">Permission Changed</option>
                <option value="PASSWORD_CHANGE">Password Change</option>
                <option value="PASSWORD_RESET">Password Reset</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-72 bg-gray-50 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No events match the selected filter.
              </div>
            ) : (
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[17px] top-5 bottom-5 w-px bg-gray-200" />

                <div className="space-y-5">
                  {filteredLogs.map(log => {
                    const config = ACTION_CONFIG[log.action];
                    const Icon = config.icon;
                    return (
                      <div key={log.id} className="relative flex items-start gap-4 pl-1">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${config.bgColor} flex items-center justify-center z-10`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                className={`text-xs px-2 py-0.5 rounded-full border ${config.bgColor} ${config.color}`}
                              >
                                {config.label}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">{log.userEmail}</span>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{formatTimeAgo(log.timestamp)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                          <p className="text-xs text-gray-400 mt-0.5">IP: {log.ipAddress}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
