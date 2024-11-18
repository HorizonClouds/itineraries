import Itinerary from '../db/models/itineraryModel.js';
import AppErrors from '../utils/customErrors.js';

export const addReview = async (itineraryId, review) => {
  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }
  review = { ...review, createdAt: new Date() , updatedAt: new Date() };

  const existingReview = itinerary.reviews.find((reviewN) => reviewN.userId.toString() === review.userId);
  if (existingReview) {
    existingReview.score = review.score;
  } else {
    itinerary.reviews.push({ ...review, itineraryId });
  }
  let errors = itinerary.validateSync();
  if (errors) {
    throw new AppErrors.ValidationError('Invalid review data', errors.errors);
  }

  await itinerary.save();
  return existingReview || review;
};

export const getReviews = async (itineraryId) => {
  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }
  return itinerary.reviews;
};

export const getAverageReview = async (itineraryId) => {
  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }

  const averageReview = itinerary.reviews.reduce((acc, review) => acc + review.score, 0) / itinerary.reviews.length;
  return averageReview;
};

export const deleteReview = async (reviewId) => {
  //it.reviews.id (reviewId)
  const itinerary = await Itinerary.findOneAndUpdate(
    { 'reviews.id': reviewId },
    {
      $pull: {
        reviews: { id: reviewId },
      },
    },
    { new: true }
  );

  if (!itinerary) {
    throw new AppErrors.NotFoundError('Review not found');
  }
  return itinerary;
};

export default {
  addReview,
  getReviews,
  getAverageReviewsScore: getAverageReview,
  deleteReview,
};
