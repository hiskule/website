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
}

interface AuthContextType {
  role: Role;
  user: User | null;
  login: (role: Role, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hiskule_user');
    const storedRole = localStorage.getItem('hiskule_role') as Role;
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const login = (newRole: Role, newUser: User) => {
    setRole(newRole);
    setUser(newUser);
    if (newRole) localStorage.setItem('hiskule_role', newRole);
    localStorage.setItem('hiskule_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('hiskule_role');
    localStorage.removeItem('hiskule_user');
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
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
