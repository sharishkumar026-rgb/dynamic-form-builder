
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface StoredUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string | {
    id?: number | string;
    name?: string;
  };
  role_name?: string;
  roleName?: string;
}

const AdminRoute = () => {
  const location = useLocation();

  const accessToken =
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken");

  // User is not logged in
  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  let user: StoredUser | null = null;

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (storedUser) {
    try {
      user = JSON.parse(storedUser) as StoredUser;
    } catch {
      user = null;
    }
  }

  let roleName = "";

  if (typeof user?.role === "string") {
    roleName = user.role;
  } else if (user?.role?.name) {
    roleName = user.role.name;
  } else if (user?.role_name) {
    roleName = user.role_name;
  } else if (user?.roleName) {
    roleName = user.roleName;
  }

  if (roleName.toLowerCase() !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

