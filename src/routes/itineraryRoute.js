import express from 'express';
import * as itineraryController from '../controllers/itineraryController.js';
import * as activityController from '../controllers/activityController.js';

import { validateItinerary } from '../middlewares/itineraryValidator.js';
import { validateActivity } from '../middlewares/activityValidator.js';
// checkAuth is needed always before other checks
import { checkAuth, checkPlan, checkRole, checkAddon } from '../middlewares/authMiddelwares.js';

const router = express.Router();

// Define routes
router.get('/v1/itineraries', itineraryController.getAllItineraries);
router.post('/v1/itineraries', checkAuth(), validateItinerary, itineraryController.createItinerary);
router.get('/v1/itineraries/:id', itineraryController.getItineraryById);
router.put('/v1/itineraries/:id', checkAuth(), validateItinerary, itineraryController.updateItinerary);
router.delete('/v1/itineraries/:id', checkAuth(), itineraryController.deleteItinerary);

// Activities
router.post('/v1/itineraries/:itineraryId/activities', checkAuth(), checkPlan('pro'), validateActivity, activityController.addActivity);
router.get('/v1/itineraries/:itineraryId/activities/:activityIndex', activityController.getActivityFromItinerary);
router.get('/v1/itineraries/:itineraryId/activities', activityController.getActivities);
router.delete('/v1/itineraries/:itineraryId/activities/:activityIndex', checkAuth(), checkPlan('pro'), activityController.deleteActivity);

router.get('/v1/itineraries/:itineraryId/activities/:activityIndex/forecast', checkAuth(), checkAddon('addon2'), activityController.getActivityForecast);

export default router;
