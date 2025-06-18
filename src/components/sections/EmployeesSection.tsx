
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Briefcase, Users } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import { Employee } from '@/types/accounting';

const EmployeesSection = () => {
  const { data, updateEmployees } = useAccountingData();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    salary: '',
    advances: ''
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.salary) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        salary: parseFloat(newEmployee.salary),
        advances: parseFloat(newEmployee.advances) || 0
      };
      
      updateEmployees([...data.employees, employee]);
      setNewEmployee({ name: '', salary: '', advances: '' });
    }
  };

  const handleDeleteEmployee = (id: string) => {
    updateEmployees(data.employees.filter(employee => employee.id !== id));
  };

  const getTotalSalaries = () => {
    return data.employees.reduce((sum, employee) => sum + employee.salary, 0);
  };

  const getTotalAdvances = () => {
    return data.employees.reduce((sum, employee) => sum + employee.advances, 0);
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          إدارة الموظفين
        </h2>
        <p className="text-gray-600">إدارة بيانات الموظفين والرواتب والسلفيات</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Employees List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          {data.employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا يوجد موظفين مسجلين حتى الآن
            </div>
          ) : (
            <div className="space-y-3">
              {data.employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{employee.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">الراتب: </span>
                        <span className="font-semibold text-blue-600">{formatCurrency(employee.salary)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">السلف: </span>
                        <span className="font-semibold text-red-600">{formatCurrency(employee.advances)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">الصافي</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(employee.salary - employee.advances)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesSection;
