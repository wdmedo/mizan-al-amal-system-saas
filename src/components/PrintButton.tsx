
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  printableElementId?: string;
  className?: string;
}

const PrintButton = ({ printableElementId, className }: PrintButtonProps) => {
  const handlePrint = () => {
    if (printableElementId) {
      const printableElement = document.getElementById(printableElementId);
      if (printableElement) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>طباعة</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
                  .print-content { width: 100%; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>
                <div class="print-content">
                  ${printableElement.innerHTML}
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } else {
      window.print();
    }
  };

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className={`bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 ${className}`}
    >
      <Printer className="h-4 w-4 ml-2" />
      طباعة
    </Button>
  );
};

export default PrintButton;
