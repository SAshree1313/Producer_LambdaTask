//Defines POST and health check routes

import express from 'express';
import { handleOrder } from '../controllers/orderController';
import logger from '../utils/logger'; 
const router = express.Router();

// POST order route
router.post('/', handleOrder);

// GET healthCheck
router.get('/healthCheck', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
  logger.info('Healthy');
});

export default router;
