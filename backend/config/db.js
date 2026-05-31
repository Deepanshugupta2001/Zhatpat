import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

// const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || LOCAL_MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
