//validator test
import { validateOrderPayload } from '../../src/utils/validate';

describe('validateOrderPayload', () => {
  const validOrder = {
    orderId: '123',
    orderDate: '07/01/2025',
    customerId: 'cust1',
    storeId: 10,
    items: [
      {
        sku: 'ABC',
        quantity: 2,
        unitPrice: 100,
      },
    ],
    paymentMethod: 'CARD',
    totalAmount: 200,
    status: 'NEW',
  };

  it('should validate a correct order', () => {
    expect(() => validateOrderPayload(validOrder)).not.toThrow();
  });

  it('should throw if orderId is missing', () => {
    const invalid = { ...validOrder, orderId: undefined };
    expect(() => validateOrderPayload(invalid)).toThrow();
  });

  it('should throw if date format is invalid', () => {
    const invalid = { ...validOrder, orderDate: '2025-01-01' };
    expect(() => validateOrderPayload(invalid)).toThrow();
  });

  it('should default missing optional fields', () => {
    const result = validateOrderPayload(validOrder);
    expect(result.notes).toBe('');
    expect(result.shippingAddress).toEqual({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
  });
});
