import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AdminProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">로딩 중...</div>;
  return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
