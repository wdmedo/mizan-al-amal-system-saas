
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import SolverLoginForm from '@/components/SolverLoginForm';
import FinancialSolver from '@/components/FinancialSolver';
import VisitsAndCustomers from '@/pages/VisitsAndCustomers';
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

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSolverLogin, setShowSolverLogin] = useState(false);
  const [showVisitsPage, setShowVisitsPage] = useState(false);
  const [solverUser, setSolverUser] = useState<string | null>(null);
  const { isLoggedIn, loading } = useAuth();

  // إذا كان المستخدم في الحاسبة المالية
  if (solverUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50" dir="rtl">
        <header className="bg-white/90 backdrop-blur-lg border-b border-green-100 shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              حاسبة الصيغ المالية
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">مرحباً، {solverUser}</span>
              <button
                onClick={() => setSolverUser(null)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                خروج
              </button>
            </div>
          </div>
        </header>
        <div className="p-6">
          <FinancialSolver />
        </div>
      </div>
    );
  }

  // إذا كان في صفحة متابعة الزيارات والعملاء
  if (showVisitsPage) {
    return (
      <VisitsAndCustomers 
        onBack={() => setShowVisitsPage(false)}
      />
    );
  }

  // إذا كان في صفحة دخول الحاسبة
  if (showSolverLogin) {
    return (
      <SolverLoginForm 
        onLogin={setSolverUser}
        onBackToMain={() => setShowSolverLogin(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900" dir="rtl">
        <div className="w-10 h-10 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، عرض نموذج تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <LoginForm 
        onSolverAccess={() => setShowSolverLogin(true)}
        onVisitsAccess={() => setShowVisitsPage(true)}
      />
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpensesSection />;
      case 'pending-customers':
        return <PendingCustomersSection />;
      case 'completed-customers':
        return <CompletedCustomersSection />;
      case 'employees':
        return <EmployeesSection />;
      case 'coverages':
        return <CoveragesSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'monthly-yearly-closing':
        return <MonthlyYearlyClosingSection />;
      case 'capital-over-year':
        return <CapitalOverYearSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </Layout>
  );
};

export default Index;
