import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected Successfully ! ${connection.connection.host}`
    );
  } catch (err) {
    console.log(`MongoDb Conection Error ${err}`);
    process.exit(1);
  }
};

export default connectDB;
