// tests/controllers/orderController.test.ts
import { Request, Response, NextFunction } from 'express';
import { handleOrder } from '../../src/controllers/orderController';
import * as validate from '../../src/utils/validate';
import * as transform from '../../src/transform/transformSourceToTarget';
import * as webhook from '../services/webhookServices';
import axios from 'axios';

jest.mock('../services/webhookServices', () => ({
  sendToWebhook: jest.fn(),
}));
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });
mockedAxios.post.mockRejectedValueOnce(new Error('Request failed'));

describe('handleOrder', () => {
  const req = {
    body: { fake: 'data' },
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  it('should process valid order and respond with transformed data', async () => {
    const validated = { orderId: 'abc' } as any;
    const transformed = { order: { id: 'abc' } } as any;

    jest.spyOn(validate, 'validateOrderPayload').mockReturnValue(validated);
    jest.spyOn(transform, 'transformSourceToTarget').mockReturnValue(transformed);
    (webhook.sendToWebhook as jest.Mock).mockResolvedValue(undefined);

    await handleOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order validated successfully',
      targetOrder: transformed,
    });
  });

  it('should handle validation error', async () => {
    jest.spyOn(validate, 'validateOrderPayload').mockImplementation(() => {
      throw new Error('Invalid data');
    });

    await handleOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle webhook failure', async () => {
    const validated = { orderId: 'abc' } as any;
    const transformed = { order: { id: 'abc' } } as any;

    jest.spyOn(validate, 'validateOrderPayload').mockReturnValue(validated);
    jest.spyOn(transform, 'transformSourceToTarget').mockReturnValue(transformed);
    (webhook.sendToWebhook as jest.Mock).mockRejectedValue(new Error('Webhook failed'));

    await handleOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
