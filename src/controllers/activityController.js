import activityService from '../services/activityService.js';
import meteoService from '../services/meteoService.js';
import { NotFoundError } from '../utils/customErrors.js';

const removeMongoFields = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const { __v, ...rest } = item.toObject();
      return rest;
    });
  } else {
    const { __v, ...rest } = data.toObject();
    return rest;
  }
};

export const addActivity = async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const activityData = req.body;
    console.log(req.user);
    activityData.userId = req.user.userId;

    const newActivity = await activityService.addActivity(itineraryId, activityData);

    return res.sendSuccess(newActivity, 'Activity added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const { itineraryId, activityIndex } = req.params;
    const deletedActivity = await activityService.deleteActivity(itineraryId, activityIndex);

    if (!deletedActivity) throw new NotFoundError('Activity not found');

    return res.sendSuccess(null, 'Activity deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getActivities = async (req, res, next) => {
  try {
    const { itineraryId } = req.params;
    const activities = await activityService.getActivities(itineraryId);

    return res.sendSuccess(removeMongoFields(activities), 'Activities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getActivityForecast = async (req, res, next) => {
  try {
    const { itineraryId, activityIndex } = req.params;
    const activity = await activityService.getActivityFromItinerary(itineraryId, activityIndex);

    if (!activity) throw new NotFoundError('Activity not found');

    const { latitude, longitude } = activity.location;
    logger.debug(`Retrieving forecast for activity ${activityIndex} in itinerary ${itineraryId}; coordinates: ${latitude}, ${longitude}`);

    const forecast = await meteoService.getForecast(latitude, longitude);
    return res.sendSuccess(forecast, 'Forecast retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getActivityFromItinerary = async (req, res, next) => {
  try {
    const { itineraryId, activityIndex } = req.params;
    const activity = await activityService.getActivityFromItinerary(itineraryId, activityIndex);

    return res.sendSuccess(removeMongoFields(activity), 'Activity retrieved successfully');
  } catch (error) {
    next(error);
  }
};
