import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    // Connection handled silently for production


    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      // Reconnection handled silently

    });

  } catch (error) {
    console.error(`CRITICAL: MongoDB Connection Failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;
