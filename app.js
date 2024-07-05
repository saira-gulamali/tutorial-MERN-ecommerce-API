require("dotenv").config();
require("express-async-errors"); // applies try/catch to all our controllers

// express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");

// database
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware
app.use(morgan("tiny"));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Ecommerce API");
});

// error handler
app.use(notFoundMiddleware); //404
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
