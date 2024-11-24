import Itinerary from '../db/models/itineraryModel.js';
import AppErrors from '../utils/customErrors.js';

export const addReview = async (itineraryId, review) => {
  let itinerary;
  try {
    itinerary = await Itinerary.findById(itineraryId);
  } catch (error) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }

  const existingReview = itinerary.reviews.find((reviewN) => reviewN.userId.toString() === review.userId);
  if (existingReview) {
    throw new AppErrors.ValidationError('User has already reviewed this itinerary');
  }

  review = { ...review, createdAt: new Date(), updatedAt: new Date(), itineraryId };
  itinerary.reviews.push(review);

  try {
    await itinerary.validate();
    await itinerary.save();
    return review;
  } catch (error) {
    throw new AppErrors.ValidationError('Review validation failed', error);
  }
};

export const getReviews = async (itineraryId) => {
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    return itinerary.reviews;
  } catch (error) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }
};

export const getAverageReview = async (itineraryId) => {
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    const averageReview = itinerary.reviews.reduce((acc, review) => acc + review.score, 0) / itinerary.reviews.length;
    return averageReview;
  } catch (error) {
    throw new AppErrors.NotFoundError('Itinerary not found');
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { 'reviews._id': reviewId },
      {
        $pull: {
          reviews: { _id: reviewId },
        },
      },
      { new: true }
    );
    return itinerary;
  } catch (error) {
    throw new AppErrors.NotFoundError('Review not found');
  }
};

export default {
  addReview,
  getReviews,
  getAverageReviewsScore: getAverageReview,
  deleteReview,
};
