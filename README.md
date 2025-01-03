# Itineraries Microservice

## Project Overview
The Itineraries Microservice is part of the HorizonClouds platform, designed to manage itineraries, activities, reviews, and comments. This microservice provides a robust backend for handling itinerary-related data and integrates with a meteo service for enhanced functionality.

## Key Features
- Manage itineraries with CRUD operations.
- Add, update, and delete activities within itineraries.
- Submit and retrieve reviews for itineraries.
- Add and manage comments on itineraries.
- Integration with Kafka for centralized logging.
- Comprehensive testing with Vitest.

## Installation
### Prerequisites
- Node.js 22.x
- Docker (optional, for MongoDB container)
- MongoDB

### Steps
1. **Clone the repository:**
    ```bash
    git clone https://github.com/HorizonClouds/itineraries.git
    cd itineraries
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and specify values as shown in `.env.example`.

4. **Start the MongoDB container (optional):**
    If you don’t have MongoDB installed locally, you can run it in a Docker container using the provided script.
    ```bash
    npm run start-mongodb
    ```

5. **Run the application in dev mode:**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:6401`. Swagger API documentation will be available at `http://localhost:6401/api-docs`.

## Usage
Once the service is running, you can interact with the API endpoints to manage itineraries, activities, reviews, and comments. Refer to the Swagger documentation for detailed API usage.

## API Documentation
API documentation is available via Swagger at `http://localhost:6401/api-docs`.

## Configuration
The following environment variables need to be set in the `.env` file:
- `NODE_ENV`: Environment (development, production, etc.)
- `BACKEND_PORT`: Port on which the server runs
- `MONGODB_URI`: MongoDB connection string
- `KAFKA_ENABLED`: Enable Kafka logging (true/false)
- `KAFKA_BROKER`: Kafka broker address
- `KAFKA_TOPIC`: Kafka topic for logs
- `KAFKA_SERVICE_NAME`: Kafka service name
- `LOG_LEVEL`: Logging level (DEBUG, INFO, etc.)

Refer to `.env.example` for a template.

## Dependencies
- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `kafkajs`: Kafka client for Node.js
- `dotenv`: Loads environment variables from a .env file
- `swagger-jsdoc` and `swagger-ui-express`: Swagger integration for API documentation
- `joi`: Data validation library
- `express-validator`: Middleware for validating request data

## Testing
Automated tests are written using Vitest. To run the tests:
```bash
npm test
```
Both positive and negative integration tests are included to ensure the robustness of the microservice.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.