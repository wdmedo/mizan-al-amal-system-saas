
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ExpensesSection from '@/components/sections/ExpensesSection';
import PendingCustomersSection from '@/components/sections/PendingCustomersSection';
import CompletedCustomersSection from '@/components/sections/CompletedCustomersSection';
import EmployeesSection from '@/components/sections/EmployeesSection';
import CoveragesSection from '@/components/sections/CoveragesSection';
import AccountsSection from '@/components/sections/AccountsSection';
import MonthlyYearlyClosingSection from '@/components/sections/MonthlyYearlyClosingSection';
import CapitalOverYearSection from '@/components/sections/CapitalOverYearSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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
