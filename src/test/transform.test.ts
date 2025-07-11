// tests for the transformSourceToTarget function
import { transformSourceToTarget } from '../../src/transform/transformSourceToTarget';
import { SourceOrderData } from '../../src/models/sourceOrder.model';

describe('transformSourceToTarget', () => {
  const sourceOrder: SourceOrderData = {
    orderId: '123',
    orderDate: '07/01/2025',
    customerId: 'cust123',
    storeId: 1,
    items: [
      {
        sku: 'prod1',
        quantity: 2,
        unitPrice: 100,
        discountAmount: 10,
      },
    ],
    paymentMethod: 'CARD',
    totalAmount: 190,
    status: 'NEW',
    notes: 'Urgent order',
  };

  it('should correctly transform fields', () => {
    const target = transformSourceToTarget(sourceOrder);
    expect(target.order.id).toBe('123');
    expect(target.order.status).toBe('new');
    expect(target.items[0].price.final).toBe(190);
    expect(target.metadata.source).toBe('order_producer');
  });

  it('should set defaults when shippingAddress is undefined', () => {
    const copy = { ...sourceOrder, shippingAddress: undefined };
    const target = transformSourceToTarget(copy);
    expect(target.order.shipping.address.line1).toBe('');
  });
});
