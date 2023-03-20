const serverless = require("serverless-http");
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");

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

const db = process.env.mongoURI  //"mongodb+srv://LoganNew:AgoLngtoLauNch3B@whizz1-7dh5i.mongodb.net/Whizbase?retryWrites=true&w=majority"
let conn = null

const client = async () => {
  if (conn==null){
  try {
    conn = await mongoose.connect(db, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("mongoDb connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

return conn
};


app.get("/", async (req, res, next) => {
  
  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }
  try {
    const bathroom = await Bathroom.aggregate([
     {
         $geoNear: {
             near: {
                 type: "Point",
                 coordinates: [
                   parseFloat(req.query.lng),//lng, //-118.243683,
                   parseFloat(req.query.lat) //lat  //34.052235
                 ]
             },
             distanceField: "distance",
            //  "maxDistance": 16093.0,
             spherical: true,
             distanceMultiplier: .00062137119
         }
     }
   ])
 
        
    res.json(bathroom)
   
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
  
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
