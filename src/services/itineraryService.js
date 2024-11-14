import ItineraryModel from '../models/itineraryModel.js';
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';

export const getAllItineraries = async () => {
  try {
    return await ItineraryModel.find({});
  } catch (error) {
    throw new BadRequestError('Error fetching itineraries', error);
  }
};

export const createItinerary = async (data) => {
  try {
    const newItinerary = new ItineraryModel(data);
    return await newItinerary.save();
  } catch (error) {
    throw new BadRequestError('Error creating itinerary', error);
  }
};

export const getItineraryById = async (id) => {
  try {
    const itinerary = await ItineraryModel.findById(id);
    if (!itinerary) {
      throw new NotFoundError('Itinerary not found');
    }
    return itinerary;
  } catch (error) {
    throw new NotFoundError('Error fetching itinerary by ID', error);
  }
};

export const updateItinerary = async (id, data) => {
  try {
    const updatedItinerary = await ItineraryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedItinerary) {
      throw new NotFoundError('Itinerary not found');
    }
    return updatedItinerary;
  } catch (error) {
    throw new NotFoundError('Error updating itinerary', error);
  }
};

export const deleteItinerary = async (id) => {
  try {
    const deletedItinerary = await ItineraryModel.findByIdAndDelete(id);
    if (!deletedItinerary) {
      throw new NotFoundError('Itinerary not found');
    }
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
