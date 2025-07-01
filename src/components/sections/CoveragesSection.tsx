
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Shield, DollarSign, FileText, Calendar } from 'lucide-react';
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
  const [newTransaction, setNewTransaction] = useState({
    coverageId: '',
    type: 'payment' as 'payment' | 'adjustment' | 'refund',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddCoverage = () => {
    if (newCoverage.amount && newCoverage.receivedFrom && newCoverage.receivedBy) {
      const coverage = {
        amount: parseFloat(newCoverage.amount),
        receivedFrom: newCoverage.receivedFrom,
        receivedBy: newCoverage.receivedBy,
        remaining: parseFloat(newCoverage.remaining) || parseFloat(newCoverage.amount)
      };
      
      addCoverage(coverage);
      setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.coverageId && newTransaction.amount && newTransaction.description) {
      addCoverageTransaction({
        coverageId: newTransaction.coverageId,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description,
        date: newTransaction.date
      });
      
      setNewTransaction({
        coverageId: '',
        type: 'payment',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
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

  const getCoverageStatus = (amount: number, remaining: number) => {
    const paid = amount - remaining;
    if (remaining === 0) {
      return { status: 'مكتملة', statusColor: 'text-green-600', paid };
    } else if (paid === 0) {
      return { status: 'لم تبدأ', statusColor: 'text-red-600', paid };
    } else {
      return { status: 'جارية', statusColor: 'text-orange-600', paid };
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'payment': return 'دفعة';
      case 'adjustment': return 'تعديل';
      case 'refund': return 'استرداد';
      default: return type;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-green-600';
      case 'adjustment': return 'text-blue-600';
      case 'refund': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            إدارة التغطيات
          </h2>
          <PrintButton printableElementId="coverages-content" />
        </div>
        <p className="text-gray-600 text-sm sm:text-base">إدارة التغطيات المالية والمبالغ المتبقية</p>
      </div>

      <div id="coverages-content">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-purple-700 text-sm sm:text-base">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                إجمالي التغطيات
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-purple-600 mb-1">
                  {formatCurrency(getTotalCoverages())}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">مجموع جميع التغطيات</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-orange-700 text-sm sm:text-base">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                إجمالي المتبقي
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-1">
                  {formatCurrency(getTotalRemaining())}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">مجموع المبالغ المتبقية</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Button */}
        <div className="mb-4 sm:mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <DollarSign className="h-4 w-4 ml-2" />
                إضافة معاملة تغطية
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>إضافة معاملة تغطية جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coverage-select">التغطية</Label>
                  <Select value={newTransaction.coverageId} onValueChange={(value) => setNewTransaction({ ...newTransaction, coverageId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التغطية" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.coverages.map((coverage) => (
                        <SelectItem key={coverage.id} value={coverage.id}>
                          {coverage.receivedFrom} - {coverage.receivedBy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction-type">نوع المعاملة</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">دفعة</SelectItem>
                      <SelectItem value="adjustment">تعديل</SelectItem>
                      <SelectItem value="refund">استرداد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label htmlFor="transaction-description">الوصف</Label>
                  <Input
                    id="transaction-description"
                    placeholder="وصف المعاملة"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-date">التاريخ</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full">
                  إضافة المعاملة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Coverages List */}
        <Card className="border-0 shadow-lg mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              قائمة التغطيات وحساباتها
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.coverages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد تغطيات مسجلة حتى الآن
              </div>
            ) : (
              <div className="space-y-4">
                {data.coverages.map((coverage) => {
                  const coverageStatus = getCoverageStatus(coverage.amount, coverage.remaining);
                  const coverageTransactions = data.coverageTransactions.filter(t => t.coverageId === coverage.id);
                  return (
                    <div key={coverage.id} className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                        <div>
                          <h3 className="font-bold text-lg sm:text-xl text-gray-800">من: {coverage.receivedFrom}</h3>
                          <p className="text-gray-600 text-sm sm:text-base">إلى: {coverage.receivedBy}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCoverage(coverage.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
                        <div className="bg-white p-2 sm:p-3 rounded-lg">
                          <span className="text-gray-600 text-xs sm:text-sm block">مبلغ التغطية:</span>
                          <span className="font-bold text-purple-600 text-sm sm:text-lg">{formatCurrency(coverage.amount)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg">
                          <span className="text-gray-600 text-xs sm:text-sm block">المدفوع:</span>
                          <span className="font-bold text-green-600 text-sm sm:text-lg">{formatCurrency(coverageStatus.paid)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg">
                          <span className="text-gray-600 text-xs sm:text-sm block">المتبقي:</span>
                          <span className="font-bold text-orange-600 text-sm sm:text-lg">{formatCurrency(coverage.remaining)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg">
                          <span className="text-gray-600 text-xs sm:text-sm block">الحالة:</span>
                          <span className={`font-bold text-sm sm:text-lg ${coverageStatus.statusColor}`}>
                            {coverageStatus.status}
                          </span>
                        </div>
                      </div>

                      {/* Coverage Transactions */}
                      {coverageTransactions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">معاملات التغطية:</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {coverageTransactions.slice(0, 5).map((transaction) => (
                              <div key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-2 sm:p-3 rounded border gap-2">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                    <span className={`font-semibold text-xs sm:text-sm ${getTransactionColor(transaction.type)}`}>
                                      {getTransactionTypeLabel(transaction.type)}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      {formatCurrency(transaction.amount)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
                                  <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteCoverageTransaction(transaction.id)}
                                  className="text-red-600 hover:text-red-700 p-1 sm:p-2"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-dashed border-gray-300 mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">تفصيل التغطية:</h4>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <p>إجمالي مبلغ التغطية: <span className="font-semibold text-purple-600">{formatCurrency(coverage.amount)}</span></p>
                          <p>المبلغ المدفوع: <span className="font-semibold text-green-600">{formatCurrency(coverageStatus.paid)}</span></p>
                          <p>المبلغ المتبقي: <span className="font-semibold text-orange-600">{formatCurrency(coverage.remaining)}</span></p>
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            إضافة تغطية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-sm">مبلغ التغطية</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newCoverage.amount}
                onChange={(e) => setNewCoverage({ ...newCoverage, amount: e.target.value, remaining: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="remaining" className="text-sm">الباقي</Label>
              <Input
                id="remaining"
                type="number"
                placeholder="0.00"
                value={newCoverage.remaining}
                onChange={(e) => setNewCoverage({ ...newCoverage, remaining: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="receivedFrom" className="text-sm">وصل منها</Label>
              <Input
                id="receivedFrom"
                placeholder="مصدر التغطية"
                value={newCoverage.receivedFrom}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedFrom: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="receivedBy" className="text-sm">وصل له</Label>
              <Input
                id="receivedBy"
                placeholder="المستلم"
                value={newCoverage.receivedBy}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedBy: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddCoverage}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة تغطية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoveragesSection;
