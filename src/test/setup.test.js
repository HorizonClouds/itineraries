process.env.NODE_ENV = 'test';
console.log('Starting test setup');
import ItineraryModel from '../db/models/itineraryModel.js';

//clean up the database before and after each test
beforeEach(async () => {
  await ItineraryModel.deleteMany({});
});

afterEach(async () => {
  await ItineraryModel.deleteMany({});
});
