import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itineraryId: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  title: { type: String, required: true },
  message: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default reviewSchema;
