
import { useEffect, useState } from "react";
import authStore, {
  type AuthUser,
} from "../store/authStore";

interface AuthHook {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: string;

  login: (
    accessToken: string,
    refreshToken?: string | null,
    user?: AuthUser | null,
    rememberMe?: boolean
  ) => void;

  logout: () => void;

  setUser: (user: AuthUser | null) => void;

  hasRole: (role: string) => boolean;
}

const useAuth = (): AuthHook => {
  const [state, setState] = useState(
    authStore.getState()
  );

  useEffect(() => {
    return authStore.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string | null = null,
    user: AuthUser | null = null,
    rememberMe = true
  ) => {
    authStore.saveAuthData(
      accessToken,
      refreshToken,
      user,
      rememberMe
    );
  };

  const logout = () => {
    authStore.logout();
  };

  const setUser = (user: AuthUser | null) => {
    authStore.setUser(user);
  };

  const hasRole = (role: string): boolean => {
    const requiredRole = role.trim().toLowerCase();

    if (!requiredRole) {
      return false;
    }

    return (
      authStore.getUserRole() === requiredRole
    );
  };

  return {
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isAdmin: authStore.isAdmin(),
    role: authStore.getUserRole(),

    login,
    logout,
    setUser,
    hasRole,
  };
};

export default useAuth;

