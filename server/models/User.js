import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  profile_img: {
    type: String,
    trim: true
  },
  terms_accepted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    location: {
      type: String,
      trim: true
    },
    budget: {
      type: Number
    },
    bedrooms: {
      type: Number
    },
    size_sqft: {
      type: Number
    },
    amenities: [{
      type: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
