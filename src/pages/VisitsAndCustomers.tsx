import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, ArrowLeft, Search, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VisitsAndCustomersProps {
  onBack: () => void;
}

interface DailyVisit {
  id?: string;
  day: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  mediator: string;
  reception_employee: string;
  bank: string;
  notes: string;
}

interface CustomerFollowUp {
  id?: string;
  customer_name: string;
  sunday_status: string;
  monday_status: string;
  tuesday_status: string;
  wednesday_status: string;
  thursday_status: string;
  follow_date: string;
}

const VisitsAndCustomers = ({ onBack }: VisitsAndCustomersProps) => {
  const { toast } = useToast();
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState<Date | undefined>(new Date());
  
  // Daily visits state
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [filteredDailyVisits, setFilteredDailyVisits] = useState<DailyVisit[]>([]);

  // Customer follow-up state
  const [customerFollowUps, setCustomerFollowUps] = useState<CustomerFollowUp[]>([]);
  const [filteredCustomerFollowUps, setFilteredCustomerFollowUps] = useState<CustomerFollowUp[]>([]);

  // Loading states
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDailyVisits();
    loadCustomerFollowUps();
  }, []);

  // Filter data when search term or date changes
  useEffect(() => {
    filterDailyVisits();
  }, [searchTerm, searchDate, dailyVisits]);

  useEffect(() => {
    filterCustomerFollowUps();
  }, [searchTerm, customerFollowUps]);

  const filterDailyVisits = () => {
    let filtered = dailyVisits;
    
    if (searchTerm) {
      filtered = filtered.filter(visit => 
        visit.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.customer_phone.includes(searchTerm) ||
        visit.mediator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.bank.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (searchDate) {
      const formattedDate = format(searchDate, 'yyyy-MM-dd');
      filtered = filtered.filter(visit => visit.date === formattedDate);
    }
    
    setFilteredDailyVisits(filtered);
  };

  const filterCustomerFollowUps = () => {
    let filtered = customerFollowUps;
    
    if (searchTerm) {
      filtered = filtered.filter(followUp => 
        followUp.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomerFollowUps(filtered);
  };

  const loadDailyVisits = async () => {
    setIsLoadingVisits(true);
    try {
      const { data, error } = await supabase
        .from('daily_visits')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setDailyVisits(data || []);
    } catch (error) {
      console.error('Error loading daily visits:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات الزيارات اليومية",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVisits(false);
    }
  };

  const loadCustomerFollowUps = async () => {
    setIsLoadingFollowUps(true);
    try {
      const { data, error } = await supabase
        .from('customer_followups')
        .select('*')
        .order('follow_date', { ascending: false });

      if (error) throw error;
      setCustomerFollowUps(data || []);
    } catch (error) {
      console.error('Error loading customer follow-ups:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات متابعة العملاء",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFollowUps(false);
    }
  };

  const addDailyVisitRow = () => {
    const newVisit: DailyVisit = {
      day: '',
      date: searchDate ? format(searchDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      customer_name: '',
      customer_phone: '',
      mediator: '',
      reception_employee: '',
      bank: '',
      notes: ''
    };
    setDailyVisits([...dailyVisits, newVisit]);
  };

  const addCustomerFollowUpRow = () => {
    const newFollowUp: CustomerFollowUp = {
      customer_name: '',
      sunday_status: '',
      monday_status: '',
      tuesday_status: '',
      wednesday_status: '',
      thursday_status: '',
      follow_date: format(new Date(), 'yyyy-MM-dd')
    };
    setCustomerFollowUps([...customerFollowUps, newFollowUp]);
  };

  const updateDailyVisit = (filteredIndex: number, field: keyof DailyVisit, value: string) => {
    const visitToUpdate = filteredDailyVisits[filteredIndex];
    if (!visitToUpdate) return;
    
    // Find the original index in the dailyVisits array
    const originalIndex = dailyVisits.findIndex(visit => 
      visitToUpdate.id ? visit.id === visitToUpdate.id : 
      visit.date === visitToUpdate.date && 
      visit.customer_name === visitToUpdate.customer_name && 
      visit.customer_phone === visitToUpdate.customer_phone
    );
    
    if (originalIndex === -1) return;
    
    const updatedVisits = [...dailyVisits];
    updatedVisits[originalIndex] = { ...updatedVisits[originalIndex], [field]: value };
    setDailyVisits(updatedVisits);
  };

  const updateCustomerFollowUp = (filteredIndex: number, field: keyof CustomerFollowUp, value: string) => {
    const followUpToUpdate = filteredCustomerFollowUps[filteredIndex];
    if (!followUpToUpdate) return;
    
    // Find the original index in the customerFollowUps array
    const originalIndex = customerFollowUps.findIndex(followUp => 
      followUpToUpdate.id ? followUp.id === followUpToUpdate.id : 
      followUp.customer_name === followUpToUpdate.customer_name && 
      followUp.follow_date === followUpToUpdate.follow_date
    );
    
    if (originalIndex === -1) return;
    
    const updatedFollowUps = [...customerFollowUps];
    updatedFollowUps[originalIndex] = { ...updatedFollowUps[originalIndex], [field]: value };
    setCustomerFollowUps(updatedFollowUps);
  };

  const saveDailyVisits = async () => {
    try {
      console.log('Starting to save daily visits:', dailyVisits);
      
      // Filter out empty visits
      const validVisits = dailyVisits.filter(visit => 
        visit.customer_name.trim() !== '' || 
        visit.customer_phone.trim() !== ''
      );

      console.log('Valid visits:', validVisits);

      if (validVisits.length === 0) {
        toast({
          title: "تنبيه",
          description: "لا توجد بيانات صالحة للحفظ",
          variant: "destructive",
        });
        return;
      }

      // Separate new visits from existing ones
      const newVisits = validVisits.filter(visit => !visit.id);
      const existingVisits = validVisits.filter(visit => visit.id);

      console.log('New visits to insert:', newVisits);
      console.log('Existing visits to update:', existingVisits);

      // Insert new visits
      if (newVisits.length > 0) {
        const insertData = newVisits.map(({ id, ...visit }) => visit);
        console.log('Inserting data:', insertData);
        
        const { data, error: insertError } = await supabase
          .from('daily_visits')
          .insert(insertData)
          .select();
        
        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        
        console.log('Insert successful:', data);
      }

      // Update existing visits
      for (const visit of existingVisits) {
        const { id, ...visitData } = visit;
        console.log('Updating visit with id:', id, 'data:', visitData);
        
        const { error: updateError } = await supabase
          .from('daily_visits')
          .update(visitData)
          .eq('id', id);
        
        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات الكشف اليومي للعملاء",
      });
      
      loadDailyVisits(); // Reload data
    } catch (error) {
      console.error('Error saving daily visits:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ بيانات الكشف اليومي",
        variant: "destructive",
      });
    }
  };

  const saveCustomerFollowUps = async () => {
    try {
      // Filter out empty follow-ups
      const validFollowUps = customerFollowUps.filter(followUp => 
        followUp.customer_name.trim() !== ''
      );

      if (validFollowUps.length === 0) {
        toast({
          title: "تنبيه",
          description: "لا توجد بيانات صالحة للحفظ",
          variant: "destructive",
        });
        return;
      }

      // Separate new follow-ups from existing ones
      const newFollowUps = validFollowUps.filter(followUp => !followUp.id);
      const existingFollowUps = validFollowUps.filter(followUp => followUp.id);

      // Insert new follow-ups
      if (newFollowUps.length > 0) {
        const { error: insertError } = await supabase
          .from('customer_followups')
          .insert(newFollowUps.map(({ id, ...followUp }) => followUp));
        
        if (insertError) throw insertError;
      }

      // Update existing follow-ups
      for (const followUp of existingFollowUps) {
        const { id, ...followUpData } = followUp;
        const { error: updateError } = await supabase
          .from('customer_followups')
          .update(followUpData)
          .eq('id', id);
        
        if (updateError) throw updateError;
      }

      toast({
        title: "تم الحفظ بنجاح", 
        description: "تم حفظ بيانات متابعة العملاء",
      });
      
      loadCustomerFollowUps(); // Reload data
    } catch (error) {
      console.error('Error saving customer follow-ups:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ بيانات متابعة العملاء",
        variant: "destructive",
      });
    }
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
          <div className="flex items-center gap-4">
            {/* Search Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في البيانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-40 justify-start text-right"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {searchDate ? format(searchDate, "dd/MM/yyyy") : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchDate}
                    onSelect={setSearchDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
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
                    <TableHead className="text-center font-bold">حالته</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingVisits ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        جاري تحميل البيانات...
                      </TableCell>
                    </TableRow>
                  ) : filteredDailyVisits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        لا توجد بيانات للعرض
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDailyVisits.map((visit, index) => (
                      <TableRow key={visit.id || index} className="hover:bg-blue-25">
                        <TableCell>
                          <Input
                            value={visit.day}
                            onChange={(e) => updateDailyVisit(index, 'day', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="اليوم"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={visit.date}
                            onChange={(e) => updateDailyVisit(index, 'date', e.target.value)}
                            className="text-center border-0 bg-transparent"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={visit.customer_name}
                            onChange={(e) => updateDailyVisit(index, 'customer_name', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="اسم العميل"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={visit.customer_phone}
                            onChange={(e) => updateDailyVisit(index, 'customer_phone', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="رقم الجوال"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={visit.mediator}
                            onChange={(e) => updateDailyVisit(index, 'mediator', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="الوسيط"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={visit.reception_employee}
                            onChange={(e) => updateDailyVisit(index, 'reception_employee', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="موظف الاستقبال"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={visit.bank}
                            onChange={(e) => updateDailyVisit(index, 'bank', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="البنك"
                          />
                        </TableCell>
                         <TableCell>
                           <Textarea
                             value={visit.notes}
                             onChange={(e) => updateDailyVisit(index, 'notes', e.target.value)}
                             className="text-center border-0 bg-transparent min-h-[60px] resize-none"
                             placeholder="حالة العميل"
                           />
                         </TableCell>
                      </TableRow>
                    ))
                  )}
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
                  متابعة العملاء
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
                  {isLoadingFollowUps ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        جاري تحميل البيانات...
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomerFollowUps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا توجد بيانات للعرض
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomerFollowUps.map((followUp, index) => (
                      <TableRow key={followUp.id || index} className="hover:bg-purple-25">
                        <TableCell>
                          <Input
                            value={followUp.customer_name}
                            onChange={(e) => updateCustomerFollowUp(index, 'customer_name', e.target.value)}
                            className="text-center border-0 bg-transparent font-medium"
                            placeholder="اسم العميل"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={followUp.sunday_status}
                            onChange={(e) => updateCustomerFollowUp(index, 'sunday_status', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="حالة الأحد"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={followUp.monday_status}
                            onChange={(e) => updateCustomerFollowUp(index, 'monday_status', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="حالة الاثنين"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={followUp.tuesday_status}
                            onChange={(e) => updateCustomerFollowUp(index, 'tuesday_status', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="حالة الثلاثاء"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={followUp.wednesday_status}
                            onChange={(e) => updateCustomerFollowUp(index, 'wednesday_status', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="حالة الأربعاء"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={followUp.thursday_status}
                            onChange={(e) => updateCustomerFollowUp(index, 'thursday_status', e.target.value)}
                            className="text-center border-0 bg-transparent"
                            placeholder="حالة الخميس"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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