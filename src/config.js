import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

export default {
  // API configuration
  backendPort: parseInt(process.env.BACKEND_PORT, 10) || 3000,
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'meteo-secret',
  jwtServiceName: process.env.JWT_SERVICE_NAME || 'itineraries-service',
  // Kafka configuration
  kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  kafkaTopic: process.env.KAFKA_TOPIC || 'logs',
  kafkaServiceName: process.env.KAFKA_SERVICE_NAME || 'meteo',
  // Logger configuration
  logLevel: process.env.LOGLEVEL || 'INFO',
};
