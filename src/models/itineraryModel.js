// itineraryModel.js

import mongoose from 'mongoose'; // Import Mongoose

// Create a schema for Itinerary with validation
const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Validation: Name is required
    minlength: [3, 'Name must be at least 3 characters long'], // Validation: Minimum length
    maxlength: [50, 'Name must be at most 50 characters long'], // Validation: Maximum length
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  destinationId: {
    type: Number,
    required: [true, 'Destination ID is required'],
  },
  activities: [
    {
      id: Number,
      itineraryId: Number,
      name: String,
      description: String,
      startDate: Date,
      endDate: Date,
      createdAt: Date,
      updatedAt: Date,
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
  ],
  comments: [
    {
      id: Number,
      itineraryId: Number,
      userId: Number,
      comment: String,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
  ratings: [
    {
      id: Number,
      itineraryId: Number,
      userId: Number,
      rating: Number,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
});

// Create the model from the schema
const ItineraryModel = mongoose.model('Itinerary', itinerarySchema);

export default ItineraryModel; // Export the model
