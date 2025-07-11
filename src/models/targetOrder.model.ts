export interface TargetOrderModel {
  order: {
    id: string;
    createdAt: string;               // ISO date: YYYY-MM-DD
    customer: {
      id: string;
    };
    location: {
      storeId: string;               // Converted to string
    };
    status: string;                  // lowercase
    payment: {
      method: string;
      total: number;
    };
    shipping: {
      address: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
  };
  items: {
    productId: string;
    quantity: number;
    price: {
      base: number;
      discount: number;
      final: number;
    };
  }[];
  metadata: {
    source: string; // hardcoded like 'order_producer'
    notes: string;
    processedAt: string; // ISO timestamp
  };
}
