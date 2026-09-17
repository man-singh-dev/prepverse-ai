require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
async function startServer() {
    await connectDB();
    await connectRedis();

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

startServer();