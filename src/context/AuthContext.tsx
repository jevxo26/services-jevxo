"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getAccessToken, setTokens, clearTokens } from "@/lib/token";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  [key: string]: any; // allows extra fields from different backend schemas
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to load the user profile
  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      const response = await api.get("/auth/me"); // or /users/profile, /auth/profile depending on backend
      const userData = response.data.user || response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setUser(null);
      return null;
    }
  };

  // On mount, load profile if access token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        await fetchUserProfile();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any): Promise<User> => {
    setIsLoading(true);
    try {
      // credentials can be { email, password } or other fields
      const response = await api.post("/auth/login", credentials);
      const data = response.data;

      const accessToken = data.accessToken || data.access_token || data.token;
      const refreshToken = data.refreshToken || data.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid login response: missing access or refresh token");
      }

      // Save tokens
      setTokens(accessToken, refreshToken);

      // Fetch user profile
      const profile = await fetchUserProfile();
      if (!profile) {
        throw new Error("Could not retrieve user profile after login");
      }

      // Save role in RoleContext if applicable
      if (profile.role) {
        localStorage.setItem("rajseba_user_role", profile.role);
      }

      return profile;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", userData);
      const data = response.data;

      const accessToken = data.accessToken || data.access_token || data.token;
      const refreshToken = data.refreshToken || data.refresh_token;

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        const profile = await fetchUserProfile();
        if (profile) {
          if (profile.role) {
            localStorage.setItem("rajseba_user_role", profile.role);
          }
          return profile;
        }
      }

      // If registration doesn't auto-log in, return user from response if available
      const registeredUser = data.user || data;
      return registeredUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    localStorage.removeItem("rajseba_user_role");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    return fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
