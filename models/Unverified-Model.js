const mongoose = require("mongoose");
const UnverifiedSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  
  street: {
      type: String
  },
  city: {
      type: String
  },
  state: {
      type: String
  },
  directions: {
    type: String
  },
  latitude: {
    type: Number,
  },
  longitude:{
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  id:{
    type: Number
  },
  changing_table:{
    type: Boolean
  },
  location:{
    type: {type: String},
    coordinates: []
  },
  accessible: {
    type: Boolean
  }, 
  unisex:{
    type: Boolean
  },
  paid:{
      type: Boolean
  },
  ad:{
    type: String
  },
  icon:{
    type: String
  },
  logo:{
    type: String
  }

});

module.exports = Unverified = mongoose.model("unverified", UnverifiedSchema);