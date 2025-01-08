import ItineraryModel from '../db/models/itineraryModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const getAllItineraries = async () => {
  return await ItineraryModel.find({});
};

export const createItinerary = async (data) => {
  try {
    const newItinerary = new ItineraryModel(data);
    await newItinerary.validate();
    return newItinerary.save();
  } catch (error) {
    throw new ValidationError('Error validating itinerary', error);
  }
};

export const getItineraryById = async (id) => {
  try {
    const itinerary = await ItineraryModel.findById(id);
    return itinerary;
  } catch (error) {
    throw new NotFoundError('Itinerary not found', error);
  }
};

export const updateItinerary = async (id, data) => {
  let originalItinerary = await ItineraryModel.findById(id);
  if (!originalItinerary) {
    throw new NotFoundError('Itinerary not found');
  }
  try {
    await ItineraryModel.validate(data);
  } catch (error) {
    throw new ValidationError('Error validating itinerary', error);
  }
  try {
    const updatedItinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          userId: data.userId || originalItinerary.userId,
          name: data.name || originalItinerary.name,
          description: data.description || originalItinerary.description,
          startDate: data.startDate || originalItinerary.startDate,
          endDate: data.endDate || originalItinerary.endDate,
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );
    return updatedItinerary;
  } catch (error) {
    throw new NotFoundError('Itinerary not found', error);
  }
};

export const deleteItinerary = async (id) => {
  try {
    const deletedItinerary = await ItineraryModel.findByIdAndDelete(id);
    return deletedItinerary;
  } catch (error) {
    throw new NotFoundError('Error deleting itinerary', error);
  }
};

export default {
  getAllItineraries,
  createItinerary,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
};
