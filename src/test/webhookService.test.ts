// test for webhook service
import axios from 'axios';
import { sendToWebhook } from '../../src/services/webhookServices';
import { TargetOrderModel } from '../../src/models/targetOrder.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('sendToWebhook', () => {
  const payload: TargetOrderModel = {
    order: {
      id: 'order123',
      createdAt: new Date().toISOString(),
      customer: { id: 'cust1' },
      location: { storeId: '123' },
      status: 'new',
      payment: { method: 'CARD', total: 100 },
      shipping: {
        address: {
          line1: '123 Main',
          city: 'City',
          state: 'State',
          postalCode: '12345',
          country: 'Country',
        },
      },
    },
    items: [
      {
        productId: 'prod1',
        quantity: 1,
        price: {
          base: 100,
          discount: 0,
          final: 100,
        },
      },
    ],
    metadata: {
      source: 'order_producer',
      notes: '',
      processedAt: new Date().toISOString(),
    },
  };

  beforeEach(() => {
    process.env.WEBHOOK_URL = 'https://example.com/webhook';
    jest.clearAllMocks();
  });

  it('should send POST to webhook', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

    await expect(sendToWebhook(payload)).resolves.not.toThrow();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      process.env.WEBHOOK_URL,
      payload,
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should throw if WEBHOOK_URL is missing', async () => {
    delete process.env.WEBHOOK_URL;

    await expect(sendToWebhook(payload)).rejects.toThrow(
      'WEBHOOK_URL environment variable is not defined'
    );
  });

  it('should throw on request failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Request failed'));

    await expect(sendToWebhook(payload)).rejects.toThrow('Request failed');
  });
});
