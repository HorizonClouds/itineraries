import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';
import ItineraryModel from '../db/models/itineraryModel.js';

// Validation middleware for ItineraryModel
export const validateItinerary = [
  // Validate 'name' field
  body('name')
    .exists({ checkNull: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must be at most 50 characters long'),

  // Validate 'description' field
  body('description')
    .exists({ checkNull: true })
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),

  // Validate 'startDate' field
  body('startDate')
    .exists({ checkNull: true })
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  // Validate 'endDate' field
  body('endDate')
    .exists({ checkNull: true })
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),

  // Validate 'destinationId' field
  body('destinationId')
    .exists({ checkNull: true })
    .withMessage('Destination ID is required')
    .withMessage('Destination ID must be a number'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ValidationError('An error occurred while validating the itinerary', errors.array()));
    }
    next();
  },
];
