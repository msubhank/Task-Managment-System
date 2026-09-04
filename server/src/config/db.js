const mongoose = require('mongoose');

let isInMemory = false;
let memoryServer = null;

/**
 * Connect to MongoDB with graceful fallback:
 * 1. If MONGO_URI is set, attempts connection.
 * 2. If MONGO_URI is empty or connection fails in development,
 *    spins up an in-memory MongoDB server for instant zero-setup development.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI && process.env.MONGO_URI.trim();

  if (uri) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`\x1b[32m[MongoDB]\x1b[0m Connected to external database: ${conn.connection.host}`);
      isInMemory = false;
      return conn;
    } catch (err) {
      console.warn(`\x1b[33m[MongoDB Warning]\x1b[0m Failed to connect to external URI (${err.message}).`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('\x1b[36m[MongoDB Fallback]\x1b[0m Falling back to in-memory MongoDB server...');
    }
  } else {
    console.log('\x1b[36m[MongoDB]\x1b[0m No MONGO_URI provided in .env. Initializing in-memory MongoDB server for development...');
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    isInMemory = true;
    console.log(`\x1b[32m[MongoDB]\x1b[0m Connected to in-memory database successfully at: ${memoryUri}`);
    return conn;
  } catch (err) {
    console.error(`\x1b[31m[MongoDB Error]\x1b[0m Could not connect to any MongoDB instance: ${err.message}`);
    process.exit(1);
  }
};

const getDBStatus = () => {
  const readyState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  return {
    state: states[readyState] || 'Unknown',
    isConnected: readyState === 1,
    isInMemory,
    host: mongoose.connection.host || 'unknown',
    database: mongoose.connection.name || 'taskmanager'
  };
};

module.exports = { connectDB, getDBStatus };
