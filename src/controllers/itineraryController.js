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
    res.sendError(error);
  }
};

export const createItinerary = async (req, res, next) => {
  try {
    const newItinerary = await itineraryService.createItinerary(req.body);
    res.sendSuccess(
      removeMongoFields(newItinerary),
      'Itinerary created successfully',
      201
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.sendError(new ValidationError('Validation failed', error.errors));
    } else {
      res.sendError(
        new ValidationError('An error occurred while creating the itinerary', [
          { msg: error.message },
        ])
      );
    }
  }
};

export const getItineraryById = async (req, res, next) => {
  try {
    const itinerary = await itineraryService.getItineraryById(req.params.id);
    if (!itinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(removeMongoFields(itinerary));
  } catch (error) {
    res.sendError(error);
  }
};

export const updateItinerary = async (req, res, next) => {
  try {
    let data = req.body;
    // remove _id field from data
    delete data._id;
    const updatedItinerary = await itineraryService.updateItinerary(
      req.params.id,
      data
    );
    if (!updatedItinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(
      removeMongoFields(updatedItinerary),
      'Itinerary updated successfully'
    );
  } catch (error) {
    res.sendError(error);
  }
};

export const deleteItinerary = async (req, res, next) => {
  try {
    const deletedItinerary = await itineraryService.deleteItinerary(
      req.params.id
    );
    if (!deletedItinerary) throw new NotFoundError('Itinerary not found');
    res.sendSuccess(null, 'Itinerary deleted successfully', 204);
  } catch (error) {
    res.sendError(error);
  }
};
