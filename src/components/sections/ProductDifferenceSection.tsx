
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Package, TrendingUp } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const ProductDifferenceSection = () => {
  const { data, addProductDifference, deleteProductDifference } = useAccountingData();
  const [newProductDifference, setNewProductDifference] = useState({
    customerId: '',
    customerName: '',
    amount: '',
    description: ''
  });

  const handleAddProductDifference = () => {
    if (newProductDifference.customerName && newProductDifference.amount) {
      addProductDifference({
        customerId: newProductDifference.customerId || crypto.randomUUID(),
        customerName: newProductDifference.customerName,
        amount: parseFloat(newProductDifference.amount),
        description: newProductDifference.description || 'فرق سلعة',
        date: new Date().toISOString().split('T')[0]
      });
      
      setNewProductDifference({ customerId: '', customerName: '', amount: '', description: '' });
    }
  };

  const getTotalProductDifference = () => {
    return data.productDifferences?.reduce((sum, item) => sum + item.amount, 0) || 0;
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            إدارة فرق السلعة
          </h2>
          <PrintButton printableElementId="product-difference-content" />
        </div>
        <p className="text-gray-600">إدارة فروق السلع للعملاء</p>
      </div>

      <div id="product-difference-content">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Package className="h-5 w-5" />
              إجمالي فرق السلعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(getTotalProductDifference())}
              </div>
              <p className="text-gray-600 text-sm">مجموع جميع فروق السلع</p>
            </div>
          </CardContent>
        </Card>

        {/* Product Differences List */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>قائمة فروق السلع</CardTitle>
          </CardHeader>
          <CardContent>
            {(!data.productDifferences || data.productDifferences.length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد فروق سلع مسجلة حتى الآن
              </div>
            ) : (
              <div className="space-y-4">
                {data.productDifferences.map((item) => (
                  <div key={item.id} className="p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">{item.customerName}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProductDifference(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-gray-600 text-sm block">المبلغ:</span>
                        <span className="font-bold text-green-600 text-lg">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-gray-600 text-sm block">التاريخ:</span>
                        <span className="font-semibold text-gray-800">{formatDate(item.date)}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-gray-600 text-sm block">رقم العميل:</span>
                        <span className="font-semibold text-gray-800 text-xs">{item.customerId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add New Product Difference */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة فرق سلعة جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-name">اسم العميل</Label>
              <Input
                id="customer-name"
                placeholder="اسم العميل"
                value={newProductDifference.customerName}
                onChange={(e) => setNewProductDifference({ ...newProductDifference, customerName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="amount">مبلغ فرق السلعة</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newProductDifference.amount}
                onChange={(e) => setNewProductDifference({ ...newProductDifference, amount: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                placeholder="وصف فرق السلعة"
                value={newProductDifference.description}
                onChange={(e) => setNewProductDifference({ ...newProductDifference, description: e.target.value })}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddProductDifference}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة فرق سلعة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDifferenceSection;
