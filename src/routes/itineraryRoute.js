import express from 'express';
import * as itineraryController from '../controllers/itineraryController.js';
import * as activityController from '../controllers/activityController.js';

import { validateItinerary } from '../middlewares/itineraryValidator.js';
import { validateActivity } from '../middlewares/activityValidator.js';
// checkAuth is needed allways before other checks
import { checkAuth, checkPlan, checkRole, checkAddon } from '../middlewares/authMiddelwares.js';

const router = express.Router();

// Define routes
router.get('/v1/itineraries', itineraryController.getAllItineraries);
router.post('/v1/itineraries', checkAuth(), validateItinerary, itineraryController.createItinerary);
router.get('/v1/itineraries/:id', itineraryController.getItineraryById);
router.put('/v1/itineraries/:id', checkAuth(), validateItinerary, itineraryController.updateItinerary);
router.delete('/v1/itineraries/:id', checkAuth(), itineraryController.deleteItinerary);

//actividades

router.post('/v1/itineraries/:itineraryId/activities', checkAuth(), validateActivity, activityController.addActivity);

router.delete('/v1/activities/:activityId', checkAuth(), activityController.deleteActivity);
router.get('/v1/activities/:activityId', activityController.getActivityById);
router.get('/v1/activities/:activityId/forecast', checkAuth(), checkAddon('addon2'), activityController.getActivityForecast);

router.get('/v1/itineraries/:itineraryId/activities', activityController.getActivities);

export default router;
