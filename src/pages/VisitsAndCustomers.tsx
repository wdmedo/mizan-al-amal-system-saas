import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisitsAndCustomersProps {
  onBack: () => void;
}

interface DailyVisit {
  id: string;
  day: string;
  date: string;
  customerName: string;
  customerPhone: string;
  mediator: string;
  receptionEmployee: string;
  bank: string;
  notes: string;
}

interface CustomerFollowUp {
  id: string;
  name: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
}

const VisitsAndCustomers = ({ onBack }: VisitsAndCustomersProps) => {
  const { toast } = useToast();
  
  // Daily visits state
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([
    {
      id: '1',
      day: 'الأحد',
      date: '03/08/2025',
      customerName: '',
      customerPhone: '',
      mediator: '',
      receptionEmployee: '',
      bank: '',
      notes: ''
    }
  ]);

  // Customer follow-up state
  const [customerFollowUps, setCustomerFollowUps] = useState<CustomerFollowUp[]>([
    {
      id: '1',
      name: '',
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: ''
    }
  ]);

  const addDailyVisitRow = () => {
    const newVisit: DailyVisit = {
      id: Date.now().toString(),
      day: '',
      date: '',
      customerName: '',
      customerPhone: '',
      mediator: '',
      receptionEmployee: '',
      bank: '',
      notes: ''
    };
    setDailyVisits([...dailyVisits, newVisit]);
  };

  const addCustomerFollowUpRow = () => {
    const newFollowUp: CustomerFollowUp = {
      id: Date.now().toString(),
      name: '',
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: ''
    };
    setCustomerFollowUps([...customerFollowUps, newFollowUp]);
  };

  const updateDailyVisit = (id: string, field: keyof DailyVisit, value: string) => {
    setDailyVisits(visits => 
      visits.map(visit => 
        visit.id === id ? { ...visit, [field]: value } : visit
      )
    );
  };

  const updateCustomerFollowUp = (id: string, field: keyof CustomerFollowUp, value: string) => {
    setCustomerFollowUps(followUps => 
      followUps.map(followUp => 
        followUp.id === id ? { ...followUp, [field]: value } : followUp
      )
    );
  };

  const saveDailyVisits = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ بيانات الكشف اليومي للعملاء",
    });
  };

  const saveCustomerFollowUps = () => {
    toast({
      title: "تم الحفظ بنجاح", 
      description: "تم حفظ بيانات متابعة العملاء",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="hover:bg-blue-100"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              متابعة الزيارات والعملاء
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Daily Visits Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  الكشف اليومي للعملاء (زيارة المكان)
                </CardTitle>
                <CardDescription className="text-gray-600">
                  تسجيل ومتابعة زيارات العملاء اليومية
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={addDailyVisitRow} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة صف
                </Button>
                <Button onClick={saveDailyVisits} variant="outline" size="sm">
                  حفظ البيانات
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="text-center font-bold">اليوم</TableHead>
                    <TableHead className="text-center font-bold">التاريخ</TableHead>
                    <TableHead className="text-center font-bold">اسم العميل</TableHead>
                    <TableHead className="text-center font-bold">جوال العميل</TableHead>
                    <TableHead className="text-center font-bold">الوسيط</TableHead>
                    <TableHead className="text-center font-bold">موظف الاستقبال</TableHead>
                    <TableHead className="text-center font-bold">البنك</TableHead>
                    <TableHead className="text-center font-bold">لصالح</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyVisits.map((visit) => (
                    <TableRow key={visit.id} className="hover:bg-blue-25">
                      <TableCell>
                        <Input
                          value={visit.day}
                          onChange={(e) => updateDailyVisit(visit.id, 'day', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="اليوم"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={visit.date}
                          onChange={(e) => updateDailyVisit(visit.id, 'date', e.target.value)}
                          className="text-center border-0 bg-transparent"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.customerName}
                          onChange={(e) => updateDailyVisit(visit.id, 'customerName', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="اسم العميل"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.customerPhone}
                          onChange={(e) => updateDailyVisit(visit.id, 'customerPhone', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="رقم الجوال"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.mediator}
                          onChange={(e) => updateDailyVisit(visit.id, 'mediator', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="الوسيط"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.receptionEmployee}
                          onChange={(e) => updateDailyVisit(visit.id, 'receptionEmployee', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="موظف الاستقبال"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.bank}
                          onChange={(e) => updateDailyVisit(visit.id, 'bank', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="البنك"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={visit.notes}
                          onChange={(e) => updateDailyVisit(visit.id, 'notes', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="ملاحظات"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Follow-up Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  متابعة العملاء (12/07/2025)
                </CardTitle>
                <CardDescription className="text-gray-600">
                  متابعة حالة العملاء خلال أيام الأسبوع
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCustomerFollowUpRow} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عميل
                </Button>
                <Button onClick={saveCustomerFollowUps} variant="outline" size="sm">
                  حفظ البيانات
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="text-center font-bold">الاسم</TableHead>
                    <TableHead className="text-center font-bold">الأحد</TableHead>
                    <TableHead className="text-center font-bold">الاثنين</TableHead>
                    <TableHead className="text-center font-bold">الثلاثاء</TableHead>
                    <TableHead className="text-center font-bold">الأربعاء</TableHead>
                    <TableHead className="text-center font-bold">الخميس</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerFollowUps.map((followUp) => (
                    <TableRow key={followUp.id} className="hover:bg-purple-25">
                      <TableCell>
                        <Input
                          value={followUp.name}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'name', e.target.value)}
                          className="text-center border-0 bg-transparent font-medium"
                          placeholder="اسم العميل"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={followUp.sunday}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'sunday', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="حالة الأحد"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={followUp.monday}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'monday', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="حالة الاثنين"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={followUp.tuesday}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'tuesday', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="حالة الثلاثاء"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={followUp.wednesday}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'wednesday', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="حالة الأربعاء"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={followUp.thursday}
                          onChange={(e) => updateCustomerFollowUp(followUp.id, 'thursday', e.target.value)}
                          className="text-center border-0 bg-transparent"
                          placeholder="حالة الخميس"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitsAndCustomers;