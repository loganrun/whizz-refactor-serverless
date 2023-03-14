const mongoose = require("mongoose");
//const config = require("config");
const db = "mongodb+srv://LoganNew:AgoLngtoLauNch3B@whizz1-7dh5i.mongodb.net/Whizbase?retryWrites=true&w=majority"
//process.env.mongoUri;

const connectDB = async () => {
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

module.exports = connectDB;