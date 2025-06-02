import mongoose from "mongoose";

const searchPropertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  preferences: {
    location: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    size_sqft: {
      type: Number,
    },
    amenities: [
      {
        type: String,
      },
    ],
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SearchedProperty", searchPropertySchema);
