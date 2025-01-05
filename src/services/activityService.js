import ItineraryModel from '../db/models/itineraryModel.js';
import { NotFoundError, BadRequestError, ValidationError } from '../utils/customErrors.js';
import mongoose from 'mongoose';

export const addActivity = async (itineraryId, activityData) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }

  const newActivity = {
    ...activityData,
    itineraryId: itinerary._id.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  itinerary.activities.push(newActivity);
  let resultItinerary;
  try {
    await itinerary.validate();
    resultItinerary = await itinerary.save();
  } catch (error) {
    throw new ValidationError('Error validating itinerary', error);
  }
  return resultItinerary.activities[resultItinerary.activities.length - 1];
};

export const deleteActivity = async (itineraryId, activityIndex) => {
  let itinerary;
  try {
    console.log(`Finding itinerary with ID: ${itineraryId}`);
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    console.error(`Error finding itinerary: ${error.message}`);
    throw new NotFoundError('Itinerary not found');
  }

  try {
    if (activityIndex < 0 || activityIndex >= itinerary.activities.length) {
      console.warn(`Activity index out of bounds: ${activityIndex}`);
      throw new NotFoundError('Activity not found');
    }
    console.log(`Deleting activity at index: ${activityIndex}`);
    itinerary.activities.splice(activityIndex, 1);
    await itinerary.save();
    console.log(`Activity deleted successfully`);
    return itinerary.activities;
  } catch (error) {
    console.error(`Error deleting activity: ${error.message}`);
    throw new BadRequestError('Error deleting activity', error);
  }
};

export const getActivities = async (itineraryId) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }
  return itinerary.activities;
};

export const getActivityFromItinerary = async (itineraryId, activityIndex) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }
  const activity = itinerary.activities[activityIndex];
  if (!activity) throw new NotFoundError('Activity not found');
  return activity;
};

export default { addActivity, deleteActivity, getActivities, getActivityFromItinerary };
