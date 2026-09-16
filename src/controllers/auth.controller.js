// Import the User model.
// We use this to find existing users and create new users in MongoDB.
const userModel = require("../models/user.model");
// bcrypt is used to hash passwords and compare passwords during login.
const bcrypt = require("bcryptjs");
// jsonwebtoken is used to create JWT authentication tokens.
const jwt = require("jsonwebtoken");
/**
 * @name registerUserController
 * @description Register a new user.
 * @access Public
 */
async function registerUserController(req, res) {
    // Get username, email and password from the request body.
    // Example request:
    // {
    //   "username": "rahul",
    //   "email": "rahul@gmail.com",
    //   "password": "123456"
    // }
    const { username, email, password } = req.body;
    // Check whether the user has provided all required fields.
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    // Check whether a user with the same email OR username
    // already exists in the database.
    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    });
    // If a user already exists, don't create another account.
    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "User already exists"
        });
    }


    // NEVER store the original password in the database.
    // bcrypt.hash(password, 10)
    // 10 = number of salt rounds.
    // Example:
    // "123456"
    // becomes something like:
    // "$2b$10$...."
    // So even if someone gets access to the database,
    // they don't directly see the user's password.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the new user in MongoDB.
    const newUser = await userModel.create({
        username: username,
        email: email,
        password: hashedPassword
    });


    // Create a JWT token for the newly registered user.
    //
    // The information inside {} is called the JWT payload.
    // We are storing the user's MongoDB ID and username.
    const token = jwt.sign(
        {
            id: newUser._id,
            username: newUser.username
        },

        // JWT_SECRET comes from your .env file.
        process.env.JWT_SECRET,

        // Token will remain valid for 1 day.
        {
            expiresIn: "1d"
        }
    );


    // Store the JWT inside a cookie.
    //
    // The browser will then send this cookie with future requests,
    // allowing the server to know which user is logged in.
    res.cookie("token", token);


    // Send a successful response back to the client.
    //
    // Notice that we DON'T send the password back.
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
 * @description Login an existing user.
 * @access Public
 */
async function loginUserController(req, res) {

    // Get email and password from the request body.
    const { email, password } = req.body;


    // Find the user using their email.
    const user = await userModel.findOne({
        email: email
    });


    // If no user exists with this email,
    // return an invalid credentials error.
    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }


    // Compare the password entered by the user
    // with the hashed password stored in MongoDB.
    //
    // bcrypt.compare() handles the hashing comparison for us.
    const isMatch = await bcrypt.compare(
        password,
        user.password
    );


    // If passwords don't match, login fails.
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }


    // Password is correct.
    // Now create a JWT token for this user.
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }
    );


    // Store the JWT in a cookie.
    res.cookie("token", token);


    // Send successful login response.
    return res.status(200).json({
        message: "User logged in successfully",

        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },

        // Sending the token in the response too.
        token: token
    });
}



// Export both controllers.
//
// auth.route.js will import these functions
// and connect them to API URLs.
module.exports = {
    registerUserController,
    loginUserController
};
