import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if(!MONGODB_URL){
    throw new error("Please define the MONGODB_URI environment variable in .env.local");
}

let  cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null,promise: null};
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;