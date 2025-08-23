
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Home, TrendingDown, Users, UserCheck, Briefcase, Shield, FileText, Calendar, TrendingUp, LogOut, ChevronDown } from 'lucide-react';
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

  const getCurrentSectionLabel = () => {
    const currentItem = menuItems.find(item => item.id === activeSection);
    return currentItem ? currentItem.label : 'لوحة التحكم';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-2 py-2 max-w-full">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Mobile Menu Dropdown */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 shrink-0">
                    <Menu className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4 mr-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-64 max-h-80 overflow-y-auto bg-white/95 backdrop-blur-lg border shadow-lg z-50"
                  sideOffset={8}
                >
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => {
                          onSectionChange(item.id);
                        }}
                        className={`flex items-center gap-3 p-3 cursor-pointer text-right ${
                          activeSection === item.id 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 font-medium' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:inline-flex p-2 shrink-0"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <h1 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight truncate">
              نظام المحاسبة م/محمد صبري صالح 0563769651
            </h1>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-gray-600 hidden xs:inline max-w-20 truncate">مرحباً، {username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1 p-2 text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xs:inline">خروج</span>
            </Button>
          </div>
        </div>

        {/* Mobile Current Section Indicator */}
        <div className="lg:hidden px-4 pb-2">
          <div className="text-xs text-gray-600">
            القسم الحالي: <span className="font-medium text-blue-600">{getCurrentSectionLabel()}</span>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-72 sm:w-80 lg:w-64 bg-white/95 backdrop-blur-lg border-l border-blue-100 shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto hidden lg:block`}>
          <nav className="p-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 text-right text-sm ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate text-right flex-1">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          <div className="p-2 xs:p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

      {/* Desktop Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
