//Sets up the Express app with routes + middleware

import express from 'express';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());                        // Parse JSON request bodies    
app.use('/order-producer/v1', orderRoutes);     // Use order routes 
app.use('/order-producer/v1/healthCheck', orderRoutes); // Health check endpoint
app.use(errorHandler); // Centralized error handling

export default app;
