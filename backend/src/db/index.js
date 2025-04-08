import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined.');
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'expense-tracker', 
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process on connection failure
  }
};

export default connectDB;