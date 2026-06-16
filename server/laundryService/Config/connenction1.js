import mongoose from "mongoose";
const url = 'mongodb://0.0.0.0:27017/MyDhobi';
export const DBConnect = async () => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
