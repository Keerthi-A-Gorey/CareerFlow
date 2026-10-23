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
  user: UserProfile | null;
};

interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    api.get<UserProfile>("/auth/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ accessToken: string; user: UserProfile }>("/auth/login", { email, password });

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post<{ accessToken: string; user: UserProfile }>("/auth/register", { name, email, password });

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ login, register, logout, isAuthenticated, user }}
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
