import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
