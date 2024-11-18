//We use different swagger files for each component
//This file is used to combine all the swagger files into one

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Itinerary API',
      version: '1.0.0',
      description: 'API documentation for Itinerary microservice',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

//Use this to serve the swagger documentation
export const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
