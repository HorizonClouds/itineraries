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

export const deleteActivity = async (itineraryId, activityId) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }

  const activityIndex = itinerary.activities.findIndex(activity => activity._id.toString() === activityId);
  if (activityIndex === -1) throw new NotFoundError('Activity not found');

  itinerary.activities.splice(activityIndex, 1);
  await itinerary.save();
  return itinerary.activities;
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

export const getActivityFromItinerary = async (itineraryId, activityId) => {
  let itinerary;
  try {
    itinerary = await ItineraryModel.findById(itineraryId);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
  } catch (error) {
    throw new NotFoundError('Itinerary not found');
  }
  const activity = itinerary.activities.find(activity => activity._id.toString() === activityId);
  if (!activity) throw new NotFoundError('Activity not found');
  return activity;
};

export default { addActivity, deleteActivity, getActivities, getActivityFromItinerary };
