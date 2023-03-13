const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
  },
  lastName: {
    type: String,
    
  },
  email: {
    type: String,
    
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    
  },
  phoneNum: {
    type: String
  },
  service:  {
    type: String
  },
  count: {
    type: Number
  },
  checkIn: {
    type: Number
  }
});

module.exports = Users = mongoose.model("users", UserSchema);