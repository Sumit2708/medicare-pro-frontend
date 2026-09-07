import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';


@Injectable({
  providedIn: 'root',
})
export class ExportService {


  exportExcel(data: any[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `${fileName}.xlsx`);
  }


  //  exportPdf(
  //   element: HTMLElement,
  //   fileName: string
  // ): void {

  //   const options = {

  //     margin: 10,

  //     filename: `${fileName}.pdf`,

  //     image: {
  //       type: 'jpeg',
  //       quality: 0.98,
  //     },

  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,
  //     },

  //     jsPDF: {
  //       unit: 'mm',
  //       format: 'a4',
  //       orientation: 'portrait',
  //     },

  //   };

  //   html2pdf()
  //     .from(element)
  //     .save();

  // }


  


  // exportPdf(element: HTMLElement, filename: string): void {
  //   html2pdf()
  //     .from(element)

  //     .set({
  //       margin: 10,

  //       filename,

  //       image: {
  //         type: 'jpeg',
  //         quality: 1,
  //       },

  //       html2canvas: {
  //         scale: 2,
  //       },

  //       jsPDF: {
  //         unit: 'mm',
  //         format: 'a4',
  //         orientation: 'portrait',
  //       },
  //     })

  //     .save();
  // }





async exportPdf(
  reportElement: HTMLElement,
  generatedDate: string
): Promise<void> {

  if (!reportElement) return;

  const element = reportElement;

  const pdfHeader = element.querySelector('.pdf-header') as HTMLElement | null;

if (pdfHeader) {
  pdfHeader.style.display = 'flex';
}

 const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false
  });

if (pdfHeader) {
  pdfHeader.style.display = '';
}


  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;

  const contentWidth = pageWidth - margin * 2;

  const contentHeight =
    (canvas.height * contentWidth) / canvas.width;

  let heightLeft = contentHeight;
  let position = margin;

  pdf.addImage(
    imgData,
    'PNG',
    margin,
    position,
    contentWidth,
    contentHeight
  );

  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - contentHeight + margin;

    pdf.addPage();

    pdf.addImage(
      imgData,
      'PNG',
      margin,
      position,
      contentWidth,
      contentHeight
    );

    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save('appointments-report.pdf');
}
}
