import { createContext, useContext, useState } from "react";
import api from "../lib/api";
import { setAccessToken } from "../lib/tokenStore";
import { getAccessToken } from "../lib/tokenStore";
import { useEffect } from "react";

type AuthContextType = {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());

  useEffect(() => {
  const token = getAccessToken();
  if (token) setIsAuthenticated(true);
}, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      setAccessToken(res.data.accessToken);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });

      setAccessToken(res.data.accessToken);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
