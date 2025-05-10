import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../UserContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>; // Show loading while checking auth

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
