import { sourceOrderSchema } from '../validator/sourceOrder.validator';

export function validateOrderPayload(payload: any) {
  const result = sourceOrderSchema.safeParse(payload);

  if (!result.success) {
    const errorDetails = result.error.format();
    const message = Object.values(errorDetails)
      .map((e: any) => e?._errors?.[0])
      .filter(Boolean)
      .join(', ');
    const error = new Error(`Validation Error: ${message}`);
    (error as any).statusCode = 400;
    throw error;
  }

  const data = result.data;

  // Additional validation: Calendar-valid date
  if (data.orderDate) {
    const [month, day, year] = data.orderDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const isInvalidDate =
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day;

    if (isInvalidDate) {
      const error = new Error('Validation Error: orderDate is not a valid calendar date');
      (error as any).statusCode = 400;
      throw error;
    }
  }

  // Additional validation: check if each item object is valid
  data.items.forEach((item, i) => {
    if (typeof item !== 'object') {
      throw createItemError(i, 'Item must be an object');
    }
    if (!item.sku || typeof item.sku !== 'string') {
      throw createItemError(i, 'sku is required and must be a string');
    }
    if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
      throw createItemError(i, 'quantity must be a number');
    }
    if (typeof item.unitPrice !== 'number' || isNaN(item.unitPrice)) {
      throw createItemError(i, 'unitPrice must be a number');
    }
    if (
      item.discountAmount !== undefined &&
      (typeof item.discountAmount !== 'number' || isNaN(item.discountAmount))
    ) {
      throw createItemError(i, 'discountAmount must be a number');
    }
  });

  return data;
}

function createItemError(index: number, msg: string): Error {
  const error = new Error(`Validation Error: Item[${index}]: ${msg}`);
  (error as any).statusCode = 400;
  return error;
}
