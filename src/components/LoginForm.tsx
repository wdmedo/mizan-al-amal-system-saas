
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
}

const LoginForm = ({ onLogin, onSolverAccess }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // محاكاة تأخير تسجيل الدخول
    setTimeout(() => {
      if (password === '033112233') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username || 'مستخدم');
        onLogin(true);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام المحاسبة الشامل",
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-gray-600">
            نظام المحاسبة الشامل لمؤسسة تمام السداد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right flex items-center gap-2">
                <User className="h-4 w-4" />
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="text-right"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right flex items-center gap-2">
                <Lock className="h-4 w-4" />
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="text-right"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <Button 
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 border-green-200"
              onClick={onSolverAccess}
            >
              <Calculator className="h-4 w-4 ml-2" />
              دخول الحاسبة المالية
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200"
              onClick={() => {}}
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
