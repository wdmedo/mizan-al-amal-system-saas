
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const ExpensesSection = () => {
  const { data, addExpense, deleteExpense } = useAccountingData();
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: ''
  });

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description) {
      addExpense({
        date: newExpense.date,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description
      });
      
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: ''
      });
    }
  };

  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="space-y-6" id="expenses-content">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            إدارة المصروفات
          </h2>
          <PrintButton printableElementId="expenses-content" />
        </div>
        <p className="text-gray-600">تتبع وإدارة جميع مصروفات الشركة</p>
      </div>

      {/* Total Expenses Card */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingDown className="h-5 w-5" />
            إجمالي المصروفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-gray-600">المجموع الكلي لجميع المصروفات</p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Expense */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة مصروف جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="amount">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="description">البيان</Label>
              <Textarea
                id="description"
                placeholder="وصف المصروف..."
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="min-h-[40px]"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddExpense}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة مصروف
          </Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>قائمة المصروفات</CardTitle>
        </CardHeader>
        <CardContent>
          {data.expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مصروفات مسجلة حتى الآن
            </div>
          ) : (
            <div className="space-y-3">
              {data.expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-semibold text-red-600">{formatCurrency(expense.amount)}</span>
                      <span className="text-gray-500 text-sm">{expense.date}</span>
                    </div>
                    <p className="text-gray-700">{expense.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesSection;
