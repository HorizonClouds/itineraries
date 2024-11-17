import activityService from '../services/activityService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';
import itineraryService from '../services/itineraryService.js';


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

export const addActivity = async (req, res) => {
    try {
      const { itineraryId } = req.params;
      const activityData = req.body;
  
      //buscar el destino por itinerario
      if (!activityData.destinationId) {
        const itinerary = await itineraryService.getItineraryById(itineraryId); 
        if (!itinerary) throw new NotFoundError('Itinerary not found');
        activityData.destinationId = itinerary.destinationId;
      }
  
      const newActivity = await activityService.addActivity(itineraryId, activityData);
  
      return res.sendSuccess(newActivity, 'Activity added successfully', 201);
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidationError') {
        return res.sendError(new ValidationError('Validation failed', error.errors));
      } else {
        return res.sendError(new ValidationError('An error occurred while adding the activity', [
          { msg: error.message },
        ]));
      }
    }
  };

export const deleteActivity = async (req, res) => {
  try {
    const { itineraryId, activityId } = req.params;
    const deletedActivity = await activityService.deleteActivity(itineraryId, activityId);

    if (!deletedActivity) throw new NotFoundError('Activity not found');
    
    return res.sendSuccess(null, 'Activity deleted successfully', 204);
  } catch (error) {
    return res.sendError(error);
  }
};

export const getActivities = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const activities = await activityService.getActivities(itineraryId);

    return res.sendSuccess(removeMongoFields(activities), 'Activities retrieved successfully');
  } catch (error) {
    return res.sendError(error);
  }
};


