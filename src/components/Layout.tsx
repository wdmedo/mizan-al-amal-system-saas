
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, TrendingDown, Users, UserCheck, Briefcase, Shield, FileText, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Layout = ({ children, activeSection, onSectionChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { username, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
    { id: 'pending-customers', label: 'العملاء المعلقين', icon: Users },
    { id: 'completed-customers', label: 'العملاء الخالصين', icon: UserCheck },
    { id: 'employees', label: 'الموظفين', icon: Briefcase },
    { id: 'coverages', label: 'التغطيات', icon: Shield },
    { id: 'accounts', label: 'ملخص الحسابات', icon: FileText },
    { id: 'monthly-yearly-closing', label: 'التقفيل الشهري والسنوي', icon: Calendar },
    { id: 'capital-over-year', label: 'رأس المال على مدى السنة', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 sm:p-2"
            >
              {sidebarOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <h1 className="text-sm sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              نظام المحاسبة الشامل<br className="sm:hidden" />
              <span className="hidden sm:inline"> لمؤسسة تمام السداد</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">مرحباً، {username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-56 sm:w-64 bg-white/90 backdrop-blur-lg border-l border-blue-100 shadow-lg transition-transform duration-300 ease-in-out`}>
          <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2 mt-2 sm:mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 sm:gap-3 h-10 sm:h-12 text-right text-xs sm:text-sm ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:mr-0 transition-all duration-300 min-h-screen">
          <div className="p-3 sm:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
