// Business logic like SSM & webhook

import axios from 'axios';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { TargetOrderModel } from '../models/targetOrder.model';

const ssmClient = new SSMClient({});

async function getWebhookUrl(): Promise<string> {
  if (process.env.IS_LOCAL === 'true') {
    const localUrl = process.env.WEBHOOK_URL;
    if (!localUrl) throw new Error('WEBHOOK_URL is not set in local .env');
    return localUrl;
  }

  const paramName = process.env.WEBHOOK_URL_PARAM;
  if (!paramName) throw new Error('WEBHOOK_URL_PARAM environment variable not set');

  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  if (!response.Parameter?.Value) throw new Error('SSM parameter not found');

  return response.Parameter.Value;
}

export async function sendToWebhook(payload: TargetOrderModel) {
  const webhookUrl = await getWebhookUrl();

  try {
    const response = await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error sending webhook');
  }
}

