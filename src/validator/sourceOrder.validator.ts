// zod validates the schema for sourceOrder

import { z } from 'zod';

export const sourceOrderSchema = z.object({
  orderId: z.string({
    required_error: 'orderId is required',
    invalid_type_error: 'orderId must be a string',
  }),
  orderDate: z.string({
    required_error: 'orderDate is required',
    invalid_type_error: 'orderDate must be a string in MM/DD/YYYY format',
  }).regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Invalid date format (MM/DD/YYYY expected)'),
  customerId: z.string({
    required_error: 'customerId is required',
    invalid_type_error: 'customerId must be a string',
  }),
  storeId: z.number({
    required_error: 'storeId is required',
    invalid_type_error: 'storeId must be a number',
  }),
  items: z.array(
    z.object({
      sku: z.string({
        required_error: 'sku is required',
        invalid_type_error: 'sku must be a string',
      }),
      quantity: z.number({
        required_error: 'quantity is required',
        invalid_type_error: 'quantity must be a number',
      }),
      unitPrice: z.number({
        required_error: 'unitPrice is required',
        invalid_type_error: 'unitPrice must be a number',
      }),
      discountAmount: z.number({
        invalid_type_error: 'discountAmount must be a number',
      }).optional().default(0),
    })
  ).min(1, 'At least one item is required'),
  paymentMethod: z.string({
    required_error: 'paymentMethod is required',
    invalid_type_error: 'paymentMethod must be a string',
  }),
  shippingAddress: z.object({
    street: z.string({
      required_error: 'street is required',
      invalid_type_error: 'street must be a string',
    }),
    city: z.string({
      required_error: 'city is required',
      invalid_type_error: 'city must be a string',
    }),
    state: z.string({
      required_error: 'state is required',
      invalid_type_error: 'state must be a string',
    }),
    zipCode: z.string({
      required_error: 'zipCode is required',
      invalid_type_error: 'zipCode must be a string',
    }),
    country: z.string({
      required_error: 'country is required',
      invalid_type_error: 'country must be a string',
    }),
  }).optional().default({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  }),
  totalAmount: z.number({
    required_error: 'totalAmount is required',
    invalid_type_error: 'totalAmount must be a number',
  }),
  status: z.enum(['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be one of NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED',
  }),
  notes: z.string().optional().default(''),
});
