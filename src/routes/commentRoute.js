import express from 'express';
import {
  createComment,
  getCommentsForItinerary,
  deleteComment,
  updateComment,
} from '../controllers/commentController.js';
import { validateComment } from '../middlewares/commentValidator.js';
import { checkAuth, checkPlan, checkRole, checkAddon } from '../middlewares/authMiddelwares.js';

const router = express.Router();

router.post('/v1/itineraries/:itineraryId/comments', checkAuth(), validateComment, createComment);
router.get('/v1/itineraries/:itineraryId/comments', getCommentsForItinerary);
router.delete('/v1/comments/:commentId', checkAuth(), deleteComment);
router.put('/v1/comments/:commentId', checkAuth(), updateComment);

export default router;
