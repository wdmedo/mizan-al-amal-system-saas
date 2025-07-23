import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

const FinancialSolver = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            حاسبة الصيغ المالية
          </CardTitle>
          <CardDescription className="text-gray-600">
            أداة متقدمة لحل المعادلات والحسابات المالية المعقدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-inner">
            <iframe 
              src="https://financial-formula-solver-26.vercel.app/" 
              width="100%" 
              height="600" 
              style={{ border: 'none' }}
              title="Financial Formula Solver"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSolver;