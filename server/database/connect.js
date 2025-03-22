import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

const connectdb = async () => {
  try {
    await mongoose.connect(uri, {});
    console.log("Database is connected!🚀");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

export default connectdb;