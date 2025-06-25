
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const CoveragesSection = () => {
  const { data, addCoverage, deleteCoverage } = useAccountingData();
  const [newCoverage, setNewCoverage] = useState({
    amount: '',
    receivedFrom: '',
    receivedBy: '',
    remaining: ''
  });

  const handleAddCoverage = () => {
    if (newCoverage.amount && newCoverage.receivedFrom && newCoverage.receivedBy) {
      const coverage = {
        amount: parseFloat(newCoverage.amount),
        receivedFrom: newCoverage.receivedFrom,
        receivedBy: newCoverage.receivedBy,
        remaining: parseFloat(newCoverage.remaining) || 0
      };
      
      addCoverage(coverage);
      setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
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
        <p className="text-gray-600">إدارة التغطيات المالية والمبالغ المتبقية</p>
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
              <div className="space-y-4">
                {data.coverages.map((coverage) => {
                  const coverageStatus = getCoverageStatus(coverage.amount, coverage.remaining);
                  return (
                    <div key={coverage.id} className="p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">من: {coverage.receivedFrom}</h3>
                          <p className="text-gray-600">إلى: {coverage.receivedBy}</p>
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
                          <span className="font-bold text-orange-600 text-lg">{formatCurrency(coverage.remaining)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">الحالة:</span>
                          <span className={`font-bold text-lg ${coverageStatus.statusColor}`}>
                            {coverageStatus.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-2">تفصيل التغطية:</h4>
                        <div className="text-sm text-gray-700">
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
    </div>
  );
};

export default CoveragesSection;
