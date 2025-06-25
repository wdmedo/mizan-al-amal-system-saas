
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isLoggedIn, login } = useAuth();

  // إذا لم يكن المستخدم مسجل الدخول، عرض نموذج تسجيل الدخول
  if (!isLoggedIn) {
    return <LoginForm onLogin={login} />;
  }

  return <Layout />;
};

export default Index;
