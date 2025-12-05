import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => User | null;
  register: (user: Omit<User, 'id'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on load
    const storedUser = localStorage.getItem('foodie_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string): User | null => {
    // In a real app, API call here.
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('foodie_user', JSON.stringify(foundUser));
      return foundUser;
    }
    
    // Check locally registered users (simulated DB extension)
    const localUsersStr = localStorage.getItem('foodie_local_users');
    if (localUsersStr) {
      const localUsers: User[] = JSON.parse(localUsersStr);
      const foundLocal = localUsers.find(u => u.email === email && u.password === pass);
      if (foundLocal) {
        setUser(foundLocal);
        localStorage.setItem('foodie_user', JSON.stringify(foundLocal));
        return foundLocal;
      }
    }
    
    return null;
  };

  const register = (newUser: Omit<User, 'id'>) => {
    const userWithId: User = { ...newUser, id: Date.now().toString() };
    
    // Save to "DB"
    const localUsersStr = localStorage.getItem('foodie_local_users');
    const localUsers: User[] = localUsersStr ? JSON.parse(localUsersStr) : [];
    localUsers.push(userWithId);
    localStorage.setItem('foodie_local_users', JSON.stringify(localUsers));
    
    // Auto login
    setUser(userWithId);
    localStorage.setItem('foodie_user', JSON.stringify(userWithId));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodie_user');
  };

  const getAllUsers = (): User[] => {
    const localUsersStr = localStorage.getItem('foodie_local_users');
    const localUsers: User[] = localUsersStr ? JSON.parse(localUsersStr) : [];
    
    // Combine mock users and local users, filtering duplicates if any (though IDs should be unique)
    // We filter to ensure we return users.
    const all = [...MOCK_USERS, ...localUsers];
    return all;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};