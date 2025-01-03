import activityService from '../services/activityService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

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

    const newActivity = await activityService.addActivity(itineraryId, activityData);

    return res.sendSuccess(newActivity, 'Activity added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const deletedActivity = await activityService.deleteActivity(activityId);

    if (!deletedActivity) throw new NotFoundError('Activity not found');

    return res.sendSuccess(null, 'Activity deleted successfully', 204);
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
