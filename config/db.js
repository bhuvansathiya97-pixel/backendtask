const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URL;
  if (!MONGO_URI){
    console.error('Error: No MONGO_URL is defined in your environment variables');
    processexit(1);
}   

try {
    await mongoose.connect(MONGO_URI);
    console.log('Connnected to MongoDB successfully');
} catch (err) {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
}
};
module.exports = connectDB;