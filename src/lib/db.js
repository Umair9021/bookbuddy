import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

   if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      ssl: true,                      // Enable SSL
      tls: true,                      // Enable TLS
      tlsAllowInvalidCertificates: false, // Do not allow invalid certs
      serverSelectionTimeoutMS: 5000, // Fail fast if cannot connect
      retryWrites: true,              // Retry writes (Atlas default)
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;