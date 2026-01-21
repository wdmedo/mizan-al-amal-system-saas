import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, User, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SolverLoginFormProps {
  onLogin: (username: string) => void;
  onBackToMain: () => void;
}

const SolverLoginForm = ({ onLogin, onBackToMain }: SolverLoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === '0563769651Aa') {
        onLogin(username);
        toast({
          title: "تم الدخول بنجاح",
          description: "مرحباً بك في حاسبة الصيغ المالية",
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
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-10 -left-10 sm:top-0 sm:-left-4 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse"></div>
          <div className="absolute top-20 -right-10 sm:top-0 sm:-right-4 w-48 sm:w-72 h-48 sm:h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-10 left-10 sm:-bottom-8 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-10 sm:bottom-20 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-xl animate-pulse delay-500"></div>
        </div>
        {/* شبكة خلفية */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      </div>

      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl border border-white/10 bg-white/5 backdrop-blur-2xl relative z-10">
        <CardHeader className="text-center space-y-4 sm:space-y-6 pb-2 px-4 sm:px-6">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3 hover:rotate-0 transition-transform duration-300 active:scale-95">
            <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              الحاسبة المالية
            </CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base">
              أداة حل المعادلات المالية المتقدمة
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="username" className="text-gray-200 flex items-center gap-2 text-xs sm:text-sm font-medium">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="text-right bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 h-11 sm:h-12 text-base"
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-gray-200 flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-400" />
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="text-right bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20 h-11 sm:h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2.5 sm:space-y-3 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold text-base sm:text-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري الدخول...
                  </span>
                ) : 'دخول الحاسبة'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full h-10 sm:h-11 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
                onClick={onBackToMain}
              >
                العودة للنظام الرئيسي
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolverLoginForm;