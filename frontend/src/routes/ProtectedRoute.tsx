
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const accessToken =
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

