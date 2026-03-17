import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in environment");
}

declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "structify",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB ERROR ❌", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
