import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
  let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice';
  let mode = 'default';
  if (process.env.NODE_ENV === 'test') {
    mode = 'test (in-memory)';
    const mongod = new MongoMemoryServer(); // Fake MongoDB for testing
    await mongod.start();
    mongoURI = mongod.getUri();
    console.log(mongoURI);
  }

  return mongoose.connect(mongoURI).then(() => {
    console.log(`Connected to MongoDB in ${mode} mode`);
  });
};

export default connectDB;
