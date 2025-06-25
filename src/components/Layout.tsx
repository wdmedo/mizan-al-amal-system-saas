import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Users, 
  UserCheck, 
  Briefcase, 
  Shield, 
  Building, 
  TrendingUp, 
  Calendar,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Layout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'المصروفات', href: '/expenses', icon: DollarSign },
    { name: 'العملاء المعلقين', href: '/pending-customers', icon: Users },
    { name: 'العملاء الخالصين', href: '/completed-customers', icon: UserCheck },
    { name: 'الموظفين', href: '/employees', icon: Briefcase },
    { name: 'التغطيات', href: '/coverages', icon: Shield },
    { name: 'الحسابات', href: '/accounts', icon: Building },
    { name: 'رأس المال', href: '/capital', icon: TrendingUp },
    { name: 'الإقفال الشهري/السنوي', href: '/closing', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">نظام المحاسبة</h1>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        } ml-3 flex-shrink-0 h-6 w-6`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
