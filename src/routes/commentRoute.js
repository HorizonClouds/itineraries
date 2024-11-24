import express from 'express';
import {
  createComment,
  getCommentsForItinerary,
  deleteComment,
  updateComment,
} from '../controllers/commentController.js';
import { validateComment } from '../middlewares/commentValidator.js';

const router = express.Router();

router.post('/v1/itineraries/:itineraryId/comments', validateComment, createComment);
router.get('/v1/itineraries/:itineraryId/comments', getCommentsForItinerary);
router.delete('/v1/comments/:commentId', deleteComment);
router.put('/v1/comments/:commentId', updateComment);

export default router;
