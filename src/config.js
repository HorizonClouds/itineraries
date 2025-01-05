import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

export default {
  // API configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  backendPort: parseInt(process.env.BACKEND_PORT, 10) || 6401,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:6402/itineraries',
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'horizon-secret',
  jwtServiceName: process.env.JWT_SERVICE_NAME || 'itineraries-service',
  // Kafka configuration
  kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  kafkaTopic: process.env.KAFKA_TOPIC || 'logs',
  kafkaServiceName: process.env.KAFKA_SERVICE_NAME || 'ITINERARY',
  // Logger configuration
  logLevel: process.env.LOGLEVEL || 'INFO',
  // Gateway URL
  gatewayUrl: process.env.GATEWAY_URL || 'http://localhost:6900',
};
