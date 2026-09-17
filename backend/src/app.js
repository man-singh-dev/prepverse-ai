const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
// allows Express to read cookies
app.use(cookieParser());
/* require all the routes here */
const authRouter = require("./routes/auth.route");
app.use("/api/auth", authRouter);

module.exports = app;