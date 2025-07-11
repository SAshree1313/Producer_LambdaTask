import { SourceOrderData } from '../models/sourceOrder.model';
import { TargetOrderModel } from '../models/targetOrder.model';
import { format } from 'date-fns';

export function transformSourceToTarget(sourceOrder: SourceOrderData): TargetOrderModel {

  const createdAt = format(new Date(sourceOrder.orderDate), 'yyyy-MM-dd'); // e.g., 2023-10-15
  const processedAt = new Date().toISOString();

  return {
    order: {
      id: sourceOrder.orderId,
      createdAt,
      customer: {
        id: sourceOrder.customerId,
      },
      location: {
        storeId: sourceOrder.storeId.toString(),
      },
      status: sourceOrder.status.toLowerCase(),
      payment: {
        method: sourceOrder.paymentMethod,
        total: sourceOrder.totalAmount,
      },
      shipping: {
        address: {
          line1: sourceOrder.shippingAddress?.street || '',
          city: sourceOrder.shippingAddress?.city || '',
          state: sourceOrder.shippingAddress?.state || '',
          postalCode: sourceOrder.shippingAddress?.zipCode || '',
          country: sourceOrder.shippingAddress?.country || '',
        },
      },
    },
    items: sourceOrder.items.map(item => ({
      productId: item.sku,
      quantity: item.quantity,
      price: {
        base: item.unitPrice,
        discount: item.discountAmount ?? 0,
        final: item.unitPrice * item.quantity - (item.discountAmount ?? 0),
      },
    })),
    metadata: {
      source: 'order_producer',
      notes: sourceOrder.notes || '',
      processedAt,
    },
  };
}
