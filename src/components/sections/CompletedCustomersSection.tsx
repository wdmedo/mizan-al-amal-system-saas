
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, UserCheck, Calculator } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import { CompletedCustomer } from '@/types/accounting';

const CompletedCustomersSection = () => {
  const { data, updateCompletedCustomers } = useAccountingData();
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    totalPayment: '',
    fixedInterest: '',
    amount: '',
    brokerPercentage: '',
    productDifference: ''
  });

  const calculateNetProfit = (customer: any) => {
    const totalPayment = parseFloat(customer.totalPayment) || 0;
    const fixedInterest = parseFloat(customer.fixedInterest) || 0;
    const amount = parseFloat(customer.amount) || 0;
    const brokerPercentage = parseFloat(customer.brokerPercentage) || 0;
    const productDifference = parseFloat(customer.productDifference) || 0;
    
    return totalPayment + fixedInterest - amount - (amount * brokerPercentage / 100) + productDifference;
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.idNumber && newCustomer.phoneNumber) {
      const customer: CompletedCustomer = {
        id: Date.now().toString(),
        name: newCustomer.name,
        idNumber: newCustomer.idNumber,
        phoneNumber: newCustomer.phoneNumber,
        totalPayment: parseFloat(newCustomer.totalPayment) || 0,
        fixedInterest: parseFloat(newCustomer.fixedInterest) || 0,
        amount: parseFloat(newCustomer.amount) || 0,
        brokerPercentage: parseFloat(newCustomer.brokerPercentage) || 0,
        productDifference: parseFloat(newCustomer.productDifference) || 0,
        netProfit: calculateNetProfit(newCustomer)
      };
      
      updateCompletedCustomers([...data.completedCustomers, customer]);
      setNewCustomer({
        name: '',
        idNumber: '',
        phoneNumber: '',
        totalPayment: '',
        fixedInterest: '',
        amount: '',
        brokerPercentage: '',
        productDifference: ''
      });
    }
  };

  const handleDeleteCustomer = (id: string) => {
    updateCompletedCustomers(data.completedCustomers.filter(customer => customer.id !== id));
  };

  const getTotalNetProfit = () => {
    return data.completedCustomers.reduce((sum, customer) => sum + customer.netProfit, 0);
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          العملاء الخالصين
        </h2>
        <p className="text-gray-600">إدارة العملاء المكتملين وحساب الأرباح النهائية</p>
      </div>

      {/* Total Net Profit */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <UserCheck className="h-5 w-5" />
            صافي أرباح العملاء الخالصين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(getTotalNetProfit())}
            </div>
            <p className="text-gray-600">إجمالي الأرباح الصافية</p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Customer */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة عميل خالص جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="اسم العميل"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="idNumber">رقم الهوية</Label>
              <Input
                id="idNumber"
                placeholder="رقم الهوية"
                value={newCustomer.idNumber}
                onChange={(e) => setNewCustomer({ ...newCustomer, idNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">رقم الجوال</Label>
              <Input
                id="phoneNumber"
                placeholder="رقم الجوال"
                value={newCustomer.phoneNumber}
                onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Financial Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalPayment">إجمالي سداد العميل</Label>
              <Input
                id="totalPayment"
                type="number"
                placeholder="0.00"
                value={newCustomer.totalPayment}
                onChange={(e) => setNewCustomer({ ...newCustomer, totalPayment: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fixedInterest">الفائدة الثابتة</Label>
              <Input
                id="fixedInterest"
                type="number"
                placeholder="0.00"
                value={newCustomer.fixedInterest}
                onChange={(e) => setNewCustomer({ ...newCustomer, fixedInterest: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="amount">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newCustomer.amount}
                onChange={(e) => setNewCustomer({ ...newCustomer, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="brokerPercentage">نسبة الوسيط (%)</Label>
              <Input
                id="brokerPercentage"
                type="number"
                placeholder="0"
                value={newCustomer.brokerPercentage}
                onChange={(e) => setNewCustomer({ ...newCustomer, brokerPercentage: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="productDifference">فرق السلعة</Label>
              <Input
                id="productDifference"
                type="number"
                placeholder="0.00"
                value={newCustomer.productDifference}
                onChange={(e) => setNewCustomer({ ...newCustomer, productDifference: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <Label>الصافي المتوقع</Label>
                <div className="p-2 bg-gray-100 rounded-md text-center font-semibold text-green-600">
                  {formatCurrency(calculateNetProfit(newCustomer))}
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddCustomer}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة عميل خالص
          </Button>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {data.completedCustomers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-8 text-gray-500">
              لا يوجد عملاء خالصين حتى الآن
            </CardContent>
          </Card>
        ) : (
          data.completedCustomers.map((customer) => (
            <Card key={customer.id} className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      الهوية: {customer.idNumber} | الجوال: {customer.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-sm text-gray-600">صافي الربح</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(customer.netProfit)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">إجمالي السداد</div>
                    <div className="font-semibold text-blue-600">{formatCurrency(customer.totalPayment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">الفائدة الثابتة</div>
                    <div className="font-semibold text-green-600">{formatCurrency(customer.fixedInterest)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">المبلغ</div>
                    <div className="font-semibold text-red-600">{formatCurrency(customer.amount)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">نسبة الوسيط</div>
                    <div className="font-semibold text-orange-600">{customer.brokerPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">فرق السلعة</div>
                    <div className="font-semibold text-purple-600">{formatCurrency(customer.productDifference)}</div>
                  </div>
                  <div className="md:col-span-3 lg:col-span-1">
                    <div className="text-gray-600">الصافي</div>
                    <div className="font-bold text-green-600 text-lg">{formatCurrency(customer.netProfit)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedCustomersSection;
