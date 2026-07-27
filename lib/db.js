import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const uri = process.env.MONGODB_URI;

// Self-logging helper for Plesk debugging
function writeErrorLog(message, error = null) {
  try {
    const logPath = path.join(process.cwd(), "db_error.txt");
    const timestamp = new Date().toISOString();
    const errorDetails = error ? `\nDetails: ${error.stack || error.message}` : "";
    fs.writeFileSync(logPath, `[${timestamp}] ${message}${errorDetails}\n`);
  } catch (e) {
    // Ignore logging failures
  }
}

if (!uri) {
  writeErrorLog("MONGODB_URI is missing in environment variables.");
  throw new Error("Please add MONGODB_URI to process.env");
}

let client;
let clientPromise;

try {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  // Handle connection rejection
  clientPromise.catch((err) => {
    writeErrorLog("MongoDB client failed to connect.", err);
  });
} catch (err) {
  writeErrorLog("MongoDB client initialization threw an error.", err);
  throw err;
}

export default clientPromise;
