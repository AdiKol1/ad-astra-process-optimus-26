import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import { Button } from '../components/ui/button';
import { RoleManagementAccess } from '../components/auth/PermissionGuard';
import {
  getAllRoles,
  getAllPermissions,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  getPermissionsByCategory,
  type Role,
  type Permission,
  type RoleWithPermissions
} from '../services/auth/permissionsService';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Lock,
  Unlock,
  Crown,
  UserCog,
  BarChart3,
  Eye,
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

// =============================================================================
// INTERFACES
// =============================================================================

interface RoleFormData {
  name: string;
  display_name: string;
  description: string;
  level: number;
  color: string;
  permissionIds: string[];
}

// =============================================================================
// ROLE CARD COMPONENT
// =============================================================================

const RoleCard: React.FC<{
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onViewPermissions: (role: Role) => void;
}> = ({ role, onEdit, onDelete, onViewPermissions }) => {
  const getRoleIcon = (level: number) => {
    if (level >= 100) return Crown;
    if (level >= 80) return Shield;
    if (level >= 60) return UserCog;
    if (level >= 40) return BarChart3;
    return Eye;
  };

  const Icon = getRoleIcon(role.level);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: role.color + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color: role.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{role.display_name}</h3>
            <p className="text-sm text-gray-500">Level {role.level}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {role.is_system_role && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Lock className="w-3 h-3 mr-1" />
              System
            </span>
          )}
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPermissions(role)}
              title="View Permissions"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {!role.is_system_role && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(role)}
                  title="Edit Role"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(role)}
                  title="Delete Role"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{role.description}</p>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Created: {new Date(role.created_at).toLocaleDateString()}</span>
        {role.created_by && <span>By: {role.created_by}</span>}
      </div>
    </div>
  );
};

// =============================================================================
// ROLE FORM MODAL
// =============================================================================

const RoleFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[];
  permissionsByCategory: Record<string, Permission[]>;
  onSave: (data: RoleFormData) => Promise<void>;
}> = ({ isOpen, onClose, role, permissions, permissionsByCategory, onSave }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    display_name: '',
    description: '',
    level: 1,
    color: '#6b7280',
    permissionIds: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        display_name: role.display_name,
        description: role.description,
        level: role.level,
        color: role.color,
        permissionIds: []
      });
      // Load role permissions
      loadRolePermissions(role.id);
    } else {
      setFormData({
        name: '',
        display_name: '',
        description: '',
        level: 1,
        color: '#6b7280',
        permissionIds: []
      });
      setSelectedPermissions(new Set());
    }
  }, [role]);

  const loadRolePermissions = async (roleId: string) => {
    try {
      const roleWithPermissions = await getRoleWithPermissions(roleId);
      if (roleWithPermissions) {
        const permissionIds = roleWithPermissions.permissions.map(p => p.id);
        setSelectedPermissions(new Set(permissionIds));
        setFormData(prev => ({ ...prev, permissionIds }));
      }
    } catch (error) {
      console.error('Error loading role permissions:', error);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
    setFormData(prev => ({ ...prev, permissionIds: Array.from(newSelected) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {role ? 'Edit Role' : 'Create New Role'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name (Internal)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="lead_manager"
                  required
                  disabled={role?.is_system_role}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lead Manager"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Level (1-99)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={role?.is_system_role}
                />
                <p className="text-xs text-gray-500 mt-1">Higher numbers = more permissions</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of this role..."
                required
              />
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-4">
                {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">
                      {category.replace('_', ' ')} Permissions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center space-x-2 p-2 rounded border border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.has(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={role?.is_system_role}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {permission.name.replace(/_/g, ' ')}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PERMISSIONS VIEW MODAL
// =============================================================================

const PermissionsViewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  role: RoleWithPermissions | null;
}> = ({ isOpen, onClose, role }) => {
  if (!isOpen || !role) return null;

  const permissionsByCategory = role.permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{role.display_name} Permissions</h2>
            <p className="text-sm text-gray-500">Level {role.level} • {role.permissions.length} permissions</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] p-6">
          <div className="space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 capitalize">
                  {category.replace('_', ' ')} ({categoryPermissions.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {permission.name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {permission.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const RoleManagement: React.FC = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewPermissionsRole, setViewPermissionsRole] = useState<RoleWithPermissions | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData, permissionsByCategoryData] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
        getPermissionsByCategory()
      ]);
      
      setRoles(rolesData);
      setPermissions(permissionsData);
      setPermissionsByCategory(permissionsByCategoryData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load role data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowFormModal(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowFormModal(true);
  };

  const handleViewPermissions = async (role: Role) => {
    try {
      const roleWithPermissions = await getRoleWithPermissions(role.id);
      setViewPermissionsRole(roleWithPermissions);
      setShowPermissionsModal(true);
    } catch (error) {
      console.error('Error loading role permissions:', error);
      setMessage({ type: 'error', text: 'Failed to load role permissions' });
    }
  };

  const handleSaveRole = async (data: RoleFormData) => {
    if (!user?.id) return;

    try {
      if (selectedRole) {
        // Update existing role
        const result = await updateRole(
          selectedRole.id,
          {
            display_name: data.display_name,
            description: data.description,
            level: data.level,
            color: data.color
          },
          data.permissionIds,
          user.id
        );
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Role updated successfully' });
          loadData();
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update role' });
        }
      } else {
        // Create new role
        const result = await createRole(
          {
            name: data.name,
            display_name: data.display_name,
            description: data.description,
            level: data.level,
            color: data.color,
            is_active: true
          },
          data.permissionIds,
          user.id
        );
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Role created successfully' });
          loadData();
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to create role' });
        }
      }
    } catch (error) {
      console.error('Error saving role:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.display_name}"?`)) {
      return;
    }

    try {
      const result = await deleteRole(role.id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Role deleted successfully' });
        loadData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete role' });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading roles...</span>
      </div>
    );
  }

  return (
    <RoleManagementAccess
      fallback={
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">You don't have permission to manage roles.</span>
          </div>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
              <p className="text-gray-600 mt-1">Manage system roles and permissions</p>
            </div>
            <Button
              onClick={handleCreateRole}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={cn(
            "mb-6 p-4 rounded-lg flex items-center",
            message.type === 'success' 
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          )}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Lock className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">System Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.filter(r => r.is_system_role).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Unlock className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Custom Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.filter(r => !r.is_system_role).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
              onViewPermissions={handleViewPermissions}
            />
          ))}
        </div>

        {/* Modals */}
        <RoleFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          role={selectedRole}
          permissions={permissions}
          permissionsByCategory={permissionsByCategory}
          onSave={handleSaveRole}
        />

        <PermissionsViewModal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          role={viewPermissionsRole}
        />
      </div>
    </RoleManagementAccess>
  );
};

export default RoleManagement; 