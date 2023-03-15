const serverless = require("serverless-http");
import * as dotenv from 'dotenv'
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const db = process.env.mongoURI
const bodyParser = require('body-parser')
const cors = require("cors")
const Auth = require('./models/Auth-Model')
const Bathreview = require('./models/Bathreview-Model')
const Bathroom = require('./models/Bathroom-Model')
const Unverified = require('./models/Unverified-Model')
const User = require('./models/User-Model')
//require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const app = express();
app.use(cors());
app.use(bodyParser.json())

const client = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("mongoDb connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/users", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from users",
  });
});

app.post("/users", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from post",
  });
});

app.patch("/users/:userId", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from user post",
  });
});

app.post("/users/checkIn", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from checkin",
  });
});

app.get("/auth", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from auth route",
  });
});

app.post("/auth", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from auth post",
  });
});

app.get("/bathroom", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from restroom route",
  });
});

app.post("/bathroom", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from bathroom post",
  });
});

app.post("/verify", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from verify bathroom",
  });
});

app.get("/unverified", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from unverified route",
  });
});




app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
