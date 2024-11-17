import express from 'express';
import * as itineraryController from '../controllers/itineraryController.js';
import * as activityController from '../controllers/activityController.js'; 

import { validateItinerary } from '../middlewares/itineraryValidator.js';
import { validateActivity } from '../middlewares/activityValidator.js';

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

//actividades

router.post(
  '/v1/itineraries/:itineraryId/activities',
  validateActivity,
  activityController.addActivity
);

router.delete('/v1/itineraries/:itineraryId/activities/:activityId', activityController.deleteActivity);
router.get('/v1/itineraries/:itineraryId/activities', activityController.getActivities);


export default router;
