import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, Building, CreditCard, Shield, Briefcase } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';

const Dashboard = () => {
  const { data } = useAccountingData();

  const getTotalExpenses = () => {
    return data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalPendingPayments = () => {
    return data.pendingCustomers.reduce((sum, customer) => 
      sum + customer.payments.reduce((paySum, payment) => paySum + payment.amount, 0), 0
    );
  };

  const getTotalCompletedRevenue = () => {
    return data.completedCustomers.reduce((sum, customer) => sum + customer.netProfit, 0);
  };

  const getTotalEmployeeSalaries = () => {
    return data.employees.reduce((sum, employee) => sum + employee.salary, 0);
  };

  const getTotalCoverages = () => {
    return data.coverages.reduce((sum, coverage) => sum + coverage.amount, 0);
  };

  const getNetBankBalance = () => {
    const bankAccount = data.accounts.find(account => account.name === 'حساب البنك الرئيسي');
    const bankBalance = bankAccount ? bankAccount.balance : 0;
    
    const totalRevenue = getTotalCompletedRevenue() + getTotalPendingPayments();
    const totalExpenses = getTotalExpenses() + getTotalEmployeeSalaries();
    
    return bankBalance + totalRevenue - totalExpenses;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          لوحة التحكم الرئيسية
        </h1>
        <p className="text-gray-600">نظرة شاملة على الوضع المالي للشركة</p>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">صافي الأرباح</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalCompletedRevenue())}</div>
            <p className="text-xs text-green-600">من العملاء المكتملين</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">المدفوعات المعلقة</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalPendingPayments())}</div>
            <p className="text-xs text-blue-600">من العملاء المعلقين</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">إجمالي المصروفات</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</div>
            <p className="text-xs text-red-600">جميع المصروفات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">صافي رصيد البنك</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(getNetBankBalance())}</div>
            <p className="text-xs text-purple-600">الرصيد الصافي</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">رواتب الموظفين</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(getTotalEmployeeSalaries())}</div>
            <p className="text-xs text-orange-600">إجمالي الرواتب الشهرية</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">التغطيات</CardTitle>
            <Shield className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{formatCurrency(getTotalCoverages())}</div>
            <p className="text-xs text-teal-600">إجمالي التغطيات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">الحسابات</CardTitle>
            <Briefcase className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{data.accounts.length}</div>
            <p className="text-xs text-indigo-600">عدد الحسابات المصرفية</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
