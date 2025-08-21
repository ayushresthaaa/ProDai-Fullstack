// guards/AuthGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token is stored, the user is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
