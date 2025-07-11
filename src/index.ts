// Entry point for the AWS Lambda function and local dev runner

import dotenv from 'dotenv';
dotenv.config(); // Loads .env values into process.env

import serverless from 'serverless-http'; // Bridges Express with AWS Lambda
import app from './app'; // Import the Express app

// Create serverless handler with event.body parsing fix
import { Request } from 'express';

export const handler = serverless(app, {
  request: (request: Request, event: any) => {
    // Manually parse body if it's a string (Lambda passes raw string)
    if (typeof event.body === 'string') {
      try {
        request.body = JSON.parse(event.body);
      } catch (err) {
        console.error('Failed to parse event.body:', err);
        request.body = {}; // prevent crash
      }
    }
  }
});

// Local development support
if (process.env.IS_LOCAL === 'true') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`);
  });
}
