import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, ArrowLeft, Search, CalendarIcon, Download, FileImage, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const exportDailyVisitsToPDF = async () => {
    const element = document.getElementById('daily-visits-table');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      const imgWidth = 297; // A4 width in landscape
      const pageHeight = 210; // A4 height in landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`الكشف_اليومي_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير الكشف اليومي بصيغة PDF",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const exportDailyVisitsToImage = async () => {
    const element = document.getElementById('daily-visits-table');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `الكشف_اليومي_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير الكشف اليومي كصورة",
      });
    } catch (error) {
      console.error('Error exporting to image:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const exportFollowUpToPDF = async () => {
    const element = document.getElementById('customer-followups-table');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      const imgWidth = 297; // A4 width in landscape
      const pageHeight = 210; // A4 height in landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`متابعة_العملاء_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات المتابعة بصيغة PDF",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const exportFollowUpToImage = async () => {
    const element = document.getElementById('customer-followups-table');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `متابعة_العملاء_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات المتابعة كصورة",
      });
    } catch (error) {
      console.error('Error exporting to image:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="flex flex-col gap-4 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="hover:bg-blue-100"
              >
                <ArrowLeft className="h-4 w-4 ml-1 md:ml-2" />
                <span className="hidden sm:inline">العودة</span>
              </Button>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                متابعة الزيارات والعملاء
              </h1>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Users className="h-5 w-5 text-blue-600" />
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          
          {/* Search Controls - Mobile responsive */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:flex-none">
                <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في البيانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full sm:w-48 md:w-64"
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-40 justify-start text-right"
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
            
            <div className="hidden md:flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-3 md:p-6 space-y-6 md:space-y-8">
        {/* Daily Visits Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-bold text-blue-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                  الكشف اليومي للعملاء
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600 mt-1">
                  تسجيل ومتابعة زيارات العملاء اليومية
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button onClick={addDailyVisitRow} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة صف
                </Button>
                <Button onClick={saveDailyVisits} variant="outline" size="sm">
                  حفظ البيانات
                </Button>
                <Button onClick={exportDailyVisitsToPDF} variant="outline" size="sm" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                  <FileText className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
                <Button onClick={exportDailyVisitsToImage} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                  <FileImage className="h-4 w-4 ml-2" />
                  تصدير صورة
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
              <div className="min-w-[800px]" id="daily-visits-table">
                <Table className="border-2 border-blue-200">
                  <TableHeader>
                    <TableRow className="bg-blue-100 border-b-2 border-blue-300">
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[90px] border-r border-blue-200 text-blue-900">اليوم</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[110px] border-r border-blue-200 text-blue-900">التاريخ</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[140px] border-r border-blue-200 text-blue-900">اسم العميل</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] border-r border-blue-200 text-blue-900">جوال العميل</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[110px] border-r border-blue-200 text-blue-900">الوسيط</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[140px] border-r border-blue-200 text-blue-900">موظف الاستقبال</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[110px] border-r border-blue-200 text-blue-900">البنك</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[160px] text-blue-900">حالته</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {isLoadingVisits ? (
                    <TableRow className="bg-white">
                      <TableCell colSpan={8} className="text-center py-12 text-lg font-medium text-gray-600">
                        جاري تحميل البيانات...
                      </TableCell>
                    </TableRow>
                  ) : filteredDailyVisits.length === 0 ? (
                    <TableRow className="bg-white">
                      <TableCell colSpan={8} className="text-center py-12 text-lg font-medium text-gray-600">
                        لا توجد بيانات للعرض
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDailyVisits.map((visit, index) => (
                      <TableRow key={visit.id || index} className="hover:bg-blue-50 bg-white border-b border-blue-200">
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.day}
                             onChange={(e) => updateDailyVisit(index, 'day', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="اليوم"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             type="date"
                             value={visit.date}
                             onChange={(e) => updateDailyVisit(index, 'date', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.customer_name}
                             onChange={(e) => updateDailyVisit(index, 'customer_name', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="اسم العميل"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.customer_phone}
                             onChange={(e) => updateDailyVisit(index, 'customer_phone', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="رقم الجوال"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.mediator}
                             onChange={(e) => updateDailyVisit(index, 'mediator', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="الوسيط"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.reception_employee}
                             onChange={(e) => updateDailyVisit(index, 'reception_employee', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="موظف الاستقبال"
                           />
                         </TableCell>
                         <TableCell className="px-2 md:px-3 py-3 border-r border-blue-200">
                           <Input
                             value={visit.bank}
                             onChange={(e) => updateDailyVisit(index, 'bank', e.target.value)}
                             className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-blue-400 focus:bg-white"
                             placeholder="البنك"
                           />
                         </TableCell>
                          <TableCell className="px-2 md:px-3 py-3">
                            <Textarea
                              value={visit.notes}
                              onChange={(e) => updateDailyVisit(index, 'notes', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-blue-400 focus:bg-white"
                              placeholder="حالة العميل"
                            />
                          </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                 </Table>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Customer Follow-up Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-bold text-purple-700 flex items-center gap-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  متابعة العملاء
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600 mt-1">
                  متابعة حالة العملاء خلال أيام الأسبوع
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button onClick={addCustomerFollowUpRow} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عميل
                </Button>
                <Button onClick={saveCustomerFollowUps} variant="outline" size="sm">
                  حفظ البيانات
                </Button>
                <Button onClick={exportFollowUpToPDF} variant="outline" size="sm" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                  <FileText className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
                <Button onClick={exportFollowUpToImage} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                  <FileImage className="h-4 w-4 ml-2" />
                  تصدير صورة
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-100">
              <div className="min-w-[700px]" id="customer-followups-table">
                <Table className="border-2 border-purple-200">
                  <TableHeader>
                    <TableRow className="bg-purple-100 border-b-2 border-purple-300">
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[140px] border-r border-purple-200 text-purple-900">اسم العميل</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] border-r border-purple-200 text-purple-900">الأحد</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] border-r border-purple-200 text-purple-900">الاثنين</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] border-r border-purple-200 text-purple-900">الثلاثاء</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] border-r border-purple-200 text-purple-900">الأربعاء</TableHead>
                      <TableHead className="text-center font-bold text-sm md:text-base px-3 py-4 min-w-[120px] text-purple-900">الخميس</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingFollowUps ? (
                      <TableRow className="bg-white">
                        <TableCell colSpan={6} className="text-center py-12 text-lg font-medium text-gray-600">
                          جاري تحميل البيانات...
                        </TableCell>
                      </TableRow>
                    ) : filteredCustomerFollowUps.length === 0 ? (
                      <TableRow className="bg-white">
                        <TableCell colSpan={6} className="text-center py-12 text-lg font-medium text-gray-600">
                          لا توجد بيانات للعرض
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomerFollowUps.map((followUp, index) => (
                        <TableRow key={followUp.id || index} className="hover:bg-purple-50 bg-white border-b border-purple-200">
                          <TableCell className="px-2 md:px-3 py-3 border-r border-purple-200">
                            <Input
                              value={followUp.customer_name}
                              onChange={(e) => updateCustomerFollowUp(index, 'customer_name', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 text-sm md:text-base font-medium h-12 focus:border-purple-400 focus:bg-white"
                              placeholder="اسم العميل"
                            />
                          </TableCell>
                          <TableCell className="px-2 md:px-3 py-3 border-r border-purple-200">
                            <Textarea
                              value={followUp.sunday_status}
                              onChange={(e) => updateCustomerFollowUp(index, 'sunday_status', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-purple-400 focus:bg-white"
                              placeholder="حالة الأحد"
                            />
                          </TableCell>
                          <TableCell className="px-2 md:px-3 py-3 border-r border-purple-200">
                            <Textarea
                              value={followUp.monday_status}
                              onChange={(e) => updateCustomerFollowUp(index, 'monday_status', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-purple-400 focus:bg-white"
                              placeholder="حالة الاثنين"
                            />
                          </TableCell>
                          <TableCell className="px-2 md:px-3 py-3 border-r border-purple-200">
                            <Textarea
                              value={followUp.tuesday_status}
                              onChange={(e) => updateCustomerFollowUp(index, 'tuesday_status', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-purple-400 focus:bg-white"
                              placeholder="حالة الثلاثاء"
                            />
                          </TableCell>
                          <TableCell className="px-2 md:px-3 py-3 border-r border-purple-200">
                            <Textarea
                              value={followUp.wednesday_status}
                              onChange={(e) => updateCustomerFollowUp(index, 'wednesday_status', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-purple-400 focus:bg-white"
                              placeholder="حالة الأربعاء"
                            />
                          </TableCell>
                          <TableCell className="px-2 md:px-3 py-3">
                            <Textarea
                              value={followUp.thursday_status}
                              onChange={(e) => updateCustomerFollowUp(index, 'thursday_status', e.target.value)}
                              className="text-center border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none text-sm md:text-base font-medium focus:border-purple-400 focus:bg-white"
                              placeholder="حالة الخميس"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitsAndCustomers;