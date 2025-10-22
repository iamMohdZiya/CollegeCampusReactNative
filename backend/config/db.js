// config/db.js

const mongoose = require('mongoose');
const { MONGO_URI } = require('./keys');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // These options are often included for stable connections
      // but may not be strictly necessary with newer Mongoose versions.
      // useNewUrlParser: true, 
      // useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;