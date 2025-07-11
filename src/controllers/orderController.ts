//Logic for handling requests

import { Request, Response, NextFunction } from 'express';
import { validateOrderPayload } from '../utils/validate';  // Validator for source order
import { transformSourceToTarget } from '../transform/transformSourceToTarget'; 
import logger from '../utils/logger';              // Winston logger
import { sendToWebhook } from '../services/webhookServices';

export async function handleOrder(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info('Incoming request to /order-producer/v1', {
      body: req.body,
    });

    // Step 1: Validate the source order data
    const validatedData = validateOrderPayload(req.body);
    logger.info('Validation successful', { orderId: validatedData.orderId });

    // Step 2: Transform it to Target Model 
    const transformedData = transformSourceToTarget(validatedData);

    // Step 3: Send to webhook.site (next step)
    await sendToWebhook(transformedData);

    res.status(200).json({
      message: 'Order validated successfully',
      targetOrder: transformedData
    });
  } catch (err) {
    logger.error('Error in handleOrder controller', {
      error: (err as Error).message,
    });
    next(err); // send to error middleware
  }
}

