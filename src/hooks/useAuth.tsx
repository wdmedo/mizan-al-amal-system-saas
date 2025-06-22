
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (isLoggedIn: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول المحفوظة
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');
    
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
      setUsername(savedUsername || 'مستخدم');
    }
  }, []);

  const login = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const savedUsername = localStorage.getItem('username');
      setUsername(savedUsername || 'مستخدم');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
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
