
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Shield, DollarSign, CreditCard } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const CoveragesSection = () => {
  const { data, addCoverage, deleteCoverage, addCoverageTransaction, deleteCoverageTransaction } = useAccountingData();
  const [newCoverage, setNewCoverage] = useState({
    amount: '',
    receivedFrom: '',
    receivedBy: '',
    remaining: ''
  });
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'payment' as 'payment' | 'refund',
    description: ''
  });

  const handleAddCoverage = () => {
    if (newCoverage.amount && newCoverage.receivedFrom && newCoverage.receivedBy) {
      const coverage = {
        amount: parseFloat(newCoverage.amount),
        receivedFrom: newCoverage.receivedFrom,
        receivedBy: newCoverage.receivedBy,
        remaining: parseFloat(newCoverage.remaining) || 0,
        transactions: []
      };
      
      addCoverage(coverage);
      setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
    }
  };

  const handleAddTransaction = () => {
    if (selectedCoverage && newTransaction.amount) {
      addCoverageTransaction({
        coverageId: selectedCoverage,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        description: newTransaction.description || (newTransaction.type === 'payment' ? 'دفعة' : 'استرداد'),
        date: new Date().toISOString().split('T')[0]
      });
      
      setNewTransaction({ amount: '', type: 'payment', description: '' });
      setSelectedCoverage(null);
    }
  };

  const handleDeleteCoverage = (id: string) => {
    deleteCoverage(id);
  };

  const getTotalCoverages = () => {
    return data.coverages.reduce((sum, coverage) => sum + coverage.amount, 0);
  };

  const getTotalRemaining = () => {
    return data.coverages.reduce((sum, coverage) => sum + coverage.remaining, 0);
  };

  const getCoverageStatus = (coverage: any) => {
    const totalPayments = coverage.transactions?.reduce((sum: number, t: any) => 
      sum + (t.type === 'payment' ? t.amount : 0), 0
    ) || 0;
    
    const totalRefunds = coverage.transactions?.reduce((sum: number, t: any) => 
      sum + (t.type === 'refund' ? t.amount : 0), 0
    ) || 0;
    
    const actualRemaining = coverage.remaining - totalPayments + totalRefunds;
    const paid = coverage.amount - actualRemaining;
    
    if (actualRemaining <= 0) {
      return { status: 'مكتملة', statusColor: 'text-green-600', paid, actualRemaining: Math.max(0, actualRemaining) };
    } else if (paid === 0) {
      return { status: 'لم تبدأ', statusColor: 'text-red-600', paid, actualRemaining };
    } else {
      return { status: 'جارية', statusColor: 'text-orange-600', paid, actualRemaining };
    }
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            إدارة التغطيات
          </h2>
          <PrintButton printableElementId="coverages-content" />
        </div>
        <p className="text-gray-600">إدارة التغطيات المالية والمبالغ المتبقية والمعاملات</p>
      </div>

      <div id="coverages-content">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Shield className="h-5 w-5" />
                إجمالي التغطيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {formatCurrency(getTotalCoverages())}
                </div>
                <p className="text-gray-600 text-sm">مجموع جميع التغطيات</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Shield className="h-5 w-5" />
                إجمالي المتبقي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {formatCurrency(getTotalRemaining())}
                </div>
                <p className="text-gray-600 text-sm">مجموع المبالغ المتبقية</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coverages List */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>قائمة التغطيات وحساباتها</CardTitle>
          </CardHeader>
          <CardContent>
            {data.coverages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد تغطيات مسجلة حتى الآن
              </div>
            ) : (
              <div className="space-y-6">
                {data.coverages.map((coverage) => {
                  const coverageStatus = getCoverageStatus(coverage);
                  return (
                    <div key={coverage.id} className="p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">من: {coverage.receivedFrom}</h3>
                          <p className="text-gray-600">إلى: {coverage.receivedBy}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCoverage(coverage.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Plus className="h-4 w-4 ml-1" />
                            معاملة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCoverage(coverage.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">مبلغ التغطية:</span>
                          <span className="font-bold text-purple-600 text-lg">{formatCurrency(coverage.amount)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">المدفوع:</span>
                          <span className="font-bold text-green-600 text-lg">{formatCurrency(coverageStatus.paid)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">المتبقي:</span>
                          <span className="font-bold text-orange-600 text-lg">{formatCurrency(coverageStatus.actualRemaining)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">الحالة:</span>
                          <span className={`font-bold text-lg ${coverageStatus.statusColor}`}>
                            {coverageStatus.status}
                          </span>
                        </div>
                      </div>

                      {/* Coverage Transactions */}
                      {coverage.transactions && coverage.transactions.length > 0 && (
                        <div className="bg-white p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">سجل المعاملات:</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {coverage.transactions.map((transaction) => (
                              <div key={transaction.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  {transaction.type === 'payment' ? (
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                  )}
                                  <span className="text-sm text-gray-700">{transaction.description}</span>
                                  <span className="text-xs text-gray-500">({transaction.date})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${transaction.type === 'payment' ? 'text-green-600' : 'text-blue-600'}`}>
                                    {transaction.type === 'payment' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteCoverageTransaction(transaction.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-2">تفصيل التغطية:</h4>
                        <div className="text-sm text-gray-700">
                          <p>إجمالي مبلغ التغطية: <span className="font-semibold text-purple-600">{formatCurrency(coverage.amount)}</span></p>
                          <p>المبلغ المدفوع: <span className="font-semibold text-green-600">{formatCurrency(coverageStatus.paid)}</span></p>
                          <p>المبلغ المتبقي: <span className="font-semibold text-orange-600">{formatCurrency(coverageStatus.actualRemaining)}</span></p>
                          <hr className="my-2" />
                          <p className="font-bold">
                            نسبة الإنجاز: <span className="text-blue-600">{((coverageStatus.paid / coverage.amount) * 100).toFixed(1)}%</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add New Coverage */}
      <Card className="border-0 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة تغطية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">مبلغ التغطية</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newCoverage.amount}
                onChange={(e) => setNewCoverage({ ...newCoverage, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="remaining">الباقي</Label>
              <Input
                id="remaining"
                type="number"
                placeholder="0.00"
                value={newCoverage.remaining}
                onChange={(e) => setNewCoverage({ ...newCoverage, remaining: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="receivedFrom">وصل منها</Label>
              <Input
                id="receivedFrom"
                placeholder="مصدر التغطية"
                value={newCoverage.receivedFrom}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedFrom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="receivedBy">وصل له</Label>
              <Input
                id="receivedBy"
                placeholder="المستلم"
                value={newCoverage.receivedBy}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedBy: e.target.value })}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddCoverage}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة تغطية
          </Button>
        </CardContent>
      </Card>

      {/* Add Coverage Transaction Modal */}
      {selectedCoverage && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              إضافة معاملة مالية للتغطية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-amount">المبلغ</Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="transaction-type">نوع المعاملة</Label>
                <select
                  id="transaction-type"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'payment' | 'refund' })}
                >
                  <option value="payment">دفعة</option>
                  <option value="refund">استرداد</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="transaction-description">الوصف</Label>
              <Input
                id="transaction-description"
                placeholder="وصف المعاملة"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddTransaction}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة معاملة
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedCoverage(null)}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoveragesSection;
