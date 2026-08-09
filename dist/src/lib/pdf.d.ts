import { Buffer } from "buffer";
/**
 * Minimal, dependency-free PDF invoice generator.
 * Produces a valid (PDF 1.4) document containing the invoice/order details.
 */
export interface InvoicePdfItem {
    productName: string;
    quantity: number;
    price: string;
    total: string;
}
export interface InvoicePdfData {
    invoiceNumber: string;
    orderNumber?: string;
    orderDate?: string;
    status?: string;
    customerName?: string;
    customerAddress?: string;
    customerPhone?: string;
    items: InvoicePdfItem[];
    subtotal?: string;
    shippingCost?: string;
    total?: string;
}
export declare function generateInvoicePdf(data: InvoicePdfData): Buffer;
//# sourceMappingURL=pdf.d.ts.map