// import mongoose from "mongoose";
// import { ENV_VARS } from "./envVars.js";

// export const connectDB = async () => {
// 	try {
// 		const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
// 		console.log("MongoDB connected: " + conn.connection.host);
// 	} catch (error) {
// 		console.error("Error connecting to MONGODB: " + error.message);
// 		process.exit(1); // 1 means there was an error, 0 means success
// 	}
// };

import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

// Track connection state globally across serverless invocations
let isConnected = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(ENV_VARS.MONGO_URI, {
      // This stops Mongoose from waiting 10s if the connection isn't ready
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected: " + db.connection.host);
  } catch (error) {
    console.error("Error connecting to MONGODB: " + error.message);
    // DO NOT use process.exit(1) on Vercel; it crashes the serverless function.
    throw error;
  }
};
