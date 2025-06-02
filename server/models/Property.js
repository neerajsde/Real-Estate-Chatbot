import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    bedrooms: {
        type: Number,
        required: true,
        default: 0
    },
    bathrooms: {
        type: Number,
        required: true,
        default: 0
    },
    size_sqft: {
        type: Number,
        required: true,
        default: 0
    },
    amenities: [{
        type: String,
        trim: true
    }],
    image_url: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    searchedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    searchCount:{
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Property', propertySchema);