import Itinerary from '../db/models/itineraryModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const createComment = async (comment) => {
  const { itineraryId } = comment;
  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    throw new NotFoundError('Itinerary not found');
  }

  comment = {
    ...comment,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  itinerary.comments.push(comment);
  try {
    await itinerary.validate();
    await itinerary.save();
    return comment;
  } catch (error) {
    throw new ValidationError('Comment validation failed', error);
  }
};

export const getCommentsByItinerary = async (itineraryId) => {
  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    throw new NotFoundError('Itinerary not found');
  }
  return itinerary.comments;
};

export const deleteComment = async (commentId) => {
  const itinerary = await Itinerary.findOneAndUpdate(
    { 'comments._id': commentId },
    {
      $pull: {
        comments: { _id: commentId },
      },
    },
    { new: true }
  );
  if (!itinerary) {
    throw new NotFoundError('Comment not found');
  }
  return itinerary;
};

export default {
  createComment,
  getCommentsByItinerary,
  deleteComment,
};
