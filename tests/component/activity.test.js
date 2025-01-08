import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import meteoService from '../../src/services/meteoService.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/expressApp.js';
import Itinerary from '../../src/db/models/itineraryModel.js';
import jwt from 'jsonwebtoken';
import config from '../../src/config.js';

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

const exampleActivity = {
    userId: 'user1',
    name: 'Test Activity',
    description: 'Test Activity Description',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    location: {
        latitude: 37.38283,
        longitude: -5.97317,
        address: 'Seville, Spain'
    }
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
const users = [user1payload, user2payload, user3payload];

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

describe('[Component] Activity Tests', () => {
    let itineraryId;
    let activityIndex = 0;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        vi.mock('../../src/services/meteoService.js', async () => {
            return {
                default: { //meteoService is a module with a default export
                    getForecast: vi.fn(() => getFakeResponse())
                }
            };
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        vi.restoreAllMocks();
    });

    beforeEach(async () => {
        const itinerary = await Itinerary.create(exampleItinerary);
        itineraryId = itinerary._id.toString();
        itinerary.activities.push({ ...exampleActivity, itineraryId });
        await itinerary.save();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should ADD an activity', async () => {
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token1}`)
            .send(exampleActivity);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Test Activity');
    });

    it('[+] should GET an activity by index', async () => {
        const response = await request(app)
            .get(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('name', 'Test Activity');
    });

    it('[+] should GET all activities for an itinerary', async () => {
        const response = await request(app)
            .get(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token1}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toHaveProperty('name', 'Test Activity');
    });

    it('[+] should DELETE an activity by index', async () => {
        const response = await request(app)
            .delete(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}`)
            .set('Authorization', `Bearer ${token1}`);
        console.log(response.body);
        expect(response.status).toBe(200);
    });

    //post put or delete need to have token
    it('[-] [Auth] POST should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .send(exampleActivity);
        expect(response.status).toBe(401);
    });

    it('[-] [Auth] DELETE should return 401 if no token is provided', async () => {
        const response = await request(app)
            .delete(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}`);
        expect(response.status).toBe(401);
    });

    // [Auth][Plan]

    it('[-] [Auth][Plan] POST should return 403 if user plan is not pro', async () => {
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token2}`)
            .send(exampleActivity);
        expect(response.status).toBe(403);
    });


    it('[-] [Auth][Plan] DELETE should return 403 if user plan is not pro', async () => {
        const response = await request(app)
            .delete(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}`)
            .set('Authorization', `Bearer ${token2}`);
        expect(response.status).toBe(403);
    });

    // [Auth][Addon]
    it('[+] [Auth][Addon] GET forecast should return 200 if user has addon2', async () => {
        const response = await request(app)
            .get(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}/forecast`)
            .set('Authorization', `Bearer ${token3}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('daily');
        expect(response.body.data.daily).toHaveProperty('time');
        expect(meteoService.getForecast).toHaveBeenCalled();
    });

    it('[-] [Auth][Addon] GET forecast should return 403 if user does not have addon2', async () => {
        const response = await request(app)
            .get(`/api/v1/itineraries/${itineraryId}/activities/${activityIndex}/forecast`)
            .set('Authorization', `Bearer ${token2}`);
        expect(response.status).toBe(403);
    });

    //Validations
    it('[-] [Validation] POST should return 400 if name is missing', async () => {
        const invalidActivity = { ...exampleActivity, name: null };
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidActivity);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Name is required');
    });

    it('[-] [Validation] POST should return 400 if startDate is missing', async () => {
        const invalidActivity = { ...exampleActivity, startDate: null };
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidActivity);
        expect(response.status).toBe(400);
        expect(response.body.details[0].msg).toBe('Start date is required');
    });

    it('[-] [Validation] POST should return 400 if endDate is missing', async () => {
        const invalidActivity = { ...exampleActivity, endDate: null };
        const response = await request(app)
            .post(`/api/v1/itineraries/${itineraryId}/activities`)
            .set('Authorization', `Bearer ${token1}`)
            .send(invalidActivity);
        expect(response.status).toBe(400);
        console.log(response.body);
        expect(response.body.details[0].msg).toBe('End date is required');
    });
});


const getFakeResponse = () => (
    console.log('getFakeResponse'),
    {
        fake: true,
        latitude: 37.375,
        longitude: -6,
        generationtime_ms: 0.08404254913330078,
        utc_offset_seconds: 0,
        timezone: 'GMT',
        timezone_abbreviation: 'GMT',
        elevation: 19,
        daily_units: {
            time: 'iso8601',
            temperature_2m_max: '°C',
            temperature_2m_min: '°C',
            rain_sum: 'mm',
            precipitation_probability_max: '%',
        },
        daily: {
            time: ['2024-12-31', '2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06'],
            temperature_2m_max: [16.6, 16.5, 16, 15.6, 15.5, 15.5, 15],
            temperature_2m_min: [4.4, 4.9, 3.3, 2.5, 2.8, 10, 10.3],
            rain_sum: [0, 0, 0, 0, 0, 14.5, 2],
            precipitation_probability_max: [0, 0, 0, 0, 4, 70, 78],
        },
    });