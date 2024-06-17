import mongoose, { Mongoose } from "mongoose";

const mongoUrl: string = process.env.MONGO_URL || "mongodb+srv://root:root@buildspace-dev-cluster.ypczif0.mongodb.net/";

interface DbClient {
  connection: Mongoose;
}

const connectToDb = async (): Promise<DbClient | null> => {
  try {
    const connection = await mongoose.connect(mongoUrl);

    console.log("Connected to the database");

    return { connection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
};

export default connectToDb;
