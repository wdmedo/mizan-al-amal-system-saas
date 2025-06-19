
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users, CreditCard } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import { PendingCustomer, Payment } from '@/types/accounting';

const PendingCustomersSection = () => {
  const { data, addPendingCustomer, deletePendingCustomer, addPayment, deletePayment } = useAccountingData();
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    idNumber: '',
    phoneNumber: ''
  });
  const [newPayment, setNewPayment] = useState({
    customerId: '',
    amount: '',
    source: ''
  });

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.idNumber && newCustomer.phoneNumber) {
      addPendingCustomer(newCustomer);
      setNewCustomer({ name: '', idNumber: '', phoneNumber: '' });
    }
  };

  const handleAddPayment = () => {
    if (newPayment.customerId && newPayment.amount && newPayment.source) {
      addPayment({
        customerId: newPayment.customerId,
        amount: parseFloat(newPayment.amount),
        source: newPayment.source
      });
      setNewPayment({ customerId: '', amount: '', source: '' });
    }
  };

  const handleDeleteCustomer = (id: string) => {
    deletePendingCustomer(id);
  };

  const handleDeletePayment = (paymentId: string) => {
    deletePayment(paymentId);
  };

  const getCustomerTotal = (customer: PendingCustomer) => {
    return customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalPendingPayments = () => {
    return data.pendingCustomers.reduce((sum, customer) => sum + getCustomerTotal(customer), 0);
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
          العملاء المعلقين
        </h2>
        <p className="text-gray-600">إدارة العملاء ومدفوعاتهم المعلقة</p>
      </div>

      {/* Total Pending Payments */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Users className="h-5 w-5" />
            إجمالي مدفوعات العملاء المعلقين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {formatCurrency(getTotalPendingPayments())}
            </div>
            <p className="text-gray-600">المجموع الكلي لجميع المدفوعات</p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Customer */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة عميل جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button 
            onClick={handleAddCustomer}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة عميل
          </Button>
        </CardContent>
      </Card>

      {/* Add Payment */}
      {data.pendingCustomers.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إضافة دفعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customer">العميل</Label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPayment.customerId}
                  onChange={(e) => setNewPayment({ ...newPayment, customerId: e.target.value })}
                >
                  <option value="">اختر العميل</option>
                  {data.pendingCustomers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="paymentAmount">المبلغ</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  placeholder="0.00"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="source">الجهة</Label>
                <Input
                  id="source"
                  placeholder="جهة الدفع"
                  value={newPayment.source}
                  onChange={(e) => setNewPayment({ ...newPayment, source: e.target.value })}
                />
              </div>
            </div>
            <Button 
              onClick={handleAddPayment}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة دفعة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Customers List */}
      <div className="space-y-4">
        {data.pendingCustomers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-8 text-gray-500">
              لا يوجد عملاء معلقين حتى الآن
            </CardContent>
          </Card>
        ) : (
          data.pendingCustomers.map((customer) => (
            <Card key={customer.id} className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      الهوية: {customer.idNumber} | الجوال: {customer.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-sm text-gray-600">إجمالي السداد</div>
                      <div className="text-xl font-bold text-orange-600">
                        {formatCurrency(getCustomerTotal(customer))}
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
                {customer.payments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد دفعات مسجلة</p>
                ) : (
                  <div className="space-y-2">
                    {customer.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                          <span className="text-gray-600">{payment.source}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePayment(payment.id)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default PendingCustomersSection;
