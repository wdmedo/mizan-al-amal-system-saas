
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Briefcase, Users, DollarSign, Calendar, FileText, Info } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmployeesSection = () => {
  const { data, addEmployee, deleteEmployee, addEmployeeTransaction, deleteEmployeeTransaction } = useAccountingData();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    salary: '',
    advances: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    employeeId: '',
    type: 'advance' as 'advance' | 'salary_payment' | 'deduction' | 'bonus',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.salary) {
      addEmployee({
        name: newEmployee.name,
        salary: parseFloat(newEmployee.salary),
        advances: parseFloat(newEmployee.advances) || 0
      });
      
      setNewEmployee({ name: '', salary: '', advances: '' });
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.employeeId && newTransaction.amount && newTransaction.description) {
      addEmployeeTransaction({
        employeeId: newTransaction.employeeId,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description,
        date: newTransaction.date
      });
      
      setNewTransaction({
        employeeId: '',
        type: 'advance',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const getTotalSalaries = () => {
    return data.employees.reduce((sum, employee) => sum + employee.salary, 0);
  };

  const getTotalAdvances = () => {
    return data.employees.reduce((sum, employee) => sum + employee.advances, 0);
  };

  const getEmployeeBalance = (salary: number, advances: number) => {
    const balance = salary - advances;
    return { balance, status: balance >= 0 ? 'له' : 'عليه', amount: Math.abs(balance) };
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'advance': return 'سلفة';
      case 'salary_payment': return 'دفعة راتب';
      case 'deduction': return 'خصم';
      case 'bonus': return 'مكافأة';
      default: return type;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'advance': return 'text-red-600';
      case 'salary_payment': return 'text-green-600';
      case 'deduction': return 'text-orange-600';
      case 'bonus': return 'text-blue-600';
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
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="text-center mb-4">
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            إدارة الموظفين
          </h2>
          <PrintButton printableElementId="employees-content" />
        </div>
        <p className="text-gray-600 text-sm">إدارة بيانات الموظفين والرواتب والسلفيات</p>
      </div>

      {/* Important Info Alert */}
      <Alert className="border-blue-200 bg-blue-50 mb-6">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <div className="space-y-2">
            <p className="font-semibold">ملاحظة مهمة: جميع معاملات الموظفين تتم من وإلى الحساب الرئيسي للبنك</p>
            <div className="text-sm">
              <p className="font-medium mb-1">مثال على حساب الموظف:</p>
              <p>• اسم الموظف: أحمد علي</p>
              <p>• الراتب الشهري: 5,000 ريال</p>
              <p>• إجمالي السلف: 2,000 ريال</p>
              <p>• المتبقي له: 3,000 ريال</p>
              <p className="text-xs mt-1 text-blue-600">* جميع المعاملات (سلف، دفعات، خصومات، مكافآت) تؤثر على الحساب الرئيسي</p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div id="employees-content">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-sm">
                <Users className="h-4 w-4" />
                إجمالي الرواتب
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(getTotalSalaries())}
                </div>
                <p className="text-gray-600 text-xs">مجموع رواتب جميع الموظفين</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-red-700 text-sm">
                <Briefcase className="h-4 w-4" />
                إجمالي السلفيات
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-red-600 mb-1">
                  {formatCurrency(getTotalAdvances())}
                </div>
                <p className="text-gray-600 text-xs">مجموع سلفيات جميع الموظفين</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Button */}
        <div className="mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-sm">
                <DollarSign className="h-4 w-4 ml-2" />
                إضافة معاملة مالية (من/إلى الحساب الرئيسي)
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-base">إضافة معاملة مالية جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="employee-select" className="text-sm">الموظف *</Label>
                  <Select value={newTransaction.employeeId} onValueChange={(value) => setNewTransaction({ ...newTransaction, employeeId: value })}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction-type" className="text-sm">نوع المعاملة *</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as any })}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">سلفة (خصم من البنك)</SelectItem>
                      <SelectItem value="salary_payment">دفعة راتب (خصم من البنك)</SelectItem>
                      <SelectItem value="deduction">خصم (إضافة للبنك)</SelectItem>
                      <SelectItem value="bonus">مكافأة (خصم من البنك)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction-amount" className="text-sm">المبلغ *</Label>
                  <Input
                    id="transaction-amount"
                    type="number"
                    placeholder="مثال: 1000"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-description" className="text-sm">الوصف *</Label>
                  <Input
                    id="transaction-description"
                    placeholder="مثال: سلفة شهر ديسمبر"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-date" className="text-sm">التاريخ *</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full text-sm">
                  إضافة المعاملة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Employees List */}
        <Card className="border-0 shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              قائمة الموظفين وحساباتهم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {data.employees.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                لا يوجد موظفين مسجلين حتى الآن
              </div>
            ) : (
              <div className="space-y-3">
                {data.employees.map((employee) => {
                  const employeeAccount = getEmployeeBalance(employee.salary, employee.advances);
                  const employeeTransactions = data.employeeTransactions.filter(t => t.employeeId === employee.id);
                  return (
                    <div key={employee.id} className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-base text-gray-800 flex-1 min-w-0 truncate">{employee.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-gray-600 text-xs block">الراتب الشهري:</span>
                          <span className="font-bold text-blue-600 text-sm">{formatCurrency(employee.salary)}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-gray-600 text-xs block">إجمالي السلف:</span>
                          <span className="font-bold text-red-600 text-sm">{formatCurrency(employee.advances)}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-gray-600 text-xs block">الحالة:</span>
                          <span className={`font-bold text-sm ${employeeAccount.status === 'له' ? 'text-green-600' : 'text-orange-600'}`}>
                            {employeeAccount.status}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-gray-600 text-xs block">المبلغ:</span>
                          <span className={`font-bold text-sm ${employeeAccount.status === 'له' ? 'text-green-600' : 'text-orange-600'}`}>
                            {formatCurrency(employeeAccount.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Employee Transactions */}
                      {employeeTransactions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">المعاملات المالية:</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {employeeTransactions.slice(0, 5).map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                                      {getTransactionTypeLabel(transaction.type)}
                                    </span>
                                    <span className="text-gray-600">
                                      {formatCurrency(transaction.amount)}
                                    </span>
                                  </div>
                                  <p className="text-gray-500 truncate">{transaction.description}</p>
                                  <p className="text-gray-400">{formatDate(transaction.date)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteEmployeeTransaction(transaction.id)}
                                  className="text-red-600 hover:text-red-700 p-1 ml-2"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-3 rounded-lg border-2 border-dashed border-gray-300 mt-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">تفصيل الحساب:</h4>
                        <div className="text-xs text-gray-700 space-y-1">
                          <p>الراتب الشهري: <span className="font-semibold text-blue-600">{formatCurrency(employee.salary)}</span></p>
                          <p>مطروح منه السلف: <span className="font-semibold text-red-600">{formatCurrency(employee.advances)}</span></p>
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            إضافة موظف جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm">الاسم *</Label>
              <Input
                id="name"
                placeholder="مثال: أحمد علي"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="salary" className="text-sm">الراتب الشهري *</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="مثال: 5000"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="advances" className="text-sm">السلف الأولية</Label>
                <Input
                  id="advances"
                  type="number"
                  placeholder="مثال: 1000"
                  value={newEmployee.advances}
                  onChange={(e) => setNewEmployee({ ...newEmployee, advances: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={handleAddEmployee}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-sm"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة موظف
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesSection;
