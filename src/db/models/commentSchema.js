import mongoose from 'mongoose';

export const commentSchema = new mongoose.Schema({
  itineraryId: { type: String, required: true },
  userId: { type: String, required: true },
  title: {
    type: String,
    required: false,
    validate: {
      validator: function (value) {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount >= 1 && wordCount <= 10;
      },
      message: 'Title must have between 1 and 10 words',
    },
  },
  message: {
    type: String,
    required: true,
    minlength: [3, 'Message must be at least 3 characters long'],
    maxlength: [280, 'Message must be at most 280 characters long'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default commentSchema;
