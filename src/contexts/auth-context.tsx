
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // For login/logout operations
  initialAuthDone: boolean; // True after initial localStorage check
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialAuthDone, setInitialAuthDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider: useEffect for initial auth check started.");
    try {
      const storedUser = localStorage.getItem('tahqeeqUser');
      console.log("AuthProvider: Stored user from localStorage:", storedUser);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log("AuthProvider: User set from localStorage.");
      } else {
        console.log("AuthProvider: No stored user found.");
      }
    } catch (error) {
      console.error("AuthProvider: Error accessing localStorage or parsing user data:", error);
      // Optionally clear corrupted data
      localStorage.removeItem('tahqeeqUser');
    } finally {
      setInitialAuthDone(true);
      console.log("AuthProvider: initialAuthDone set to true.");
    }
  }, []);

  const login = (email: string, name: string = "Demo User") => {
    setLoading(true);
    console.log("AuthProvider: Login initiated for", email);
    const mockUser: User = { 
      id: '1', 
      email, 
      name, 
      avatarUrl: `https://placehold.co/100x100.png?text=${name ? name.substring(0,1).toUpperCase() : 'U'}` 
    };
    try {
      localStorage.setItem('tahqeeqUser', JSON.stringify(mockUser));
      setUser(mockUser);
      console.log("AuthProvider: User logged in and data saved to localStorage.");
      router.push('/');
    } catch (error) {
      console.error("AuthProvider: Error saving user data to localStorage during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    console.log("AuthProvider: Logout initiated.");
    try {
      localStorage.removeItem('tahqeeqUser');
      setUser(null);
      console.log("AuthProvider: User logged out and data removed from localStorage.");
      // router.push('/auth'); // Let AppLayout handle redirect if necessary
    } catch (error) {
      console.error("AuthProvider: Error removing user data from localStorage during logout:", error);
    } finally {
      setLoading(false);
      router.push('/auth'); // Ensure redirection happens
    }
  };

  if (!initialAuthDone) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="sr-only">Loading authentication status...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, initialAuthDone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
