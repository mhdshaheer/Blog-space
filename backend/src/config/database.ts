import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    
    // Handle connection events
    mongoose.connection.on('error', () => {
      // Silent error handling
    });

    mongoose.connection.on('disconnected', () => {
      // Silent disconnection handling
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    process.exit(1);
  }
};

export default connectDatabase;
