
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Briefcase, Users, DollarSign, CreditCard } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const EmployeesSection = () => {
  const { data, addEmployee, deleteEmployee, addEmployeeTransaction, deleteEmployeeTransaction } = useAccountingData();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    salary: '',
    advances: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'advance' as 'advance' | 'payment',
    description: ''
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.salary) {
      addEmployee({
        name: newEmployee.name,
        salary: parseFloat(newEmployee.salary),
        advances: parseFloat(newEmployee.advances) || 0,
        transactions: []
      });
      
      setNewEmployee({ name: '', salary: '', advances: '' });
    }
  };

  const handleAddTransaction = () => {
    if (selectedEmployee && newTransaction.amount) {
      addEmployeeTransaction({
        employeeId: selectedEmployee,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        description: newTransaction.description || (newTransaction.type === 'advance' ? 'سلفة' : 'سداد'),
        date: new Date().toISOString().split('T')[0]
      });
      
      setNewTransaction({ amount: '', type: 'advance', description: '' });
      setSelectedEmployee(null);
    }
  };

  const getTotalSalaries = () => {
    return data.employees.reduce((sum, employee) => sum + employee.salary, 0);
  };

  const getTotalAdvances = () => {
    return data.employees.reduce((sum, employee) => sum + employee.advances, 0);
  };

  const getEmployeeBalance = (employee: any) => {
    const totalAdvances = employee.transactions?.reduce((sum: number, t: any) => 
      sum + (t.type === 'advance' ? t.amount : 0), employee.advances || 0
    ) || employee.advances || 0;
    
    const totalPayments = employee.transactions?.reduce((sum: number, t: any) => 
      sum + (t.type === 'payment' ? t.amount : 0), 0
    ) || 0;
    
    const balance = employee.salary - (totalAdvances - totalPayments);
    return { 
      balance, 
      status: balance >= 0 ? 'له' : 'عليه', 
      amount: Math.abs(balance),
      totalAdvances: totalAdvances - totalPayments,
      totalPayments
    };
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            إدارة الموظفين
          </h2>
          <PrintButton printableElementId="employees-content" />
        </div>
        <p className="text-gray-600">إدارة بيانات الموظفين والرواتب والسلفيات والمدفوعات</p>
      </div>

      <div id="employees-content">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="h-5 w-5" />
                إجمالي الرواتب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatCurrency(getTotalSalaries())}
                </div>
                <p className="text-gray-600 text-sm">مجموع رواتب جميع الموظفين</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Briefcase className="h-5 w-5" />
                إجمالي السلفيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {formatCurrency(getTotalAdvances())}
                </div>
                <p className="text-gray-600 text-sm">مجموع سلفيات جميع الموظفين</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>قائمة الموظفين وحساباتهم</CardTitle>
          </CardHeader>
          <CardContent>
            {data.employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا يوجد موظفين مسجلين حتى الآن
              </div>
            ) : (
              <div className="space-y-6">
                {data.employees.map((employee) => {
                  const employeeAccount = getEmployeeBalance(employee);
                  return (
                    <div key={employee.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-800">{employee.name}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployee(employee.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Plus className="h-4 w-4 ml-1" />
                            دفعة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">الراتب الشهري:</span>
                          <span className="font-bold text-blue-600 text-lg">{formatCurrency(employee.salary)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">إجمالي السلف:</span>
                          <span className="font-bold text-red-600 text-lg">{formatCurrency(employeeAccount.totalAdvances)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">إجمالي المدفوع:</span>
                          <span className="font-bold text-green-600 text-lg">{formatCurrency(employeeAccount.totalPayments)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">الحالة:</span>
                          <span className={`font-bold text-lg ${employeeAccount.status === 'له' ? 'text-green-600' : 'text-orange-600'}`}>
                            {employeeAccount.status}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">المبلغ:</span>
                          <span className={`font-bold text-lg ${employeeAccount.status === 'له' ? 'text-green-600' : 'text-orange-600'}`}>
                            {formatCurrency(employeeAccount.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Employee Transactions */}
                      {employee.transactions && employee.transactions.length > 0 && (
                        <div className="bg-white p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">سجل المعاملات:</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {employee.transactions.map((transaction) => (
                              <div key={transaction.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  {transaction.type === 'advance' ? (
                                    <CreditCard className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="text-sm text-gray-700">{transaction.description}</span>
                                  <span className="text-xs text-gray-500">({transaction.date})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${transaction.type === 'advance' ? 'text-red-600' : 'text-green-600'}`}>
                                    {transaction.type === 'advance' ? '-' : '+'}{formatCurrency(transaction.amount)}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteEmployeeTransaction(transaction.id)}
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
                        <h4 className="font-semibold text-gray-800 mb-2">تفصيل الحساب:</h4>
                        <div className="text-sm text-gray-700">
                          <p>الراتب الشهري: <span className="font-semibold text-blue-600">{formatCurrency(employee.salary)}</span></p>
                          <p>إجمالي السلف: <span className="font-semibold text-red-600">{formatCurrency(employeeAccount.totalAdvances)}</span></p>
                          <p>إجمالي المدفوع: <span className="font-semibold text-green-600">{formatCurrency(employeeAccount.totalPayments)}</span></p>
                          <hr className="my-2" />
                          <p className="font-bold">
                            المتبقي {employeeAccount.status}: <span className={employeeAccount.status === 'له' ? 'text-green-600' : 'text-orange-600'}>{formatCurrency(employeeAccount.amount)}</span>
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

      {/* Add New Employee */}
      <Card className="border-0 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة موظف جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="اسم الموظف"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="salary">الراتب</Label>
              <Input
                id="salary"
                type="number"
                placeholder="0.00"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="advances">السلف الحالية</Label>
              <Input
                id="advances"
                type="number"
                placeholder="0.00"
                value={newEmployee.advances}
                onChange={(e) => setNewEmployee({ ...newEmployee, advances: e.target.value })}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddEmployee}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة موظف
          </Button>
        </CardContent>
      </Card>

      {/* Add Employee Transaction Modal */}
      {selectedEmployee && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              إضافة معاملة مالية
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
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'advance' | 'payment' })}
                >
                  <option value="advance">سلفة</option>
                  <option value="payment">سداد</option>
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
                onClick={() => setSelectedEmployee(null)}
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

export default EmployeesSection;
