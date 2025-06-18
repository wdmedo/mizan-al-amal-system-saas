
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Users, UserCheck, Briefcase, Shield, FileText, Calculator, TrendingUp } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';

const Dashboard = () => {
  const { data } = useAccountingData();

  // Calculations
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalPendingPayments = data.pendingCustomers.reduce((sum, customer) => 
    sum + customer.payments.reduce((paySum, payment) => paySum + payment.amount, 0), 0
  );
  
  const totalCompletedProfit = data.completedCustomers.reduce((sum, customer) => sum + customer.netProfit, 0);
  
  const totalEmployeeAdvances = data.employees.reduce((sum, employee) => sum + employee.advances, 0);
  
  const totalCoverages = data.coverages.reduce((sum, coverage) => sum + coverage.amount, 0);
  
  const totalAccountBalance = data.accounts.reduce((sum, account) => sum + account.balance, 0);

  const stats = [
    {
      title: 'إجمالي المصروفات',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50'
    },
    {
      title: 'مدفوعات العملاء المعلقين',
      value: totalPendingPayments,
      icon: Users,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'from-orange-50 to-amber-50'
    },
    {
      title: 'صافي أرباح العملاء الخالصين',
      value: totalCompletedProfit,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'سلفيات الموظفين',
      value: totalEmployeeAdvances,
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'إجمالي التغطيات',
      value: totalCoverages,
      icon: Shield,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: 'إجمالي الأرصدة',
      value: totalAccountBalance,
      icon: FileText,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          لوحة التحكم المالية
        </h2>
        <p className="text-gray-600">نظرة شاملة على الوضع المالي للشركة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stat.value)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="h-5 w-5" />
              ملخص الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">مدفوعات العملاء المعلقين:</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalPendingPayments)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">أرباح العملاء الخالصين:</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalCompletedProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">أرصدة الحسابات:</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalAccountBalance)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-800">إجمالي الإيرادات:</span>
              <span className="text-green-600">{formatCurrency(totalPendingPayments + totalCompletedProfit + totalAccountBalance)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-5 w-5" />
              ملخص المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المصروفات العامة:</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">سلفيات الموظفين:</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalEmployeeAdvances)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">التغطيات:</span>
              <span className="font-semibold text-orange-600">{formatCurrency(totalCoverages)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-800">إجمالي المصروفات:</span>
              <span className="text-red-600">{formatCurrency(totalExpenses + totalEmployeeAdvances)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Net Profit Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            صافي الربح
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency((totalPendingPayments + totalCompletedProfit + totalAccountBalance) - (totalExpenses + totalEmployeeAdvances))}
            </div>
            <p className="text-gray-600">الربح الصافي للشركة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
