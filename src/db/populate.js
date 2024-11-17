const fs = require('fs');
const path = require('path');
const db = require('./db'); // Assuming you have a db module to interact with your database

const populateDatabase = async () => {
  const filePath = path.join(__dirname, 'data.js'); // Adjust the path to your data file
  const data = require(filePath);

  try {
    // Assuming data is an array of items to be inserted into the database
    for (const item of data) {
      await db.insert(item); // Adjust this to your actual database insertion logic
    }
    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

module.exports = populateDatabase;
