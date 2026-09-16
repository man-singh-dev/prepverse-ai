const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

// redis connection me koi error aaye to yahan dikhega
redisClient.on("error", (err) => {
    console.error("redis error:", err);
});

const connectRedis = async () => {
    await redisClient.connect();

    // ye bas confirm karne ke liye hai ki redis connect ho gaya
    console.log("redis connected");
};

module.exports = { redisClient, connectRedis };