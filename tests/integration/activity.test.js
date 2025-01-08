
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Itinerary from '../../src/db/models/itineraryModel.js';
import * as activityService from '../../src/services/activityService.js';
import { ValidationError, NotFoundError } from '../../src/utils/customErrors.js';

const exampleItinerary = {
    _id: "A00000000000000000000001",
    userId: 'user1',
    name: 'Test Itinerary',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date() + 10 * 24 * 60 * 60 * 1000,
    activities: [],
    comments: [],
    reviews: []
};

const exampleActivity = {
    userId: 'user1',
    name: 'Surfing',
    description: 'Surfing at the beach',
    startDate: new Date(),
    endDate: new Date() + 1 * 24 * 60 * 60 * 1000,
    location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Fuengirola Beach'
    }
};

describe('(integration) Activity SERVICE Tests', () => {
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
        exampleActivity.itineraryId = itineraryId;
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should ADD an activity', async () => {
        const activity = exampleActivity;
        let result;
        try {
            result = await activityService.addActivity(itineraryId, activity);
        } catch (e) {
            console.log(e);
        }
        expect(result).toHaveProperty('userId', 'user1');
        expect(result).toHaveProperty('name', 'Surfing');
        expect(result).toHaveProperty('description', 'Surfing at the beach');
    });

    it('[+] should GET activities', async () => {
        const activity = exampleActivity;
        const itinerary = await Itinerary.findById(itineraryId);
        itinerary.activities.push(activity);
        await itinerary.save();
        const activities = await activityService.getActivities(itineraryId);
        expect(activities).toHaveLength(1);
        expect(activities[0]).toHaveProperty('userId', 'user1');
        expect(activities[0]).toHaveProperty('name', 'Surfing');
    });

    it('[+] should DELETE an activity', async () => {
        const activity = exampleActivity;
        const itinerary = await Itinerary.findById(itineraryId);
        itinerary.activities.push(activity);
        await itinerary.save();
        const result = await activityService.deleteActivity(itineraryId, 0);
        expect(result).toHaveLength(0);
    });

    it('[-] should NOT ADD an activity with missing required fields', async () => {
        const activity = { ...exampleActivity, name: '' }; // Missing required field 'name'
        let error;
        try {
            await activityService.addActivity(itineraryId, activity);
        } catch (e) {
            error = e;
        }
        expect(error).toBeInstanceOf(ValidationError);
    });

    it('[-] should NOT DELETE a non-existent activity', async () => {
        let error;
        try {
            await activityService.deleteActivity('nonexistentActivityId');
        } catch (e) {
            error = e;
        }
        expect(error).toBeInstanceOf(NotFoundError);
    });
});