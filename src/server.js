// server.js
import './utils/logger.js';
import {app, startServer} from './expressApp.js';
import connectDB from './db/connection.js';


// Connect to MongoDB and start server
connectDB()
  .then(() => {
    startServer(app);
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:' + error.message);
  });

