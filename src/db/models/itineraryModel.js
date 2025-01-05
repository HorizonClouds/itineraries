// itineraryModel.js

import mongoose from 'mongoose';

import reviewSchema from './reviewSchema.js';
import activitySchema from './activitySchema.js';
import commentSchema from './commentSchema.js';

// Create a schema for Itinerary with validation
export const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
  },
  description: { type: String, required: [true, 'Description is required'] },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  activities: [activitySchema],
  comments: [commentSchema],
  reviews: [reviewSchema],
  category: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create the model from the schema
const ItineraryModel = mongoose.model('Itinerary', itinerarySchema);

export default ItineraryModel; // Export the model
