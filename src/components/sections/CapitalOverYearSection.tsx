
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingUp, TrendingDown, Calendar, Edit, Trash2 } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const CapitalOverYearSection = () => {
  const { data, addCapitalEntry, deleteCapitalEntry } = useAccountingData();
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'increase' as 'increase' | 'decrease',
    description: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddEntry = () => {
    if (newEntry.amount && newEntry.description) {
      addCapitalEntry({
        date: newEntry.date,
        amount: parseFloat(newEntry.amount),
        type: newEntry.type,
        description: newEntry.description
      });

      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'increase',
        description: ''
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteCapitalEntry(id);
  };

  const calculateCurrentCapital = () => {
    return data.capitalEntries.reduce((total, entry) => {
      return entry.type === 'increase' ? total + entry.amount : total - entry.amount;
    }, 0);
  };

  const getMonthlyData = () => {
    const months = {};
    data.capitalEntries.forEach(entry => {
      const monthKey = entry.date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) {
        months[monthKey] = { increases: 0, decreases: 0, net: 0 };
      }
      if (entry.type === 'increase') {
        months[monthKey].increases += entry.amount;
      } else {
        months[monthKey].decreases += entry.amount;
      }
      months[monthKey].net = months[monthKey].increases - months[monthKey].decreases;
    });
    return months;
  };

  // البحث عن حساب البنك الرئيسي
  const bankAccount = data.accounts.find(account => account.name === 'حساب البنك الرئيسي');

  const monthlyData = getMonthlyData();
  const currentCapital = calculateCurrentCapital();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          رأس المال على مدى السنة
        </h2>
        <PrintButton printableElementId="capital-over-year-report" />
      </div>

      {/* ملخص رأس المال الحالي وحساب البنك */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">رأس المال الحالي</h3>
              <p className="text-4xl font-bold text-blue-800">
                {currentCapital.toLocaleString()} ر.س
              </p>
              <p className="text-sm text-gray-600 mt-2">
                آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">رصيد البنك الرئيسي</h3>
              <p className="text-4xl font-bold text-green-800">
                {bankAccount ? bankAccount.balance.toLocaleString() : '0'} ر.س
              </p>
              <p className="text-sm text-gray-600 mt-2">
                يتم تحديثه تلقائياً مع حركات رأس المال
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إضافة حركة جديدة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة حركة رأس المال
          </CardTitle>
          <p className="text-sm text-gray-600">
            ملاحظة: سيتم تحديث حساب البنك الرئيسي تلقائياً عند إضافة الحركة
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="type">نوع الحركة</Label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newEntry.type}
                onChange={(e) => setNewEntry({...newEntry, type: e.target.value as 'increase' | 'decrease'})}
              >
                <option value="increase">زيادة رأس المال</option>
                <option value="decrease">تقليل رأس المال</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                placeholder="وصف الحركة"
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleAddEntry} className="w-full">
            <Plus className="h-4 w-4 ml-2" />
            إضافة الحركة وتحديث حساب البنك
          </Button>
        </CardContent>
      </Card>

      {/* تقرير رأس المال */}
      <div id="capital-over-year-report">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">تقرير حركات رأس المال لسنة {new Date().getFullYear()}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* الحركات الشهرية */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">الملخص الشهري</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(monthlyData).map(([month, data]: [string, { increases: number; decreases: number; net: number }]) => (
                  <Card key={month} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="font-semibold">
                          {new Date(month + '-01').toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">الزيادات:</span>
                            <span>{data.increases.toLocaleString()} ر.س</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-red-600">التقليلات:</span>
                            <span>{data.decreases.toLocaleString()} ر.س</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>الصافي:</span>
                            <span className={data.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {data.net.toLocaleString()} ر.س
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* جدول تفصيلي للحركات */}
            <div>
              <h4 className="text-lg font-semibold mb-4">تفاصيل جميع الحركات</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">التاريخ</th>
                      <th className="border border-gray-300 p-2">الوصف</th>
                      <th className="border border-gray-300 p-2">نوع الحركة</th>
                      <th className="border border-gray-300 p-2">المبلغ</th>
                      <th className="border border-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.capitalEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="border border-gray-300 p-2">
                          {new Date(entry.date).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="border border-gray-300 p-2">{entry.description}</td>
                        <td className="border border-gray-300 p-2">
                          <span className={`flex items-center gap-1 ${
                            entry.type === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.type === 'increase' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {entry.type === 'increase' ? 'زيادة' : 'تقليل'}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2 font-semibold">
                          {entry.amount.toLocaleString()} ر.س
                        </td>
                        <td className="border border-gray-300 p-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(entry.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* الإجمالي النهائي */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">إجمالي رأس المال الحالي:</span>
                <span className="text-2xl font-bold text-blue-800">
                  {currentCapital.toLocaleString()} ر.س
                </span>
              </div>
              {bankAccount && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold">رصيد البنك الرئيسي:</span>
                  <span className="text-2xl font-bold text-green-800">
                    {bankAccount.balance.toLocaleString()} ر.س
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CapitalOverYearSection;
