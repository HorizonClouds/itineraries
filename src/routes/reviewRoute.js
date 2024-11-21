import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addReview, getReviews, getAverageScore, deleteReview } from '../controllers/reviewController.js';
import { validateReview } from '../middlewares/reviewValidator.js';

const router = express.Router();
const createUUID = (req, res, next) => {
  req.body.id = uuidv4();
  next();
};

router.post('/v1/itineraries/:itineraryId/review', validateReview, createUUID, addReview);
router.get('/v1/itineraries/:itineraryId/reviews', getReviews);
router.get('/v1/itineraries/:itineraryId/average-reviews-score', getAverageScore);
router.delete('/v1/reviews/:reviewId', deleteReview);

export default router;
