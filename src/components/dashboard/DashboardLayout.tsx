/**
 * Dashboard Layout Component
 * 
 * Provides the main layout structure for the dashboard with sidebar navigation
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { usePermissions, useHighestRoleLevel } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Home,
  Download,
  Plus,
  Search,
  LogOut,
  User,
  Shield,
  UserCog,
  Crown,
  Star,
  Eye
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof Home;
  exact?: boolean;
  permission?: string;
  minimumRoleLevel?: number;
}

const baseNavigation: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
    exact: true,
    permission: 'dashboard_view',
  },
  {
    name: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
    permission: 'leads_view',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    permission: 'analytics_view',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    permission: 'settings_view',
  },
];

const adminNavigation: NavigationItem[] = [
  {
    name: 'User Management',
    href: '/dashboard/users',
    icon: UserCog,
    exact: false,
    permission: 'users_view',
  },
  {
    name: 'Role Management',
    href: '/dashboard/roles',
    icon: Shield,
    exact: false,
    permission: 'permissions_manage',
  },
];

const NavigationLink: React.FC<{ item: NavigationItem; isMobile?: boolean; onMobileClose?: () => void }> = ({ 
  item, 
  isMobile = false, 
  onMobileClose 
}) => {
  const location = useLocation();
  
  const isActive = () => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const linkClasses = cn(
    "group flex items-center px-2 py-2 font-medium rounded-md",
    isMobile ? "text-base" : "text-sm",
    isActive()
      ? "bg-blue-100 text-blue-900"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  );

  const iconClasses = cn(
    "flex-shrink-0",
    isMobile ? "mr-4 h-6 w-6" : "mr-3 h-5 w-5",
    isActive() ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
  );

  return (
    <PermissionGuard
      permission={item.permission}
      minimumRoleLevel={item.minimumRoleLevel}
    >
      <Link
        to={item.href}
        className={linkClasses}
        onClick={onMobileClose}
      >
        <item.icon className={iconClasses} />
        {item.name}
      </Link>
    </PermissionGuard>
  );
};

const RoleBadge: React.FC<{ level: number; className?: string }> = ({ level, className }) => {
  const getRoleInfo = (level: number) => {
    if (level >= 100) return { name: 'Super Admin', icon: Crown, color: 'text-red-600' };
    if (level >= 80) return { name: 'Admin Manager', icon: Shield, color: 'text-purple-600' };
    if (level >= 60) return { name: 'Lead Manager', icon: UserCog, color: 'text-green-600' };
    if (level >= 40) return { name: 'Analyst', icon: BarChart3, color: 'text-blue-600' };
    if (level >= 20) return { name: 'Viewer', icon: Eye, color: 'text-gray-600' };
    return { name: 'No Role', icon: User, color: 'text-gray-400' };
  };

  const roleInfo = getRoleInfo(level);
  
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <roleInfo.icon className={cn("w-3 h-3", roleInfo.color)} />
      <span className={cn("text-xs font-medium", roleInfo.color)}>
        {roleInfo.name}
      </span>
    </div>
  );
};

const UserInfo: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { user, logout } = useAuth();
  const { roles, highestRoleLevel } = usePermissions();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const getUserIcon = () => {
    if (highestRoleLevel >= 100) return Crown;
    if (highestRoleLevel >= 80) return Shield;
    if (highestRoleLevel >= 60) return UserCog;
    return User;
  };

  const UserIcon = getUserIcon();

  return (
    <div className={cn("px-4 pt-4 border-t border-gray-200", isMobile ? "mt-6" : "py-4")}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-blue-600" />
        </div>
        <div className={cn("min-w-0", isMobile ? "" : "flex-1")}>
          <div className={cn("font-medium text-gray-900", isMobile ? "text-sm" : "text-sm truncate")}>
            {user?.firstName} {user?.lastName}
          </div>
          <div className={cn("text-gray-500", isMobile ? "text-xs" : "text-xs truncate")}>
            {user?.email}
          </div>
          <RoleBadge level={highestRoleLevel} className="mt-1" />
        </div>
      </div>
      
      {/* Show active roles if user has multiple */}
      {roles.length > 1 && (
        <div className="mb-3 space-y-1">
          <div className="text-xs text-gray-500">Active Roles:</div>
          <div className="flex flex-wrap gap-1">
            {roles.slice(0, 3).map((role) => (
              <span 
                key={role.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: role.role.color + '20', color: role.role.color }}
              >
                {role.role.display_name}
              </span>
            ))}
            {roles.length > 3 && (
              <span className="text-xs text-gray-500">+{roles.length - 3} more</span>
            )}
          </div>
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Combine all navigation items
  const allNavigationItems = [...baseNavigation, ...adminNavigation];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 flex z-40 md:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">Ad Astra Dashboard</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {allNavigationItems.map((item) => (
                <NavigationLink
                  key={item.name}
                  item={item}
                  isMobile={true}
                  onMobileClose={() => setSidebarOpen(false)}
                />
              ))}
            </nav>
            
            {/* Mobile User Info */}
            <UserInfo isMobile={true} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-blue-600">Ad Astra Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {allNavigationItems.map((item) => (
                <NavigationLink
                  key={item.name}
                  item={item}
                  isMobile={false}
                />
              ))}
            </nav>
          </div>
          
          {/* Desktop User Info */}
          <UserInfo isMobile={false} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 