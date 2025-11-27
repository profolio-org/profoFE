// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, authLoading, children }) => {
    if (authLoading) return null; // 체크 전이면 아무 것도 하지 않음
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };
  
export default PrivateRoute;
