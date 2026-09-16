const mongoose = require("mongoose");
async function connectDB() {
    try {
        // Connect to MongoDB using the connection string
        // stored in our .env file.
        await mongoose.connect(process.env.MONGO_URI);
        // This will only execute if MongoDB connection succeeds.
        console.log("Database connected successfully");
    } catch (error) {
        // If MongoDB connection fails, show the actual error.
        console.error("Error connecting to database:", error.message);
        // Stop the application because our backend
        // cannot work properly without the database.
        process.exit(1);
    }
}
module.exports = connectDB;