
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken =
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

