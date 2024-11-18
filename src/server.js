// server.js

import express from 'express'; // Import Express framework
import mongoose from 'mongoose'; // Import Mongoose for MongoDB
import { swaggerSetup } from './swagger.js'; // Import Swagger setup
import itineraryRouter from './routes/itineraryRoute.js'; // Import API routes
import dotenv from 'dotenv'; // Import dotenv for environment variables
import standardizedResponse from './middlewares/standardResponseMiddleware.js'; // Import custom response middleware
import { MongoMemoryServer } from 'mongodb-memory-server';
import reviewRouter from './routes/reviewRoute.js';
import connectDB from './db/connection.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.BACKEND_PORT || 3000; // Define port

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(standardizedResponse); // Use custom response middleware

// Routes
app.use('/api', itineraryRouter); // Use API routes
app.use('/api', reviewRouter); // Use review routes

app.get('/', (req, res) => {
  // Redirect to API documentation
  res.redirect('/api-docs');
});
app.use(errorHandler);
// Swagger configuration
swaggerSetup(app);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`API documentation is available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

export default app; // Export the Express application
