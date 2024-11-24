import express from 'express';
import { addReview, getReviews, getAverageScore, deleteReview } from '../controllers/reviewController.js';
import { validateReview } from '../middlewares/reviewValidator.js';

const router = express.Router();

router.post('/v1/itineraries/:itineraryId/reviews', validateReview, addReview);
router.get('/v1/itineraries/:itineraryId/reviews', getReviews);
router.get('/v1/itineraries/:itineraryId/average-reviews-score', getAverageScore);
router.delete('/v1/reviews/:reviewId', deleteReview);

export default router;
