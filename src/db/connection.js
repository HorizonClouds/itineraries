import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from '../config.js';

dotenv.config();

const connectDB = async () => {
  logger.info('Connecting to MongoDB...');
  let mongoURI = config.mongoURI;
  let mongod;

  if (process.env.NODE_ENV === 'test') {
    mongod = await MongoMemoryServer.create();
    mongoURI = mongod.getUri();
  }

  try {
    //timeout 3 seconds
    await mongoose.connect(mongoURI, { connectTimeoutMS: 3000, serverSelectionTimeoutMS: 5000 });
    logger.info(`Connected to MongoDB in ${process.env.NODE_ENV === 'test' ? 'test (in-memory)' : 'default'} mode`);
    //Delete all data in the database when connect (dev purposes)
    // await mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.error('Initial connection failed, retrying with in-memory MongoDB.', error.message);
    if (!mongod) {
      mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
    }
    try {
      await mongoose.connect(mongoURI);
      logger.info('Connected to in-memory MongoDB after initial failure');
    } catch (err) {
      console.error('Failed to connect to in-memory MongoDB', err);
    }
  }
};

export default connectDB;
