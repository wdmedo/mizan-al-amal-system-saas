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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50" dir="rtl">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            دخول الحاسبة المالية
          </CardTitle>
          <CardDescription className="text-gray-600">
            الدخول إلى أداة حل المعادلات المالية المتقدمة
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
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الدخول...' : 'دخول الحاسبة'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full"
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