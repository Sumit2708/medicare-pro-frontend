import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(pdfMake as any).vfs = pdfFonts['vfs'];

@Injectable({
  providedIn: 'root',
})
export class BillingPdfService {
  generateInvoice(invoiceDetails: InvoiceDetails): void {
    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A4',

      pageMargins: [40, 60, 40, 60],

      content: [
        {
          text: 'ABC CLINIC',
          style: 'title',
        },

        {
          text: 'Healthcare Management System',
          style: 'subtitle',
        },

        {
          text: 'TAX INVOICE',
          style: 'invoiceTitle',
          margin: [0, 20, 0, 20],
        },
        {
          columns: [
            [
              {
                text: `Invoice Number: ${invoiceDetails.invoice.invoiceNumber}`,
              },

              {
                text: `Date: ${invoiceDetails.invoice.createdDate}`,
              },
            ],
          ],
        },
        {
          margin: [0, 20, 0, 20],

          table: {
            widths: ['*', '*'],

            body: [
              [
                {
                  text: [
                    { text: 'Patient\n', bold: true },
                    invoiceDetails.patient.name,
                  ],
                },

                {
                  text: [
                    { text: 'Doctor\n', bold: true },
                    invoiceDetails.doctor.name,
                  ],
                },
              ],
            ],
          },

          layout: 'lightHorizontalLines',
        },
        {
          table: {
            widths: ['*', 'auto'],

            body: [
              [
                { text: 'Description', bold: true },
                { text: 'Amount', bold: true },
              ],

              ['Consultation Fee', invoiceDetails.invoice.consultationFee],

              ['Discount', `-${invoiceDetails.invoice.discount}`],

              ['GST', invoiceDetails.invoice.gst],

              [
                {
                  text: 'Grand Total',
                  bold: true,
                },

                {
                  text: invoiceDetails.invoice.total,
                  bold: true,
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: ['*', 'auto'],

            body: [
              [
                { text: 'Description', bold: true },
                { text: 'Amount', bold: true },
              ],

              ['Consultation Fee', invoiceDetails.invoice.consultationFee],

              ['Discount', `-${invoiceDetails.invoice.discount}`],

              ['GST', invoiceDetails.invoice.gst],

              [
                {
                  text: 'Grand Total',
                  bold: true,
                },

                {
                  text: invoiceDetails.invoice.total,
                  bold: true,
                },
              ],
            ],
          },
        },
      ],
      styles: {
        title: {
          fontSize: 24,

          bold: true,

          alignment: 'center',
        },

        subtitle: {
          fontSize: 12,

          alignment: 'center',
        },

        invoiceTitle: {
          fontSize: 18,

          bold: true,

          alignment: 'center',
        },
      },
    };
    pdfMake
      .createPdf(documentDefinition)
      .download(`Invoice-${invoiceDetails.invoice.invoiceNumber}.pdf`);
  }
}
