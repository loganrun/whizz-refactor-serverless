const mongoose = require("mongoose");
const BathReviewsSchema = new mongoose.Schema({
  bathroomId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bathroom"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  review: {
    type: String
  },
  userName: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  rating:{
    type: Number
  }
});

module.exports = BathReviews = mongoose.model("bathreview", BathReviewsSchema);
