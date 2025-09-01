
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
            <html dir="rtl" lang="ar">
              <head>
                <title>طباعة</title>
                <meta charset="UTF-8">
                <style>
                  body { 
                    font-family: "Segoe UI", Tahoma, Arial, "Noto Sans Arabic", sans-serif; 
                    margin: 20px; 
                    direction: rtl; 
                    line-height: 1.6;
                    letter-spacing: 0.5px;
                    text-rendering: optimizeLegibility;
                  }
                  .print-content { 
                    width: 100%; 
                    direction: rtl;
                  }
                  * {
                    font-family: "Segoe UI", Tahoma, Arial, "Noto Sans Arabic", sans-serif !important;
                    direction: rtl;
                  }
                  table td, table th {
                    text-align: center;
                    vertical-align: middle;
                  }
                  @media print { 
                    body { margin: 0; } 
                    * { -webkit-print-color-adjust: exact; }
                  }
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
          // Wait for fonts to load properly
          await document.fonts.ready;
          
          // Add a small delay to ensure complete font loading
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight,
            foreignObjectRendering: true,
            logging: false,
            onclone: (clonedDoc) => {
              // Ensure proper Arabic text rendering
              const clonedElement = clonedDoc.getElementById(printableElementId);
              if (clonedElement) {
                // Set document-level styles for better Arabic support
                clonedDoc.documentElement.style.direction = 'rtl';
                clonedDoc.documentElement.setAttribute('lang', 'ar');
                
                // Apply Arabic-optimized styles to the main element
                clonedElement.style.direction = 'rtl';
                clonedElement.style.fontFamily = '"Segoe UI", Tahoma, Arial, "Noto Sans Arabic", sans-serif';
                clonedElement.style.fontSize = '16px';
                clonedElement.style.lineHeight = '1.6';
                clonedElement.style.letterSpacing = '0.5px';
                
                // Apply proper styles to all text elements
                const textElements = clonedElement.querySelectorAll('*');
                textElements.forEach((el: any) => {
                  const computedStyle = window.getComputedStyle(el);
                  
                  // Only apply RTL styles to elements with Arabic content or that should be RTL
                  el.style.fontFamily = '"Segoe UI", Tahoma, Arial, "Noto Sans Arabic", sans-serif';
                  el.style.direction = 'rtl';
                  el.style.unicodeBidi = 'normal';
                  
                  // Preserve original text alignment unless it's explicitly left-aligned
                  if (computedStyle.textAlign !== 'left') {
                    el.style.textAlign = 'right';
                  }
                  
                  // Improve number and mixed content rendering
                  el.style.fontFeatureSettings = '"kern" 1, "liga" 1';
                  el.style.textRendering = 'optimizeLegibility';
                  
                  // Handle tables and specific elements differently
                  if (el.tagName === 'TD' || el.tagName === 'TH') {
                    el.style.textAlign = 'center';
                    el.style.verticalAlign = 'middle';
                  }
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
