export interface ReceiptItem {
  quantity: number;
  name: string;
  unitPrice: number;
}

export type PaymentType = 'Tunai' | 'Debit' | 'QRIS';

export interface ReceiptData {
  id?: string;
  // Header
  restaurantName?: string;
  address?: string;
  city?: string;
  phone?: string;
  // Sub-header
  date?: string;
  transactionId?: string;
  tableNumber?: string;
  customerName?: string;
  // Body
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  // Footer
  footerMessage?: string;
  // Payment
  paymentType?: PaymentType;
  paymentAmount?: number;
  paymentChange?: number;
}

export interface ReceiptTemplate {
  id: string;
  templateName: string;
  restaurantName?: string;
  address?: string;
  city?: string;
  phone?: string;
  footerMessage?: string;
}
