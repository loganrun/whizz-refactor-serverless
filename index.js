const serverless = require("serverless-http");
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const bodyParser = require('body-parser')
const cors = require("cors")
//const Auth = require('./models/Auth-Model')
const Bathreview = require('./models/Bathreview-Model')
const Bathroom = require('./models/Bathroom-Model')
const Unverified = require('./models/Unverified-Model')
const User = require('./models/User-Model')
//require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const app = express();
app.use(cors());
app.use(bodyParser.json())

const db = process.env.mongoURI  
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

  let lng = parseFloat(req.query.lng)
  let lat = parseFloat(req.query.lat)
  
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
                  lng,//lng, //-118.243683,
                  lat //lat  //34.052235
                 ]
             },
             distanceField: "distance",
             maxDistance: 16093.0,
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

app.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("street", "address is required")
      .not()
      .isEmpty(),
    check("city", "Name of City is required")
      .not()
      .isEmpty(),
    check("state", "Name of state is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(conn==null){
      try {
        await client()
        
      } catch (error) {
        res.json({error: error.message})
      }
    }

    const { name, street, city, state, directions,latitude,longitude,id,accessible,unisex,icon,ad,logo } = req.body;

    try {
      bathroom = new Bathroom({
        name,
        street,
        city,
        state,
        directions,
        latitude,
        longitude,
        id,
        accessible,
        unisex,
        icon,
        ad,
        logo,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      });

      await bathroom.save();

      return res.json(bathroom);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  }
);

app.post(
  "/verify",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("street", "address is required")
      .not()
      .isEmpty(),
    check("city", "Name of City is required")
      .not()
      .isEmpty(),
    check("state", "Name of state is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(conn==null){
      try {
        await client()
        
      } catch (error) {
        res.json({error: error.message})
      }
    }

    const { name, street, city, state, directions,latitude,longitude,accessible,unisex,ad,logo,changing_table } = req.body;

    try {
      bathroom = new Bathroom({
        name,
        street,
        city,
        state,
        directions,
        changing_table,
        latitude,
        longitude,
        id:Id,
        accessible,
        unisex,
        ad,
        logo,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        Date,
        rating: 5,
        count: 1,
        totalRatings: 0,
        lowerCard: "https://storage.googleapis.com/whizz_pics/lower-card-generic.png",
        verified: "yes"
      });

      await bathroom.save();

      return res.json(bathroom);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  }
);

app.get("/unverified",async (req, res, next) => {

  let lng = parseFloat(req.query.lng)
  let lat = parseFloat(req.query.lat)

  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }

  try {
    const unverified = await Unverified.aggregate([
        
     {
         "$geoNear": {
             "near": {
                 "type": "Point",
                 "coordinates": [
                   lng,//lng, //-118.243683,
                   lat //lat  //34.052235
                 ]
             },
             "distanceField": "dist.calculated",
             "maxDistance": 40000.0,
             "spherical": true,
             "distanceMultiplier": .00062137119
         }
     }
   ])
 
        
    res.json(unverified)
   
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
});

app.get("/users",async (req, res, next) => {
  const userId = req.query.userId

  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }

  try {
    const user = await User.findOne({userId})
  
        res.json(user.userName)
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
});

app.post("/users",async (req, res, next) => {

  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }

  const {
    lastName,
    firstName,
    userName,
    email,
    userId,
    phoneNum,
    service
  } = req.body;

  try {
    let user = await User.findOne({ userId });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({
      firstName,
      lastName,
      email,
      userName,
      userId,
      service,
      phoneNum
    });

    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json(user)

  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.patch("/users/:userId", async (req, res, next) => {

  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }

  try{
    let profile = await User.findOne({ userName: req.body.userName });
      if (profile) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Profile name already exist. Please choose another" }] });
      }
    const user = await User.findOne({userId: req.params.userId});
    if(req.body.userName) {
    user.userName = req.body.userName
  }
  await user.save()
  res.send(user.userName)
}catch{
  res.status(404)
  res.send({error: "User Not Found"})
}
});

app.post("/users/checkIn", async (req, res, next) => {

  if(conn==null){
    try {
      await client()
      
    } catch (error) {
      res.json({error: error.message})
    }
  }

  try{
    const user = await User.findOne({userId: req.body.userId});
    if(!user){
      return res
          .status(400)
          .json({ errors: [{ msg: "You have to be logged in to use this feature." }] });
    }
  
    const newCheckin = user.checkIn + 2;
    const userUpdateCount= await Users.findByIdAndUpdate({_id: user._id}, {"checkIn": newCheckin}, {new:true})
        //console.log(userUpdateCount.checkIn)
        res.status(200).json('Thanks for checking in! You now have ' + userUpdateCount.checkIn + ' Whizz points!')
  }catch(err){
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.get("/auth", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from auth route",
  });
});

app.post("/login", 
[
  check("email", "Please provide a valid email address").isEmail(),
  check("password", "Password is required").exists()
], 

async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password, email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
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



app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
