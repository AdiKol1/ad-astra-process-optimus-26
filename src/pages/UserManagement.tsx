/**
 * User Management Page
 * 
 * Allows super admins to manage admin users
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  userManagementService, 
  AdminUserListItem, 
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  UserManagementStats
} from '@/services/auth/userManagementService';
import { useAuth } from '@/contexts/auth/AuthContext';
import { logger } from '@/utils/logger';
import { formatDistanceToNow } from 'date-fns';

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [stats, setStats] = useState<UserManagementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create user form state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState<CreateAdminUserRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isSuperAdmin: false
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit user form state
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateAdminUserRequest>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    isSuperAdmin: false,
    isActive: true
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Reset password state
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUserListItem | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersResponse, statsResponse] = await Promise.all([
        userManagementService.getAdminUsers(),
        userManagementService.getUserManagementStats()
      ]);

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data);
      } else {
        setError(usersResponse.message);
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

    } catch (error) {
      logger.error('Error loading user management data', { error });
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setCreateLoading(true);
      setError('');

      const response = await userManagementService.createAdminUser(createForm);
      
      if (response.success && response.data) {
        setUsers(prev => [response.data!, ...prev]);
        setShowCreateDialog(false);
        setCreateForm({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          isSuperAdmin: false
        });
        setSuccess('Admin user created successfully');
        
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            totalUsers: stats.totalUsers + 1,
            activeUsers: stats.activeUsers + 1,
            superAdmins: response.data.isSuperAdmin ? stats.superAdmins + 1 : stats.superAdmins
          });
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      logger.error('Error creating user', { error });
      setError('Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditUser = (user: AdminUserListItem) => {
    setEditingUser(user);
    setUpdateForm({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSuperAdmin: user.isSuperAdmin,
      isActive: user.isActive
    });
  };

  const handleUpdateUser = async () => {
    try {
      setUpdateLoading(true);
      setError('');

      const response = await userManagementService.updateAdminUser(updateForm);
      
      if (response.success && response.data) {
        setUsers(prev => prev.map(u => u.id === response.data!.id ? response.data! : u));
        setEditingUser(null);
        setSuccess('Admin user updated successfully');
        
        // Update stats if super admin status changed
        if (stats && editingUser) {
          const wasSuper = editingUser.isSuperAdmin;
          const isSuper = response.data.isSuperAdmin;
          const wasActive = editingUser.isActive;
          const isActive = response.data.isActive;
          
          let newSuperAdmins = stats.superAdmins;
          let newActiveUsers = stats.activeUsers;
          
          if (wasSuper !== isSuper && isActive) {
            newSuperAdmins += isSuper ? 1 : -1;
          }
          
          if (wasActive !== isActive) {
            newActiveUsers += isActive ? 1 : -1;
            if (isSuper && !isActive) {
              newSuperAdmins -= 1;
            } else if (isSuper && isActive && !wasActive) {
              newSuperAdmins += 1;
            }
          }
          
          setStats({
            ...stats,
            activeUsers: newActiveUsers,
            superAdmins: newSuperAdmins
          });
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      logger.error('Error updating user', { error });
      setError('Failed to update user');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setError('');
      
      // Get user info before deletion for stats update
      const userToDelete = users.find(u => u.id === userId);
      
      const response = await userManagementService.deleteAdminUser(userId);
      
      if (response.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: false } : u
        ));
        setSuccess('Admin user deactivated successfully');
        
        // Update stats
        if (stats && userToDelete) {
          setStats({
            ...stats,
            activeUsers: stats.activeUsers - 1,
            superAdmins: userToDelete.isSuperAdmin ? stats.superAdmins - 1 : stats.superAdmins
          });
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      logger.error('Error deleting user', { error });
      setError('Failed to delete user');
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      setError('');
      
      const response = await userManagementService.resetUserPassword(userId);
      
      if (response.success && response.data) {
        const user = users.find(u => u.id === userId);
        setResetPasswordUser(user || null);
        setTemporaryPassword(response.data.temporaryPassword);
        setSuccess('Password reset successfully');
      } else {
        setError(response.message);
      }
    } catch (error) {
      logger.error('Error resetting password', { error });
      setError('Failed to reset password');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Check if current user has super admin privileges
  if (!user?.isSuperAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access user management. Super Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and permissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={clearMessages}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Admin User</DialogTitle>
                <DialogDescription>
                  Add a new administrator to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={createForm.firstName}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                      disabled={createLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={createForm.lastName}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                      disabled={createLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@company.com"
                    disabled={createLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showCreatePassword ? 'text' : 'password'}
                      value={createForm.password}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Password (min 6 characters)"
                      disabled={createLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={createLoading}
                    >
                      {showCreatePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isSuperAdmin"
                    checked={createForm.isSuperAdmin}
                    onCheckedChange={(checked) => 
                      setCreateForm(prev => ({ ...prev, isSuperAdmin: checked as boolean }))
                    }
                    disabled={createLoading}
                  />
                  <Label htmlFor="isSuperAdmin">Super Administrator</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.superAdmins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentLogins}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Manage administrator accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No admin users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{userItem.fullName}</div>
                          <div className="text-sm text-gray-500">
                            {userItem.loginCount} login{userItem.loginCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{userItem.email}</td>
                      <td className="py-3 px-4">
                        {userItem.isSuperAdmin ? (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Super Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {userItem.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {userItem.lastLoginAt ? (
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(userItem.lastLoginAt), { addSuffix: true })}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Never</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(userItem)}
                            disabled={!userItem.isActive}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(userItem.id)}
                            disabled={!userItem.isActive || userItem.id === user?.id}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          {userItem.id !== user?.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={!userItem.isActive}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to deactivate {userItem.fullName}? 
                                    This will revoke their access to the admin dashboard.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Admin User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={updateForm.firstName}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={updateLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={updateForm.lastName}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={updateLoading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={updateLoading}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsSuperAdmin"
                    checked={updateForm.isSuperAdmin}
                    onCheckedChange={(checked) => 
                      setUpdateForm(prev => ({ ...prev, isSuperAdmin: checked as boolean }))
                    }
                    disabled={updateLoading || editingUser.id === user?.id}
                  />
                  <Label htmlFor="editIsSuperAdmin">Super Administrator</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsActive"
                    checked={updateForm.isActive}
                    onCheckedChange={(checked) => 
                      setUpdateForm(prev => ({ ...prev, isActive: checked as boolean }))
                    }
                    disabled={updateLoading || editingUser.id === user?.id}
                  />
                  <Label htmlFor="editIsActive">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser} disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reset Password Dialog */}
      {resetPasswordUser && temporaryPassword && (
        <Dialog open={!!resetPasswordUser} onOpenChange={() => {
          setResetPasswordUser(null);
          setTemporaryPassword('');
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Password Reset Successful</DialogTitle>
              <DialogDescription>
                A temporary password has been generated for {resetPasswordUser.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  The user's password has been reset and all active sessions have been revoked.
                  They will need to log in with the temporary password below.
                </AlertDescription>
              </Alert>
              <div>
                <Label htmlFor="tempPassword">Temporary Password</Label>
                <div className="relative">
                  <Input
                    id="tempPassword"
                    type={showTempPassword ? 'text' : 'password'}
                    value={temporaryPassword}
                    readOnly
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setShowTempPassword(!showTempPassword)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showTempPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
              <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Make sure to securely share this password with the user. 
                  They should change it immediately after logging in.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                setResetPasswordUser(null);
                setTemporaryPassword('');
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement; 