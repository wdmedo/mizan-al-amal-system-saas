import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, TrendingDown, Users, UserCheck, Briefcase, Shield, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Layout = ({ children, activeSection, onSectionChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
    { id: 'pending-customers', label: 'العملاء المعلقين', icon: Users },
    { id: 'completed-customers', label: 'العملاء الخالصين', icon: UserCheck },
    { id: 'employees', label: 'الموظفين', icon: Briefcase },
    { id: 'coverages', label: 'التغطيات', icon: Shield },
    { id: 'accounts', label: 'ملخص الحسابات', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              نظام المحاسبة الشامل لمؤسسة تمام السداد
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-64 bg-white/90 backdrop-blur-lg border-l border-blue-100 shadow-lg transition-transform duration-300 ease-in-out`}>
          <nav className="p-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 text-right ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:mr-0 transition-all duration-300">
          <div className="p-6">
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
