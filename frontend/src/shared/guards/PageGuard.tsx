//not allowing to go the login or register for the logged in users
import React from "react";
import { Navigate } from "react-router-dom";

interface PageGuardProps {
  children: React.ReactNode;
}

export const PageGuard: React.FC<PageGuardProps> = ({ children }) => {
  const storedUser = localStorage.getItem("usertype");

  if (storedUser) {
    const userType = JSON.parse(storedUser);

    if (userType === "user") return <Navigate to="/home" replace />;
    if (userType === "professional") return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
