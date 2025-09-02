import mongoose from "mongoose";

const uri = "mongodb+srv://umair9021:UMAir9286701@cluster0.9t9olob.mongodb.net/Bookbuddy?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    const conn = await mongoose.connect(uri, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true, // ⚠️ dev only
    });
    console.log("✅ Connected to MongoDB Atlas:", conn.connection.name);
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  }
}

testConnection();