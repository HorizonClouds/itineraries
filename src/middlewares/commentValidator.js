import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

export const validateComment = [
  // Validación del título: Debe tener entre 1 y 3 palabras
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 1 || wordCount > 10) {
        throw new Error('Title must have between 1 and 10 words');
      }
      return true;
    }),

  // Validación del mensaje: Debe tener entre 3 y 280 caracteres
  body('message')
    .exists({ checkNull: true })
    .isString()
    .withMessage('Message must be a string')
    .isLength({ min: 3, max: 280 })
    .withMessage('Message must be between 3 and 280 characters'),

  // Verificar si existen errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Si hay errores, pasarlos al manejador de errores con un mensaje específico
      return next(new ValidationError('An error occurred while validating comment', errors.array()));
    }
    next();
  },
];
