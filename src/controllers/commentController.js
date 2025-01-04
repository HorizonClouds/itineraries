import commentService from '../services/commentService.js';

export const createComment = async (req, res, next) => {
  const { itineraryId } = req.params;
  const comment = req.body;
  comment.itineraryId = itineraryId;

  try {
    comment.userId = req.user.id;
    const savedComment = await commentService.createComment(comment);
    res.sendSuccess(savedComment, 'Comment added', 201);
  } catch (error) {
    next(error);
  }
};

export const getCommentsForItinerary = async (req, res, next) => {
  const { itineraryId } = req.params;

  try {
    const comments = await commentService.getCommentsByItinerary(itineraryId);
    res.sendSuccess(comments, 'Comments retrieved', 200);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    await commentService.deleteComment(commentId);
    res.sendSuccess({}, 'Comment deleted', 200);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const commentData = req.body;

  try {
    const updatedComment = await commentService.updateComment(commentId, commentData);
    res.sendSuccess(updatedComment, 'Comment updated', 200);
  } catch (error) {
    next(error);
  }
};

export default {
  getCommentsForItinerary,
  createComment,
  updateComment,
  deleteComment,
};
