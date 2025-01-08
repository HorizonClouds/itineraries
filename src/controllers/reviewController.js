import reviewsService from '../services/reviewService.js';

export const addReview = async (req, res, next) => {
  const { itineraryId } = req.params;
  const review = req.body;
  review.userId = req.user.userId;

  try {
    const itinerary = await reviewsService.addReview(itineraryId, review);
    res.sendSuccess(itinerary, 'Review added', 201);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  const { itineraryId } = req.params;

  try {
    const reviews = await reviewsService.getReviews(itineraryId);
    res.sendSuccess(reviews, 'Reviews retrieved', 200);
  } catch (error) {
    next(error);
  }
};

export const getAverageScore = async (req, res, next) => {
  const { itineraryId } = req.params;

  try {
    const averageReview = await reviewsService.getAverageReviewsScore(itineraryId);
    res.sendSuccess({ averageReview }, 'Average score retrieved', 200);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    await reviewsService.deleteReview(reviewId);
    res.sendSuccess({}, 'Review deleted', 200);
  } catch (error) {
    next(error);
  }
};
