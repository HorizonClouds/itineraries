import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Itinerary from '../../src/db/models/itineraryModel.js';
import * as reviewService from '../../src/services/reviewService.js';

const exampleItinerary = {
    _id: "A00000000000000000000001",
    name: 'Test Itinerary',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date() + 10 * 24 * 60 * 60 * 1000,
    activities: [],
    comments: [],
    reviews: []
};

const exampleReview = {
    itineraryId: 'A00000000000000000000001',
    userId: 'user1',
    title: 'Great!',
    score: 5,
    message: 'Great!'
};


describe('(integration) Review SERVICE Tests', () => {
    let itineraryId;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        const itinerary = new Itinerary(exampleItinerary);
        await itinerary.save();
        itineraryId = itinerary._id.toString();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should ADD a review', async () => {
        const review = exampleReview;
        let result;
        try {
            result = await reviewService.addReview(itineraryId, review);
        } catch (e) {
            console.log(e);
        }
        expect(result).toHaveProperty('userId', 'user1');
        expect(result).toHaveProperty('score', 5);
        expect(result).toHaveProperty('message', 'Great!');
    });

    it('[+] should GET reviews', async () => {
        const review = exampleReview;
        const itinerary = await Itinerary.findById(itineraryId);
        itinerary.reviews.push(review);
        await itinerary.save();
        const reviews = await reviewService.getReviews(itineraryId);
        expect(reviews).toHaveLength(1);
        expect(reviews[0]).toHaveProperty('userId', 'user1');
        expect(reviews[0]).toHaveProperty('score', 5);
    });

    it('[+] should GET average review score', async () => {
        const review = { ...exampleReview, userId: 'user1', score: 5 };
        const review2 = { ...exampleReview, userId: 'user2', score: 3 };
        const itinerary = await Itinerary.findById(itineraryId);
        itinerary.reviews.push(review);
        itinerary.reviews.push(review2);
        await itinerary.save();

        const averageScore = await reviewService.getAverageReview(itineraryId);
        expect(averageScore).toBe(4);
    });

    it('[+] should DELETE a review', async () => {
        const review = exampleReview;
        const itinerary = await Itinerary.findById(itineraryId);
        itinerary.reviews.push(review);
        await itinerary.save();

        const reviews = await reviewService.getReviews(itineraryId);
        let reviewId = reviews[0]._id.toString();
        const result = await reviewService.deleteReview(reviewId);
        expect(result.reviews).toHaveLength(0);
    });
});
