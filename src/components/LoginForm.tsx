
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (isLoggedIn: boolean) => void;
  onSolverAccess: () => void;
  onVisitsAccess: () => void;
}

const LoginForm = ({ onLogin, onSolverAccess, onVisitsAccess }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // محاكاة تأخير تسجيل الدخول
    setTimeout(() => {
      if (username === 'admin' && password === '0563769651Aa') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        onLogin(true);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام المحاسبة الشامل",
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      {/* خلفية متحركة محسّنة */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-10 -left-10 sm:top-0 sm:-left-4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse"></div>
          <div className="absolute top-20 -right-10 sm:top-0 sm:-right-4 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-10 left-10 sm:-bottom-8 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-10 sm:bottom-20 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-500"></div>
        </div>
        {/* شبكة خلفية */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl border border-white/10 bg-white/5 backdrop-blur-2xl relative z-10">
        <CardHeader className="text-center space-y-4 sm:space-y-6 pb-2 px-4 sm:px-6">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 rotate-3 hover:rotate-0 transition-transform duration-300 active:scale-95">
            <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base">
              نظام المحاسبة م/محمد صبري صالح
            </CardDescription>
            <p className="text-cyan-400 font-mono text-xs sm:text-sm tracking-wider">0563769651</p>
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="username" className="text-gray-200 flex items-center gap-2 text-xs sm:text-sm font-medium">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="text-right bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 h-11 sm:h-12 text-base"
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-gray-200 flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400" />
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="text-right bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-11 sm:h-12 text-base"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold text-base sm:text-lg shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري تسجيل الدخول...
                </span>
              ) : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 space-y-2.5 sm:space-y-3">
            <Button 
              type="button"
              variant="outline"
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 hover:text-emerald-200 transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
              onClick={onSolverAccess}
            >
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              دخول الحاسبة المالية
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-orange-500/10 to-rose-500/10 hover:from-orange-500/20 hover:to-rose-500/20 border-orange-500/30 hover:border-orange-400/50 text-orange-300 hover:text-orange-200 transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
              onClick={onVisitsAccess}
            >
              متابعة الزيارات والعملاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
