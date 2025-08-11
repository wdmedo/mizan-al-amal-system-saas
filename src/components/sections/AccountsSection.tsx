
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const AccountsSection = () => {
  const { data, addAccount, deleteAccount } = useAccountingData();
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: ''
  });

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.balance) {
      addAccount({
        name: newAccount.name,
        balance: parseFloat(newAccount.balance)
      });
      
      setNewAccount({ name: '', balance: '' });
    }
  };

  const getTotalBalance = () => {
    return data.accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const getPositiveBalances = () => {
    return data.accounts.filter(account => account.balance > 0).reduce((sum, account) => sum + account.balance, 0);
  };

  const getNegativeBalances = () => {
    return data.accounts.filter(account => account.balance < 0).reduce((sum, account) => sum + Math.abs(account.balance), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="space-y-6" id="accounts-content">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            ملخص الحسابات
          </h2>
          <PrintButton printableElementId="accounts-content" />
        </div>
        <p className="text-gray-600">إدارة الحسابات المالية والأرصدة</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <FileText className="h-5 w-5" />
              إجمالي الأرصدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-1">
                {formatCurrency(getTotalBalance())}
              </div>
              <p className="text-gray-600 text-sm">صافي جميع الأرصدة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              الأرصدة الموجبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(getPositiveBalances())}
              </div>
              <p className="text-gray-600 text-sm">مجموع الأرصدة الدائنة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-5 w-5" />
              الأرصدة السالبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {formatCurrency(getNegativeBalances())}
              </div>
              <p className="text-gray-600 text-sm">مجموع الأرصدة المدينة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Account */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة حساب جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountName">اسم الحساب</Label>
              <Input
                id="accountName"
                placeholder="اسم الحساب"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="balance">الرصيد</Label>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddAccount}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة حساب
          </Button>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>قائمة الحسابات</CardTitle>
        </CardHeader>
        <CardContent>
          {data.accounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد حسابات مسجلة حتى الآن
            </div>
          ) : (
            <div className="space-y-3">
              {data.accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-teal-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{account.name}</h3>
                    <div className="text-sm text-gray-600">رصيد الحساب</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(account.balance)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.balance >= 0 ? 'رصيد دائن' : 'رصيد مدين'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsSection;
