const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("../config/redis");

// protected route ke liye access token check karta hai
async function authMiddleware(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        // token ka hash bana kar redis mein blacklist check karte hain
        const tokenHash = crypto
            .createHash("sha256")
            .update(accessToken)
            .digest("hex");
        const isBlacklisted = await redisClient.get(
            `blacklist:${tokenHash}`
        );
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token has been revoked"
            });
        }
        // access token ko secret key se verify karte hain
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        // decoded user information ko request ke andar store karte hain
        req.user = decoded;
        // token valid hai toh next handler par chale jao
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}

module.exports = authMiddleware;