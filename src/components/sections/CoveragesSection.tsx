
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import { Coverage } from '@/types/accounting';

const CoveragesSection = () => {
  const { data, updateCoverages } = useAccountingData();
  const [newCoverage, setNewCoverage] = useState({
    amount: '',
    receivedFrom: '',
    receivedBy: '',
    remaining: ''
  });

  const handleAddCoverage = () => {
    if (newCoverage.amount && newCoverage.receivedFrom && newCoverage.receivedBy) {
      const coverage: Coverage = {
        id: Date.now().toString(),
        amount: parseFloat(newCoverage.amount),
        receivedFrom: newCoverage.receivedFrom,
        receivedBy: newCoverage.receivedBy,
        remaining: parseFloat(newCoverage.remaining) || 0
      };
      
      updateCoverages([...data.coverages, coverage]);
      setNewCoverage({ amount: '', receivedFrom: '', receivedBy: '', remaining: '' });
    }
  };

  const handleDeleteCoverage = (id: string) => {
    updateCoverages(data.coverages.filter(coverage => coverage.id !== id));
  };

  const getTotalCoverages = () => {
    return data.coverages.reduce((sum, coverage) => sum + coverage.amount, 0);
  };

  const getTotalRemaining = () => {
    return data.coverages.reduce((sum, coverage) => sum + coverage.remaining, 0);
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
          إدارة التغطيات
        </h2>
        <p className="text-gray-600">إدارة التغطيات المالية والمبالغ المتبقية</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Coverages List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>قائمة التغطيات</CardTitle>
        </CardHeader>
        <CardContent>
          {data.coverages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد تغطيات مسجلة حتى الآن
            </div>
          ) : (
            <div className="space-y-3">
              {data.coverages.map((coverage) => (
                <div key={coverage.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                      <div>
                        <span className="text-gray-600 text-sm">مبلغ التغطية:</span>
                        <div className="font-semibold text-purple-600">{formatCurrency(coverage.amount)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">الباقي:</span>
                        <div className="font-semibold text-orange-600">{formatCurrency(coverage.remaining)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">وصل منها:</span>
                        <div className="font-semibold text-gray-800">{coverage.receivedFrom}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">وصل له:</span>
                        <div className="font-semibold text-gray-800">{coverage.receivedBy}</div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCoverage(coverage.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-4"
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

export default CoveragesSection;
