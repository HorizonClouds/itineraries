import express from 'express';
import * as itineraryController from '../controllers/itineraryController.js';
import { validateItinerary } from '../middlewares/itineraryValidator.js';
const router = express.Router();

// Define routes
router.get('/v1/itineraries', itineraryController.getAllItineraries);
router.post(
  '/v1/itineraries',
  validateItinerary,
  itineraryController.createItinerary
);
router.get('/v1/itineraries/:id', itineraryController.getItineraryById);
router.put(
  '/v1/itineraries/:id',
  validateItinerary,
  itineraryController.updateItinerary
);
router.delete('/v1/itineraries/:id', itineraryController.deleteItinerary);

export default router;
