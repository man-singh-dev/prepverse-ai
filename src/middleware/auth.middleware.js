const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("../config/redis");

async function authMiddleware(req, res, next) {
    try {
        // Get JWT from the cookie
        const token = req.cookies.token;

        // No token = user isn't logged in
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // convert token into a SHA-256 hash.
        // we store the hash in Redis instead of storing
        // the actual JWT.
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // check whether this token has been blacklisted.
        const isBlacklisted = await redisClient.get(
            `blacklist:${tokenHash}`
        );
        // If Redis has this token, it means the user
        // has already logged out with this token.
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token has been revoked"
            });
        }
        // Token isn't blacklisted.
        // Now verify that the JWT itself is valid.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        // Store decoded user information in req.user
        // so protected controllers can access it.
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;