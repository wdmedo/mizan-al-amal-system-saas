
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const MonthlyYearlyClosingSection = () => {
  const { data } = useAccountingData();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // حساب البيانات المطلوبة للتقفيل
  const calculatePeriodData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // تصفية البيانات حسب الفترة المحددة
    const filterByPeriod = (date: string) => {
      const itemDate = new Date(date);
      if (selectedPeriod === 'current-month') {
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      } else {
        return itemDate.getFullYear() === currentYear;
      }
    };

    const periodExpenses = data.expenses.filter(expense => filterByPeriod(expense.date));
    const periodCompletedCustomers = data.completedCustomers.filter(customer => 
      customer.id && filterByPeriod(new Date().toISOString()) // استخدام التاريخ الحالي كافتراضي
    );

    const totalExpenses = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalRevenue = periodCompletedCustomers.reduce((sum, customer) => sum + customer.netProfit, 0);

    return {
      totalExpenses,
      totalRevenue,
      totalProductDifference: 0, // إزالة فرق السلعة
      netProfit: totalRevenue - totalExpenses,
      transactionCount: periodExpenses.length + periodCompletedCustomers.length
    };
  };

  const periodData = calculatePeriodData();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          التقفيل الشهري والسنوي
        </h2>
        <div className="flex gap-2">
          <PrintButton printableElementId="closing-report" />
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* اختيار الفترة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            اختيار فترة التقفيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={selectedPeriod === 'current-month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('current-month')}
            >
              التقفيل الشهري
            </Button>
            <Button
              variant={selectedPeriod === 'current-year' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('current-year')}
            >
              التقفيل السنوي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* تقرير التقفيل */}
      <div id="closing-report">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              تقرير {selectedPeriod === 'current-month' ? 'التقفيل الشهري' : 'التقفيل السنوي'}
            </CardTitle>
            <p className="text-center text-gray-600">
              فترة: {selectedPeriod === 'current-month' ? 
                `${new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}` :
                `سنة ${new Date().getFullYear()}`
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ملخص الإيرادات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-700">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-green-800">
                    {periodData.totalRevenue.toLocaleString()} ر.س
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-red-700">إجمالي المصروفات</p>
                  <p className="text-2xl font-bold text-red-800">
                    {periodData.totalExpenses.toLocaleString()} ر.س
                  </p>
                </CardContent>
              </Card>

              <Card className={`${periodData.netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-4 text-center">
                  {periodData.netProfit >= 0 ? 
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" /> :
                    <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  }
                  <p className={`text-sm ${periodData.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    صافي الربح/الخسارة
                  </p>
                  <p className={`text-2xl font-bold ${periodData.netProfit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {periodData.netProfit.toLocaleString()} ر.س
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* إحصائيات إضافية */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الفترة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-gray-600">عدد المعاملات</p>
                    <p className="text-xl font-bold">{periodData.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">العملاء الخالصين</p>
                    <p className="text-xl font-bold">{data.completedCustomers.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">العملاء المعلقين</p>
                    <p className="text-xl font-bold">{data.pendingCustomers.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">إجمالي الموظفين</p>
                    <p className="text-xl font-bold">{data.employees.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توقيع المسؤول */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">تاريخ التقرير:</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm text-gray-600">توقيع المسؤول</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyYearlyClosingSection;
