
import { AppRole, Permission, AppView } from './types';

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  admin: [
    'access_admin_dashboard',
    'manage_users',
    'manage_projects',
    'manage_seo',
    'manage_cms',
    'manage_orders',
    'manage_payments',
    'manage_settings',
    'access_user_dashboard', // Admin can see user side
    'view_profile',
    'view_own_orders',
    'view_own_projects',
    'manage_cart'
  ],
  user: [
    'access_user_dashboard',
    'view_profile',
    'view_own_orders',
    'view_own_projects',
    'manage_cart'
  ]
};

// Renamed isAuthorized to hasPermission to fix import errors in Guards and PermissionGate components
export const hasPermission = (role: AppRole | null, permission: Permission): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const canAccessView = (role: AppRole | null, view: AppView): boolean => {
  // Public Routes
  const publicViews: AppView[] = ['home', 'login', 'signup', 'products', 'product-detail', 'blog-list', 'blog-detail', 'team-detail'];
  if (publicViews.includes(view)) return true;

  if (!role) return false;

  // Admin Routes
  if (view.startsWith('admin-')) {
    return role === 'admin';
  }

  // User Routes
  if (view.startsWith('user-') || view === 'user-dashboard') {
    return role === 'user' || role === 'admin';
  }

  return true;
};
