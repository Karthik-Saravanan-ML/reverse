import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '../../components/common';
import { ArrowLeft, User, Shield, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { PasswordInput } from '../../components/auth/PasswordInput';

export default function Profile() {
  const { user } = useAuth(); // login function from AuthContext can be used to update user state if needed, but we don't have a updateUser in AuthContext.
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: '',
    department: user?.department || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: '', // Mocking phone since it's not on the base User model currently
        department: user.department || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setProfileSuccess('');
    setProfileError('');
    setIsSavingProfile(true);
    
    try {
      if (!profileData.fullName.trim()) {
        throw new Error('Full Name is required');
      }
      
      await userService.updateProfile(user.id, profileData);
      setProfileSuccess('Profile updated successfully.');
      
      // In a real app, you would dispatch an update to AuthContext here so the UI reflects the change.
      // For now, we'll just show the success message.
    } catch (error: any) {
      setProfileError(error.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setPasswordSuccess('');
    setPasswordError('');
    setIsSavingPassword(true);

    try {
      if (!passwordData.currentPassword) throw new Error('Current password is required.');
      if (passwordData.newPassword.length < 8) throw new Error('New password must be at least 8 characters.');
      if (passwordData.newPassword !== passwordData.confirmPassword) throw new Error('New passwords do not match.');
      
      await userService.updatePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-light p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="px-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="text-gray-500 mt-1">Manage your profile and security preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="space-y-1 md:col-span-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-6">
            
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Read-only info banner */}
                  <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl flex-shrink-0">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{user.fullName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{user.email}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <Badge variant="primary" className="text-xs">{user.role}</Badge>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {profileSuccess && (
                      <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-2 border border-green-200">
                        <CheckCircle2 className="w-4 h-4" />
                        {profileSuccess}
                      </div>
                    )}
                    {profileError && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2 border border-red-200">
                        <AlertCircle className="w-4 h-4" />
                        {profileError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Full Name"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        required
                      />
                      <Input
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                      <Input
                        label="Department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProfileData({ fullName: user.fullName, phone: '', department: user.department || '' })}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={isSavingProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    {passwordSuccess && (
                      <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-2 border border-green-200">
                        <CheckCircle2 className="w-4 h-4" />
                        {passwordSuccess}
                      </div>
                    )}
                    {passwordError && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2 border border-red-200">
                        <AlertCircle className="w-4 h-4" />
                        {passwordError}
                      </div>
                    )}

                    <PasswordInput
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                    
                    <div className="pt-2">
                      <PasswordInput
                        label="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5">Password must be at least 8 characters long.</p>
                    </div>

                    <PasswordInput
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <Button type="submit" isLoading={isSavingPassword} className="gap-2">
                        <KeyRound className="w-4 h-4" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
