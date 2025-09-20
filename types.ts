export interface ReceiptItem {
  quantity: number;
  name: string;
  unitPrice: number;
}

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
}