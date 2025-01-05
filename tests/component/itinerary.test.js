import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/expressApp.js';
import Itinerary from '../../src/db/models/itineraryModel.js';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import config from '../../src/config.js';

const exampleItinerary = {
    name: 'Test Itinerary',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    activities: [],
    comments: [],
    reviews: []
};

const user1payload = {
    user: {
        userId: "user1",
        roles: ['admin', 'user'],
        plan: 'pro',
        addons: ['all'],
        name: 'John Doe',
        verifiedEmail: true,
    }
};

const user2payload = {
    user: {
        userId: "user2",
        roles: ['user'],
        plan: 'basic',
        addons: ["addon1"],
        name: 'Jane Smith',
        verifiedEmail: true,
    }
};

const user3payload = {
    user: {
        userId: "user3",
        roles: ['user'],
        plan: 'pro',
        addons: ['addon1', 'addon2'],
        name: 'Alice Johnson',
        verifiedEmail: false,
    }
};
  

/**
 * User 1: Admin, Pro plan, all addons, verified email
 */
const token1 = jwt.sign(user1payload, config.jwtSecret, { expiresIn: '1h' });
/**
 * User 2: User, Basic plan, addon1, verified email
*/
const token2 = jwt.sign(user2payload, config.jwtSecret, { expiresIn: '1h' });
/**
 * User 3: User, Pro plan, addon1, addon2, unverified email
 */
const token3 = jwt.sign(user3payload, config.jwtSecret, { expiresIn: '1h' });

describe('[Integration][Component] Itinerary Tests', () => {
    let itineraryId;
    let mongoServer;
    let token;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        vi.restoreAllMocks();
    });

    beforeEach(async () => {
        const itinerary = await Itinerary.create(exampleItinerary);
        itineraryId = itinerary._id.toString();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should GET health check', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Server is running');
    });

    it('[+] should ADD an itinerary', async () => {
        const response = await request(app)
            .post('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`)
            .send(exampleItinerary);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Test Itinerary');
    });

    it('[+] should GET an itinerary by id', async () => {
        const response = await request(app)
            .get(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(itineraryId);
        expect(response.body.data).toHaveProperty('name', 'Test Itinerary');
    });

    it('[+] should GET all itineraries', async () => {
        const response = await request(app)
            .get('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toHaveProperty('name', 'Test Itinerary');
    });

    it('[+] should DELETE an itinerary by id', async () => {
        const response = await request(app)
            .delete(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token1}`);
        expect(response.status).toBe(200);

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary).toBeNull();
    });

    //post put or delete need to have token
    it('[-] [Auth] POST should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/v1/itineraries')
            .send(exampleItinerary);
        expect(response.status).toBe(401);
    });
    
    it('[-] [Auth] PUT should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put(`/api/v1/itineraries/${itineraryId}`)
            .send(exampleItinerary);
        expect(response.status).toBe(401);
    });

    it('[-] [Auth] DELETE should return 401 if no token is provided', async () => {
        const response = await request(app)
            .delete(`/api/v1/itineraries/${itineraryId}`);
        expect(response.status).toBe(401);
    });

    //Validations
    it('[-] [Validation] POST should return 400 if name is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, name: null };
        const response = await request(app)
            .post('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Name is required');
    });

    it('[-] [Validation] POST should return 400 if description is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, description: null };
        const response = await request(app)
            .post('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Description is required');
    });

    it('[-] [Validation] POST should return 400 if startDate is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, startDate: null };
        const response = await request(app)
            .post('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Start date is required');
    });

    it('[-] [Validation] POST should return 400 if endDate is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, endDate: null };
        const response = await request(app)
            .post('/api/v1/itineraries')
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('End date is required');
    });

    it('[-] [Validation] PUT should return 400 if name is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, name: null };
        const response = await request(app)
            .put(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Name is required');
    });

    it('[-] [Validation] PUT should return 400 if description is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, description: null };
        const response = await request(app)
            .put(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Description is required');
    });

    it('[-] [Validation] PUT should return 400 if startDate is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, startDate: null };
        const response = await request(app)
            .put(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Start date is required');
    });

    it('[-] [Validation] PUT should return 400 if endDate is missing', async () => {
        const invalidItinerary = { ...exampleItinerary, endDate: null };
        const response = await request(app)
            .put(`/api/v1/itineraries/${itineraryId}`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidItinerary);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('End date is required');
    });

});