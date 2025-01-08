import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

export const validateReview = [
  // body('userId').isMongoId().withMessage('Invalid user ID'), // TODO in the future when we have user authentication
  body('score').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError('An error occurred while validating', errors.array()));
    }
    next();
  },
];
