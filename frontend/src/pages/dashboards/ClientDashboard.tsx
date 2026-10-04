import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/common';
import { Users, LogOut, User } from 'lucide-react';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-surface-light p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Client Portal</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.fullName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={logout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 rounded-md">
                  <Users className="text-primary-700 w-5 h-5" />
                </div>
                <CardTitle>Client Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">You have restricted client access as <Badge variant="primary">{user?.role}</Badge></p>
              <Button className="w-full">View My Information</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
