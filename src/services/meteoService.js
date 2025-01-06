import axios from 'axios';
import { getServiceUrl } from '../utils/infrastructure.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { MeteoServiceError } from '../utils/customErrors.js';

export async function getForecast(latitude, longitude) {
    const meteoServiceUrl = await getServiceUrl('meteo');
    if (!meteoServiceUrl) {
        logger.error('Cannot retrieve forecast data: Meteo service URL not found.');
        return null;
    }
    const token = jwt.sign({ serviceId: 'itineraries-service', message: "Hello From ITINERARY Service" }, config.jwtSecret, {});

    try {
        const response = await axios.get(`${meteoServiceUrl}/api/v1/forecast`, {
            params: {
                latitude,
                longitude,
                daily: 'temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max',
                forceOpen: false
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        logger.info('Forecast data successfully retrieved.');
        logger.debug(JSON.stringify(response.data));
        return response.data.data;
    } catch (error) {
        logger.error('Error retrieving forecast data');
        throw new MeteoServiceError('Error retrieving forecast data', { code: error.code, message: error.message, responseData: error.response?.data });
    }
}

export default { getForecast };
