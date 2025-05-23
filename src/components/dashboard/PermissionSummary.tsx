import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/auth/AuthContext';
import { 
  Shield, 
  Lock, 
  User, 
  Crown, 
  UserCog, 
  BarChart3, 
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

// =============================================================================
// PERMISSION SUMMARY COMPONENT
// =============================================================================

const PermissionSummary: React.FC = () => {
  const { user } = useAuth();
  const { 
    roles, 
    permissions, 
    highestRoleLevel, 
    loading,
    permissionSummary 
  } = usePermissions();
  
  const [showAllPermissions, setShowAllPermissions] = React.useState(false);
  const [showAllRoles, setShowAllRoles] = React.useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const getRoleIcon = (level: number) => {
    if (level >= 100) return Crown;
    if (level >= 80) return Shield;
    if (level >= 60) return UserCog;
    if (level >= 40) return BarChart3;
    return Eye;
  };

  const getRoleColor = (level: number) => {
    if (level >= 100) return 'text-red-600';
    if (level >= 80) return 'text-purple-600';
    if (level >= 60) return 'text-green-600';
    if (level >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getRoleName = (level: number) => {
    if (level >= 100) return 'Super Administrator';
    if (level >= 80) return 'Admin Manager';
    if (level >= 60) return 'Lead Manager';
    if (level >= 40) return 'Analyst';
    if (level >= 20) return 'Viewer';
    return 'No Role Assigned';
  };

  const MainRoleIcon = getRoleIcon(highestRoleLevel);

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <MainRoleIcon className={cn("w-5 h-5", getRoleColor(highestRoleLevel))} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Permission Summary</h2>
          <p className="text-sm text-gray-500">Your access level and permissions</p>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <div className="text-right">
            <div className={cn("font-medium", getRoleColor(highestRoleLevel))}>
              {getRoleName(highestRoleLevel)}
            </div>
            <div className="text-sm text-gray-500">Level {highestRoleLevel}</div>
          </div>
        </div>
      </div>

      {/* Active Roles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">
            Active Roles ({roles.length})
          </h3>
          {roles.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllRoles(!showAllRoles)}
            >
              {showAllRoles ? <ChevronUp /> : <ChevronDown />}
              <span className="ml-1">{showAllRoles ? 'Show Less' : 'Show All'}</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {(showAllRoles ? roles : roles.slice(0, 3)).map((userRole) => (
            <div
              key={userRole.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: userRole.role.color + '20' }}
                >
                  {React.createElement(getRoleIcon(userRole.role.level), {
                    className: "w-4 h-4",
                    style: { color: userRole.role.color }
                  })}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {userRole.role.display_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Level {userRole.role.level} • Assigned {new Date(userRole.assigned_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {userRole.role.is_system_role && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Lock className="w-3 h-3 mr-1" />
                  System
                </span>
              )}
            </div>
          ))}
          
          {!showAllRoles && roles.length > 3 && (
            <div className="text-center text-sm text-gray-500 py-2">
              +{roles.length - 3} more roles
            </div>
          )}
        </div>
      </div>

      {/* Permissions Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">
            Permissions ({permissions.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllPermissions(!showAllPermissions)}
          >
            {showAllPermissions ? <ChevronUp /> : <ChevronDown />}
            <span className="ml-1">{showAllPermissions ? 'Hide Details' : 'Show Details'}</span>
          </Button>
        </div>

        {!showAllPermissions ? (
          // Summary view
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {categoryPermissions.length} permissions
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Detailed view
          <div className="space-y-4">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 capitalize">
                  {category.replace('_', ' ')} ({categoryPermissions.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 p-2 bg-gray-50 border border-gray-100 rounded"
                    >
                      <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {permission.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <p className="mb-1">
              <strong>Access Level:</strong> Your highest role level ({highestRoleLevel}) determines your overall system access.
            </p>
            <p>
              <strong>Permissions:</strong> Specific actions you can perform are determined by all your active roles combined.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionSummary; 