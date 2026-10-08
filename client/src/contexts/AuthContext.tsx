import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";
import type { ApiResponse } from "../utils/api";

type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
  register: (name: string, email: string, password: string) => Promise<CurrentUser>;
  logout: () => void;
};

const TOKEN_KEY = "auth-token";

async function authRequest<T>(
  path: string,
  options: { method?: string; body?: Record<string, string>; token?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || result.data === null) {
    throw new Error(result.error?.message ?? "Authentication request failed");
  }

  return result.data;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    void getCurrentUser()
    .then((res) => {
    if (res.data) {
        setCurrentUser(res.data);
    }
    })
    .catch(() => undefined)
    .finally(() => {
    setIsLoading(false);
    });
  }, []);

  function login(token: string, user: CurrentUser) {
    localStorage.setItem(TOKEN_KEY, token);
    setCurrentUser(user);
  }

  async function register(name: string, email: string, password: string) {
    return authRequest<CurrentUser>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}