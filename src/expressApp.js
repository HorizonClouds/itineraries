// server.js
import config from './config.js';
import './utils/logger.js';
import express from 'express'; // Import Express framework
import { swaggerSetup } from './swagger.js'; // Import Swagger setup
import itineraryRouter from './routes/itineraryRoute.js'; // Import API routes
import dotenv from 'dotenv'; // Import dotenv for environment variables
import standardizedResponse from './middlewares/standardResponseMiddleware.js'; // Import custom response middleware
import reviewRouter from './routes/reviewRoute.js';
import errorHandler from './middlewares/errorHandler.js';
import { BadJsonError } from './utils/customErrors.js';
import commentRouter from './routes/commentRoute.js';

dotenv.config(); // Load environment variables

export const app = express(); // Create an Express application
const port = config.backendPort;

app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});
// Middlewares
app.use(express.json()); // Parse JSON bodies

// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err) next(new BadJsonError('Invalid JSON', err.message));
  next();
});
app.use(standardizedResponse); // Use custom response middleware
// Routes
app.use('/api', itineraryRouter); // Use API routes
app.use('/api', reviewRouter); // Use review routes
app.use('/api', commentRouter); // Use comment routes

app.get('/', (req, res) => {
  // Redirect to API documentation
  res.redirect('/api-docs');
});
app.use(errorHandler);
// Swagger configuration
swaggerSetup(app);

export async function startServer(app) {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
      logger.info(`API documentation is available at http://localhost:${port}/api-docs`);
      logger.debug(`Debug logs are enabled`);
      resolve();
    }).on('error', (err) => {
      reject(err);
    });
  });
}
