import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as commentService from '../src/services/commentService.js';
import Itinerary from '../src/db/models/itineraryModel.js';
import { NotFoundError, ValidationError } from '../src/utils/customErrors.js';

const exampleItinerary = {
    _id: "AB0000000000000000000001",
    name: 'Test Itinerary',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    activities: [],
    comments: [],
    reviews: []
};

const exampleComment = {
    itineraryId: 'AB0000000000000000000001',
    userId: 'user1',
    title: 'Test Comment',
    message: 'Test Comment',
    author: 'Test Author',
    date: new Date()
};

describe('[Integration][Service] Comment Tests', () => {
    let itineraryId;
    let commentId;
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
        itinerary.comments.push(exampleComment);
        await itinerary.save();
        itineraryId = itinerary._id.toString();
        commentId = itinerary.comments[0]._id.toString();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('[+] should ADD a comment', async () => {
        const result = await commentService.createComment(exampleComment);
        expect(result).toHaveProperty('message', 'Test Comment');
        expect(result).toHaveProperty('author', 'Test Author');

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary.comments).toHaveLength(2);
        expect(dbItinerary.comments[1].message).toBe('Test Comment');
    });

    it('[+] should GET comments by itinerary id', async () => {
        const result = await commentService.getCommentsByItinerary(itineraryId);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('message', 'Test Comment');

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary.comments).toHaveLength(1);
        expect(dbItinerary.comments[0].message).toBe('Test Comment');
    });

    it('[+] should DELETE a comment by id', async () => {
        await commentService.deleteComment(commentId);
        const result = await commentService.getCommentsByItinerary(itineraryId);
        expect(result).toHaveLength(0);

        const dbItinerary = await Itinerary.findById(itineraryId);
        expect(dbItinerary.comments).toHaveLength(0);
    });

    it('[-] should NOT ADD a comment with invalid title', async () => {
        const invalidComment = { ...exampleComment, title: 'This title is too long 6 7 8 9 10 11' };
        await expect(commentService.createComment(invalidComment)).rejects.toThrow(ValidationError);
    });

    it('[-] should NOT ADD a comment with missing message', async () => {
        const invalidComment = { ...exampleComment, message: undefined };
        await expect(commentService.createComment(invalidComment)).rejects.toThrow(ValidationError);
    });

    it('[-] should NOT ADD a comment with short message', async () => {
        const invalidComment = { ...exampleComment, message: 'Hi' };
        await expect(commentService.createComment(invalidComment)).rejects.toThrow(ValidationError);
    });

    it('[-] should NOT ADD a comment with long message', async () => {
        const invalidComment = { ...exampleComment, message: 'a'.repeat(281) };
        await expect(commentService.createComment(invalidComment)).rejects.toThrow(ValidationError);
    });

    it('[-] should NOT GET comments for non-existent itinerary id', async () => {
        const nonExistentItineraryId = "FFFFFFFFFFFFFFFFFFFFFFFF";
        await expect(commentService.getCommentsByItinerary(nonExistentItineraryId)).rejects.toThrow(NotFoundError);
    });

    it('[-] should NOT DELETE a comment with non-existent id', async () => {
        const nonExistentCommentId = "FFFFFFFFFFFFFFFFFFFFFFFF";
        await expect(commentService.deleteComment(nonExistentCommentId)).rejects.toThrow(NotFoundError);
    });
});
