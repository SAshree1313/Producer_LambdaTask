
import { sourceOrderSchema } from '../validator/sourceOrder.validator';

export function validateOrderPayload(payload: any) {
  const result = sourceOrderSchema.safeParse(payload);

  if (!result.success) {
    const errorDetails = result.error.format();
    const messages = extractErrors(errorDetails);

    const error = new Error(`Validation Error: ${messages.join(', ')}`);
    (error as any).statusCode = 400;
    throw error;
  }

  const data = result.data;

  // Check if date is a valid calendar date
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

  return data;
}

// Recursively extract Zod error messages
function extractErrors(errorObj: any): string[] {
  const messages: string[] = [];

  for (const key in errorObj) {
    if (key === '_errors' && Array.isArray(errorObj[key])) {
      messages.push(...errorObj[key]);
    } else if (typeof errorObj[key] === 'object' && errorObj[key] !== null) {
      messages.push(...extractErrors(errorObj[key]));
    }
  }

  return messages;
}
