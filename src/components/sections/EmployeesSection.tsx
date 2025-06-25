
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Briefcase, Users } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import PrintButton from '@/components/PrintButton';

const EmployeesSection = () => {
  const { data, addEmployee, deleteEmployee } = useAccountingData();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    salary: '',
    advances: ''
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
        <p className="text-gray-600">إدارة بيانات الموظفين والرواتب والسلفيات</p>
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
              <div className="space-y-4">
                {data.employees.map((employee) => {
                  const employeeAccount = getEmployeeBalance(employee.salary, employee.advances);
                  return (
                    <div key={employee.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-800">{employee.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">الراتب الشهري:</span>
                          <span className="font-bold text-blue-600 text-lg">{formatCurrency(employee.salary)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-gray-600 text-sm block">إجمالي السلف:</span>
                          <span className="font-bold text-red-600 text-lg">{formatCurrency(employee.advances)}</span>
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

                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-2">تفصيل الحساب:</h4>
                        <div className="text-sm text-gray-700">
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
              <Label htmlFor="advances">السلف</Label>
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
    </div>
  );
};

export default EmployeesSection;
