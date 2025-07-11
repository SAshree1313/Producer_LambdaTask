//Zod schemas for input validation

import { z } from 'zod';

export const sourceOrderSchema = z.object({
  orderId: z.string(),
  orderDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format (MM/DD/YYYY expected)"),
  customerId: z.string(),
  storeId: z.number(),
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      discountAmount: z.number().optional().default(0),
    })
  ).min(1, "At least one item is required"),
  paymentMethod: z.string(),
  shippingAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional()
    .default({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }),
  totalAmount: z.number(),
  status: z.enum(['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  notes: z.string().optional().default(''),
});

