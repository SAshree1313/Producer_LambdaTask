export interface SourceOrderData {
  orderId: string;
  orderDate: string;           // MM/DD/YYYY
  customerId: string;
  storeId: number;
  items: {
    sku: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
  }[];
  paymentMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}
