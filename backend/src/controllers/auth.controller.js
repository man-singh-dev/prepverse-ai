const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redisClient } = require("../config/redis");

// access token short-lived hota hai aur normal api requests ke liye use hota hai
function generateAccessToken(user, sessionId) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            sessionId
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
}

// refresh token long-lived hota hai aur naya access token lene ke liye use hota hai
function generateRefreshToken(user, sessionId, jti) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            sessionId,
            jti
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
}

// dono tokens ko secure http-only cookies mein store karta hai
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}


/**
 * @name registerUserController
 * @description register a new user
 * @access public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    const sessionId = crypto.randomUUID();
    const refreshTokenId = crypto.randomUUID();

    const accessToken = generateAccessToken(
        newUser,
        sessionId
    );

    const refreshToken = generateRefreshToken(
        newUser,
        sessionId,
        refreshTokenId
    );

    // session ki information redis mein store karte hain
    await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify({
            refreshTokenId,
            userId: newUser._id.toString()
        }),
        { EX: 7 * 24 * 60 * 60 }
    );

    setAuthCookies(
        res,
        accessToken,
        refreshToken
    );

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });
}


/**
 * @name loginUserController
 * @description login an existing user
 * @access public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const sessionId = crypto.randomUUID();
    const refreshTokenId = crypto.randomUUID();

    const accessToken = generateAccessToken(
        user,
        sessionId
    );

    const refreshToken = generateRefreshToken(
        user,
        sessionId,
        refreshTokenId
    );

    // session ki information redis mein store karte hain
    await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify({
            refreshTokenId,
            userId: user._id.toString()
        }),
        { EX: 7 * 24 * 60 * 60 }
    );

    setAuthCookies(
        res,
        accessToken,
        refreshToken
    );

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @name refreshTokenController
 * @description generate a new access token using refresh token
 * @access public
 */
async function refreshTokenController(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // redis se current session information nikalte hain
        const sessionData = await redisClient.get(
            `session:${decoded.sessionId}`
        );

        if (!sessionData) {
            return res.status(401).json({
                message: "Refresh token revoked"
            });
        }

        const session = JSON.parse(sessionData);

        // check karte hain ki refresh token abhi bhi current hai
        if (session.refreshTokenId !== decoded.jti) {
            await redisClient.del(
                `session:${decoded.sessionId}`
            );

            return res.status(401).json({
                message: "Refresh token revoked"
            });
        }

        const newRefreshTokenId = crypto.randomUUID();

        const newAccessToken = generateAccessToken(
            decoded,
            decoded.sessionId
        );

        const newRefreshToken = generateRefreshToken(
            decoded,
            decoded.sessionId,
            newRefreshTokenId
        );

        // purane refresh token ki jagah naya refresh token save karte hain
        await redisClient.set(
            `session:${decoded.sessionId}`,
            JSON.stringify({
                refreshTokenId: newRefreshTokenId,
                userId: session.userId
            }),
            { EX: 7 * 24 * 60 * 60 }
        );

        setAuthCookies(
            res,
            newAccessToken,
            newRefreshToken
        );

        return res.status(200).json({
            message: "Token refreshed successfully"
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


/**
 * @name logoutUserController
 * @description logout user and revoke current session
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        // access token ko blacklist mein daalte hain
        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );

                const remainingTime =
                    decoded.exp - Math.floor(Date.now() / 1000);

                if (remainingTime > 0) {
                    const tokenHash = crypto
                        .createHash("sha256")
                        .update(accessToken)
                        .digest("hex");

                    await redisClient.set(
                        `blacklist:${tokenHash}`,
                        "true",
                        { EX: remainingTime }
                    );
                }
            } catch (error) {}
        }

        // refresh session ko redis se delete karte hain
        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

                await redisClient.del(
                    `session:${decoded.sessionId}`
                );
            } catch (error) {}
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}
module.exports = {
    registerUserController,
    loginUserController,
    refreshTokenController,
    logoutUserController
};