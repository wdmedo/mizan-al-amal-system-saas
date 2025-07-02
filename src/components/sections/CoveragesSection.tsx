import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Shield, DollarSign, FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [showAddCoverage, setShowAddCoverage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateCoverageForm = () => {
    const errors: string[] = [];
    
    if (!newCoverage.amount || parseFloat(newCoverage.amount) <= 0) {
      errors.push('يجب إدخال مبلغ التغطية بصورة صحيحة');
    }
    
    if (!newCoverage.receivedFrom.trim()) {
      errors.push('يجب إدخال مصدر التغطية');
    }
    
    if (!newCoverage.receivedBy.trim()) {
      errors.push('يجب إدخال اسم المستلم');
    }
    
    if (newCoverage.remaining && parseFloat(newCoverage.remaining) > parseFloat(newCoverage.amount)) {
      errors.push('المبلغ المتبقي لا يمكن أن يكون أكبر من مبلغ التغطية');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validateTransactionForm = () => {
    const errors: string[] = [];
    
    if (!newTransaction.coverageId) {
      errors.push('يجب اختيار التغطية');
    }
    
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      errors.push('يجب إدخال مبلغ المعاملة بصورة صحيحة');
    }
    
    if (!newTransaction.description.trim()) {
      errors.push('يجب إدخال وصف المعاملة');
    }
    
    // Check if transaction amount doesn't exceed coverage remaining
    if (newTransaction.coverageId && newTransaction.amount) {
      const coverage = data.coverages.find(c => c.id === newTransaction.coverageId);
      if (coverage && newTransaction.type === 'payment' && parseFloat(newTransaction.amount) > coverage.remaining) {
        errors.push('مبلغ الدفعة لا يمكن أن يتجاوز المبلغ المتبقي للتغطية');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddCoverage = () => {
    if (!validateCoverageForm()) return;
    
    const coverage = {
      amount: parseFloat(newCoverage.amount),
      receivedFrom: newCoverage.receivedFrom.trim(),
      receivedBy: newCoverage.receivedBy.trim(),
      remaining: parseFloat(newCoverage.remaining) || parseFloat(newCoverage.amount)
    };
    
    addCoverage(coverage);
    setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
    setShowAddCoverage(false);
    setValidationErrors([]);
  };

  const handleAddTransaction = () => {
    if (!validateTransactionForm()) return;
    
    addCoverageTransaction({
      coverageId: newTransaction.coverageId,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description.trim(),
      date: newTransaction.date
    });
    
    setNewTransaction({
      coverageId: '',
      type: 'payment',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setValidationErrors([]);
  };

  const handleDeleteCoverage = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه التغطية؟ سيتم حذف جميع معاملاتها أيضاً.')) {
      deleteCoverage(id);
    }
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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={() => setShowAddCoverage(true)}
            className="h-12 text-base bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <Plus className="h-5 w-5 ml-2" />
            إضافة تغطية جديدة
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="h-12 text-base border-green-200 text-green-700 hover:bg-green-50"
                disabled={data.coverages.length === 0}
              >
                <DollarSign className="h-5 w-5 ml-2" />
                إضافة معاملة تغطية
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-center">إضافة معاملة تغطية جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coverage-select" className="text-sm font-medium">اختر التغطية *</Label>
                  <Select value={newTransaction.coverageId} onValueChange={(value) => setNewTransaction({ ...newTransaction, coverageId: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="اختر التغطية" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.coverages.map((coverage) => (
                        <SelectItem key={coverage.id} value={coverage.id}>
                          <div className="flex flex-col text-right">
                            <span className="font-medium">{coverage.receivedFrom} ← {coverage.receivedBy}</span>
                            <span className="text-xs text-gray-500">متبقي: {formatCurrency(coverage.remaining)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="transaction-type" className="text-sm font-medium">نوع المعاملة *</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">دفعة (تقليل المتبقي)</SelectItem>
                      <SelectItem value="adjustment">تعديل</SelectItem>
                      <SelectItem value="refund">استرداد (زيادة المتبقي)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="transaction-amount" className="text-sm font-medium">المبلغ *</Label>
                  <Input
                    id="transaction-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="transaction-description" className="text-sm font-medium">الوصف *</Label>
                  <Input
                    id="transaction-description"
                    placeholder="وصف المعاملة"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="transaction-date" className="text-sm font-medium">التاريخ *</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={handleAddTransaction} className="w-full">
                  <CheckCircle className="h-4 w-4 ml-2" />
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
              قائمة التغطيات وحساباتها ({data.coverages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.coverages.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">لا توجد تغطيات مسجلة</p>
                <p className="text-gray-400 text-sm">ابدأ بإضافة تغطية جديدة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.coverages.map((coverage) => {
                  const coverageStatus = getCoverageStatus(coverage.amount, coverage.remaining);
                  const coverageTransactions = data.coverageTransactions.filter(t => t.coverageId === coverage.id);
                  return (
                    <div key={coverage.id} className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">
                            {coverage.receivedFrom} ← {coverage.receivedBy}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${coverageStatus.statusColor} bg-opacity-10`}>
                              {coverageStatus.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {coverageTransactions.length} معاملة
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCoverage(coverage.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
                        <div className="bg-white p-2 sm:p-3 rounded-lg border">
                          <span className="text-gray-600 text-xs sm:text-sm block">مبلغ التغطية:</span>
                          <span className="font-bold text-purple-600 text-sm sm:text-lg">{formatCurrency(coverage.amount)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg border">
                          <span className="text-gray-600 text-xs sm:text-sm block">المدفوع:</span>
                          <span className="font-bold text-green-600 text-sm sm:text-lg">{formatCurrency(coverageStatus.paid)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg border">
                          <span className="text-gray-600 text-xs sm:text-sm block">المتبقي:</span>
                          <span className="font-bold text-orange-600 text-sm sm:text-lg">{formatCurrency(coverage.remaining)}</span>
                        </div>
                        <div className="bg-white p-2 sm:p-3 rounded-lg border">
                          <span className="text-gray-600 text-xs sm:text-sm block">نسبة الإنجاز:</span>
                          <span className="font-bold text-blue-600 text-sm sm:text-lg">
                            {((coverageStatus.paid / coverage.amount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Coverage Transactions */}
                      {coverageTransactions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            معاملات التغطية:
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {coverageTransactions.slice(0, 5).map((transaction) => (
                              <div key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-2 sm:p-3 rounded border gap-2">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                    <span className={`font-semibold text-xs sm:text-sm px-2 py-1 rounded ${getTransactionColor(transaction.type)} bg-opacity-10`}>
                                      {getTransactionTypeLabel(transaction.type)}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      {formatCurrency(transaction.amount)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{transaction.description}</p>
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
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add New Coverage Dialog */}
      <Dialog open={showAddCoverage} onOpenChange={setShowAddCoverage}>
        <DialogContent className="max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">إضافة تغطية جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">مبلغ التغطية *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newCoverage.amount}
                  onChange={(e) => setNewCoverage({ 
                    ...newCoverage, 
                    amount: e.target.value, 
                    remaining: newCoverage.remaining || e.target.value 
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="remaining" className="text-sm font-medium">المبلغ المتبقي</Label>
                <Input
                  id="remaining"
                  type="number"
                  step="0.01"
                  placeholder="نفس مبلغ التغطية"
                  value={newCoverage.remaining}
                  onChange={(e) => setNewCoverage({ ...newCoverage, remaining: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">اتركه فارغاً لاستخدام نفس مبلغ التغطية</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="receivedFrom" className="text-sm font-medium">مصدر التغطية *</Label>
              <Input
                id="receivedFrom"
                placeholder="اسم الشخص أو الجهة المرسلة"
                value={newCoverage.receivedFrom}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedFrom: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="receivedBy" className="text-sm font-medium">المستلم *</Label>
              <Input
                id="receivedBy"
                placeholder="اسم الشخص أو الجهة المستلمة"
                value={newCoverage.receivedBy}
                onChange={(e) => setNewCoverage({ ...newCoverage, receivedBy: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddCoverage}
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة التغطية
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddCoverage(false);
                  setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
                  setValidationErrors([]);
                }}
                className="px-6"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoveragesSection;
