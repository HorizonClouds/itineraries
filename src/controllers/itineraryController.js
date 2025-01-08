import itineraryService from '../services/itineraryService.js';
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

export const getAllItineraries = async (req, res, next) => {
  try {
    const itineraries = await itineraryService.getAllItineraries();
    res.sendSuccess(removeMongoFields(itineraries));
  } catch (error) {
    next(error);
  }
};

export const createItinerary = async (req, res, next) => {
  try {
    let data = req.body;
    data.userId = req.user.userId;
    const newItinerary = await itineraryService.createItinerary(data);
    res.sendSuccess(removeMongoFields(newItinerary), 'Itinerary created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getItineraryById = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const itinerary = await itineraryService.getItineraryById(req.params.id);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(removeMongoFields(itinerary));
  } catch (error) {
    next(error);
  }
};

export const updateItinerary = async (req, res, next) => {
  try {
    let data = req.body;
    data.userId = req.user.userId;
    const updatedItinerary = await itineraryService.updateItinerary(req.params.id, data);
    if (!updatedItinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(removeMongoFields(updatedItinerary), 'Itinerary updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItinerary = async (req, res, next) => {
  try {
    const deletedItinerary = await itineraryService.deleteItinerary(req.params.id);
    if (!deletedItinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(null, 'Itinerary deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};
