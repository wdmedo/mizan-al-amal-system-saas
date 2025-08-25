
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, FileImage } from 'lucide-react';
import html2canvas from 'html2canvas';

interface PrintButtonProps {
  printableElementId?: string;
  className?: string;
  showImageExport?: boolean;
}

const PrintButton = ({ printableElementId, className, showImageExport = true }: PrintButtonProps) => {
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

  const exportToImage = async () => {
    if (printableElementId) {
      const element = document.getElementById(printableElementId);
      if (element) {
        try {
          // Wait for fonts to load
          await document.fonts.ready;
          
          const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight,
            foreignObjectRendering: false,
            logging: false,
            onclone: (clonedDoc) => {
              // Ensure RTL direction is preserved
              const clonedElement = clonedDoc.getElementById(printableElementId);
              if (clonedElement) {
                clonedElement.style.direction = 'rtl';
                clonedElement.style.fontFamily = 'Arial, sans-serif';
                clonedElement.style.fontSize = '14px';
                clonedElement.style.lineHeight = '1.5';
                
                // Fix Arabic text rendering
                const allElements = clonedElement.querySelectorAll('*');
                allElements.forEach((el: any) => {
                  el.style.fontFamily = 'Arial, sans-serif';
                  el.style.direction = 'rtl';
                  el.style.unicodeBidi = 'bidi-override';
                  el.style.textAlign = 'right';
                });
              }
            }
          });
          
          const link = document.createElement('a');
          link.download = `تقرير-${new Date().toLocaleDateString('ar-SA')}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        } catch (error) {
          console.error('خطأ في تصدير الصورة:', error);
        }
      }
    }
  };

  if (showImageExport) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={handlePrint}
          variant="outline"
          className={`bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 ${className}`}
        >
          <Printer className="h-4 w-4 ml-2" />
          طباعة
        </Button>
        <Button
          onClick={exportToImage}
          variant="outline"
          className={`bg-green-50 hover:bg-green-100 text-green-700 border-green-200 ${className}`}
        >
          <FileImage className="h-4 w-4 ml-2" />
          تصدير صورة
        </Button>
      </div>
    );
  }

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
