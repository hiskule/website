/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Role = 'admin' | 'judge' | 'team' | null;

export interface User {
  id?: number;
  username?: string;
  name?: string;
  room?: string;
  team_number?: number;
  competitionId?: number;
  presentation_link?: string;
  team_comments?: string;
}

interface AuthContextType {
  role: Role;
  user: User | null;
  token: string | null;
  login: (role: Role, user: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hiskule_user');
    const storedRole = localStorage.getItem('hiskule_role') as Role;
    const storedToken = localStorage.getItem('hiskule_token');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      if (storedToken) setToken(storedToken);
    }
  }, []);

  const login = (newRole: Role, newUser: User, newToken?: string) => {
    setRole(newRole);
    setUser(newUser);
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('hiskule_token', newToken);
    }
    if (newRole) localStorage.setItem('hiskule_role', newRole);
    localStorage.setItem('hiskule_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem('hiskule_role');
    localStorage.removeItem('hiskule_user');
    localStorage.removeItem('hiskule_token');
  };

  return (
    <AuthContext.Provider value={{ role, user, token, login, logout }}>
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
