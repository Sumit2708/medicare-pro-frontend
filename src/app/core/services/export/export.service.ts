import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

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


  


  exportPdf(element: HTMLElement, filename: string): void {
    html2pdf()
      .from(element)

      .set({
        margin: 10,

        filename,

        image: {
          type: 'jpeg',
          quality: 1,
        },

        html2canvas: {
          scale: 2,
        },

        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })

      .save();
  }
}
