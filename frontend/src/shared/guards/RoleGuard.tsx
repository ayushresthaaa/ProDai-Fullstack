import React from "react";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const storedRole = localStorage.getItem("usertype");
  const role = storedRole ? JSON.parse(storedRole) : null;

  if (!role) {
    // No role found, redirect to login
    return <Navigate to="/" replace />;
  }

  // Redirect if user role is not allowed
  if (!allowedRoles.includes(role)) {
    if (role === "user") return <Navigate to="/home" replace />;
    if (role === "professional") return <Navigate to="/profile" replace />;
    return <Navigate to="/" replace />; // fallback
  }

  return <>{children}</>;
};
