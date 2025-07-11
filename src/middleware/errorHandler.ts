//Catches and responds with JSON error info - Centralized error handling middleware

import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);                            
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
}
