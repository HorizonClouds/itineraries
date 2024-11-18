//Populate the database with some data, using db/connection.js to connect to the database.
import connectDB from './connection.js';
import fs from 'fs';
import ItineraryModel from './models/itineraryModel.js';

const filesPath = './src/db/examples/';

const populate = async () => {
  await connectDB();

  const itineraries = JSON.parse(fs.readFileSync(filesPath + 'itineraries.json', 'utf-8'));
  await ItineraryModel.insertMany(itineraries);
  console.log('Itineraries populated');
  process.exit();
};
populate();
