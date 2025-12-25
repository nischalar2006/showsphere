'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>; // Kept 'logout' name for compatibility, mapped to signOut
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authApi.signIn({ email, password });
      setUser(result.user);
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    try {
      await authApi.signUp({
        email,
        password,
        full_name: fullName,
        phone_number: phoneNumber
      });
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Ensure local state is cleared even if API fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
