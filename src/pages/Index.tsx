
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import ExpensesSection from '@/components/sections/ExpensesSection';
import PendingCustomersSection from '@/components/sections/PendingCustomersSection';
import CompletedCustomersSection from '@/components/sections/CompletedCustomersSection';
import EmployeesSection from '@/components/sections/EmployeesSection';
import CoveragesSection from '@/components/sections/CoveragesSection';
import AccountsSection from '@/components/sections/AccountsSection';
import MonthlyYearlyClosingSection from '@/components/sections/MonthlyYearlyClosingSection';
import CapitalOverYearSection from '@/components/sections/CapitalOverYearSection';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const { isLoggedIn, login } = useAuth();
  const location = useLocation();

  // إذا لم يكن المستخدم مسجل الدخول، عرض نموذج تسجيل الدخول
  if (!isLoggedIn) {
    return <LoginForm onLogin={login} />;
  }

  const renderSection = () => {
    switch (location.pathname) {
      case '/':
        return <Dashboard />;
      case '/expenses':
        return <ExpensesSection />;
      case '/pending-customers':
        return <PendingCustomersSection />;
      case '/completed-customers':
        return <CompletedCustomersSection />;
      case '/employees':
        return <EmployeesSection />;
      case '/coverages':
        return <CoveragesSection />;
      case '/accounts':
        return <AccountsSection />;
      case '/closing':
        return <MonthlyYearlyClosingSection />;
      case '/capital':
        return <CapitalOverYearSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderSection()}
    </Layout>
  );
};

export default Index;
