import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('\x1b[35m[MONGODB] Connected successfully\x1b[0m');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('\x1b[31m[MONGODB] Connection error:', err, '\x1b[0m');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('\x1b[33m[MONGODB] Connection lost\x1b[0m');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error: any) {
    console.error('\x1b[31m[MONGODB] Initial connection failed:', error.message, '\x1b[0m');
    process.exit(1);
  }
};

export default connectDatabase;
