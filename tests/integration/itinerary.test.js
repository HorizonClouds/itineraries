import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createItinerary, deleteItinerary, getAllItineraries, getItineraryById } from '../../src/services/itineraryService.js';
import Itinerary from '../../src/db/models/itineraryModel.js';

const exampleItinerary = {
    userId: 'user1',
    name: 'Test Itinerary',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    activities: [],
    comments: [],
    reviews: []
};

describe('[Integration][Service] Itinerary Tests', () => {
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
        const itinerary = await createItinerary(exampleItinerary);
        itineraryId = itinerary._id.toString();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should ADD an itinerary', async () => {
        const result = await createItinerary(exampleItinerary);
        expect(result).toHaveProperty('name', 'Test Itinerary');
        expect(result).toHaveProperty('description', 'Test Description');

        const dbItinerary = await Itinerary.findById(result._id);
        expect(dbItinerary).not.toBeNull();
        expect(dbItinerary.name).toBe('Test Itinerary');
    });

    it('[+] should GET an itinerary by id', async () => {
        const result = await getItineraryById(itineraryId);
        expect(result._id.toString()).toBe(itineraryId);
        expect(result).toHaveProperty('name', 'Test Itinerary');

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary).not.toBeNull();
        expect(dbItinerary.name).toBe('Test Itinerary');
    });

    it('[+] should GET all itineraries', async () => {
        const result = await getAllItineraries();
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'Test Itinerary');

        const dbItineraries = await Itinerary.find();
        expect(dbItineraries).toHaveLength(1);
        expect(dbItineraries[0].name).toBe('Test Itinerary');
    });

    it('[+] should DELETE an itinerary by id', async () => {
        await deleteItinerary(itineraryId);
        const result = await getItineraryById(itineraryId);
        expect(result).toBeNull();

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary).toBeNull();
    });
});
