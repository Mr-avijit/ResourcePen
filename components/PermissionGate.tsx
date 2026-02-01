
import React from 'react';
import { Permission } from '../types';
import { useAuth } from '../store';
import { hasPermission } from '../permissions';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ permission, children, fallback = null }) => {
  const { user } = useAuth();
  
  if (hasPermission(user?.role, permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGate;
