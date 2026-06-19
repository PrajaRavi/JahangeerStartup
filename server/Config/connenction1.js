import mongoose from "mongoose";

//! use in production
// const uri=`mongodb://RaviPraj:8976427743Ravi@ac-vt6l4to-shard-00-00.hczq4cc.mongodb.net:27017,ac-vt6l4to-shard-00-01.hczq4cc.mongodb.net:27017,ac-vt6l4to-shard-00-02.hczq4cc.mongodb.net:27017/?ssl=true&replicaSet=atlas-12zwr1-shard-0&authSource=admin&appName=Cluster0`

//! use in developement
const uri = 'mongodb://0.0.0.0:27017/MyDhobi'
export const DBConnect = async () => {

  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {

    console.error("Database connection failed:", error);
  }
};

