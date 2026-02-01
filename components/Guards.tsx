
import React from 'react';
import { useAuth } from '../store';
import { hasPermission } from '../permissions';
import { Permission, AppRole } from '../types';

interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Only renders for ADMIN role
 */
export const AdminOnly: React.FC<GuardProps> = ({ children, fallback = null }) => {
  const { role } = useAuth();
  return role === 'admin' ? <>{children}</> : <>{fallback}</>;
};

/**
 * Only renders for USER role
 */
export const UserOnly: React.FC<GuardProps> = ({ children, fallback = null }) => {
  const { role } = useAuth();
  return role === 'user' ? <>{children}</> : <>{fallback}</>;
};

/**
 * Renders for anyone logged in
 */
export const AuthOnly: React.FC<GuardProps> = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

/**
 * Renders for guests only (e.g., Login button)
 */
export const GuestOnly: React.FC<GuardProps> = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

/**
 * Granular capability gate
 */
export const PermissionGate: React.FC<GuardProps & { permission: Permission }> = ({ 
  children, 
  permission, 
  fallback = null 
}) => {
  const { role } = useAuth();
  return hasPermission(role, permission) ? <>{children}</> : <>{fallback}</>;
};
