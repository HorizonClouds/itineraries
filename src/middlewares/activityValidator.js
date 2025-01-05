import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

// Validation middleware for Activity
export const validateActivity = [
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

  //check startDate is before endDate; send the same erro syntax as the other fields
  body()
    .custom((value, { req }) => {
      if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),


  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ValidationError('An error occurred while validating the itinerary', errors.array()));
    }
    next();
  },
];
