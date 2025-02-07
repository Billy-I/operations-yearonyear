import React, { useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface MultiYearPDFWrapperProps {
  children: React.ReactNode;
}

export const MultiYearPDFWrapper = ({ children }: MultiYearPDFWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Add a loading state to the export button if it exists
      if (exportButtonRef.current) {
        exportButtonRef.current.disabled = true;
        exportButtonRef.current.textContent = 'Generating PDF...';
      }

      const doc = new jsPDF('p', 'mm', 'a4');
      const contentWidth = contentRef.current.offsetWidth;
      const contentHeight = contentRef.current.offsetHeight;

      // Convert the content to an image with better quality
      console.log("Starting PDF generation...");
      
      // Wait for any pending renders to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the printable content
      const printableContent = contentRef.current.querySelector('.printable-content');
      if (!printableContent) {
        throw new Error('No printable content found');
      }

      // Ensure all data is loaded and rendered
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Force all elements to be visible during capture
      const tableElements = printableContent.querySelectorAll('table, td, th, tr');
      const visibleChartElements = printableContent.querySelectorAll('.recharts-surface, .recharts-layer');
      
      // Store original styles
      const originalTableStyles: Array<{ element: HTMLElement; display: string; visibility: string }> = [];
      const originalChartStyles: Array<{ element: HTMLElement; transform: string; opacity: string }> = [];

      // Force table visibility
      Array.from(tableElements).forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          originalTableStyles.push({
            element: el,
            display: el.style.display,
            visibility: el.style.visibility
          });
          el.style.display = 'table';
          el.style.visibility = 'visible';
        }
      });

      // Force chart visibility
      Array.from(visibleChartElements).forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          originalChartStyles.push({
            element: el,
            transform: el.style.transform || 'none',
            opacity: el.style.opacity || '1'
          });
          el.style.transform = 'none';
          el.style.opacity = '1';
        }
      });

      console.log(`Found ${visibleChartElements.length} chart elements to process`);

      // Capture the content with improved settings
      const dataUrl = await toPng(printableContent as HTMLElement, {
        quality: 1,
        pixelRatio: 3,
        style: {
          transform: 'none'
        },
        filter: (node) => {
          if (!(node instanceof HTMLElement)) {
            return false;
          }
          return !node.classList.contains('non-printable');
        },
        skipAutoScale: false,
        cacheBust: true,
        backgroundColor: '#ffffff'
      }).catch(error => {
        console.error('Error capturing content:', error);
        throw new Error('Failed to capture content for PDF');
      });

      console.log("Content captured successfully");

      // Restore original styles
      originalTableStyles.forEach(({ element, display, visibility }) => {
        element.style.display = display;
        element.style.visibility = visibility;
      });

      originalChartStyles.forEach(({ element, transform, opacity }) => {
        element.style.transform = transform;
        element.style.opacity = opacity;
      });

      console.log("Styles restored, proceeding with PDF generation");
      
      // Calculate dimensions to fit on A4
      const pageWidth = doc.internal.pageSize.getWidth();
      const aspectRatio = contentHeight / contentWidth;
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = imgWidth * aspectRatio;

      // Add title
      doc.setFontSize(16);
      doc.text('Multi-Year Analysis Report', pageWidth / 2, 10, { align: 'center' });

      // Add the image to the PDF with proper positioning
      doc.addImage(dataUrl, 'PNG', 10, 20, imgWidth, imgHeight);

      // Save the PDF with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`multi-year-analysis-${timestamp}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error state in the button
      if (exportButtonRef.current) {
        exportButtonRef.current.textContent = 'Error - Try Again';
        exportButtonRef.current.style.color = 'red';
        // Reset button after 3 seconds
        setTimeout(() => {
          if (exportButtonRef.current) {
            exportButtonRef.current.disabled = false;
            exportButtonRef.current.textContent = 'Export PDF';
            exportButtonRef.current.style.removeProperty('color');
          }
        }, 3000);
      }
      // Re-throw error to be handled by the calling code
      throw error;
    } finally {
      // Ensure button is always re-enabled
      setTimeout(() => {
        if (exportButtonRef.current) {
          exportButtonRef.current.disabled = false;
          if (exportButtonRef.current.textContent === 'Generating PDF...') {
            exportButtonRef.current.textContent = 'Export PDF';
          }
        }
      }, 5000); // Fallback timeout in case of hanging
      console.log("PDF generation completed");
    }
  };

  const triggerExport = async () => {
    console.log("PDF export triggered");
    try {
      await handleExportPDF();
      console.log("PDF exported successfully");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      // Error is already handled in handleExportPDF
    }
  };

  // Expose the triggerExport function to the window for debugging
  useEffect(() => {
    (window as any).triggerPdfExport = triggerExport;
    return () => {
      delete (window as any).triggerPdfExport;
    };
  }, []);

  return (
    <div>
      <div ref={contentRef}>
        {children}
      </div>
      <button
        id="export-trigger"
        ref={exportButtonRef}
        onClick={triggerExport}
        style={{ display: 'none' }}
      />
    </div>
  );
};