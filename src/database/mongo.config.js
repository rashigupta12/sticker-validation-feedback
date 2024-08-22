import mongoose from "mongoose";

const connection = {};

export async function connect() {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "stickerdata", // Specify the database name here
      
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Handle error without exiting the process
    throw new Error("Database connection failed");
  }
}
