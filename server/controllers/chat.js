import Property from '../models/Property.js';
import User from '../models/User.js';
import resSender from "../utils/resSender.js";
import SearchedProperty from "../models/SearchedProperty.js";
import {
  saveSearchedPropertyCounts
} from "../utils/search.js";

export async function searchMatches(req, res) {
  try {
    const { location, budget, bedrooms, size, amenities = [] } = req.body;

    // Validate required parameters
    if (!location || !budget || !bedrooms || !size) {
      return resSender(res, 400, false, "Missing required property preferences.");
    }

    // Parse and validate numbers
    const parsedBudget = Number(budget);
    const parsedBedrooms = Number(bedrooms);
    const parsedSize = Number(size);
    if ([parsedBudget, parsedBedrooms, parsedSize].some(isNaN)) {
      return resSender(res, 400, false, "Budget, bedrooms, and size must be valid numbers.");
    }

    const newSearch = new SearchedProperty({
      preferences:{
        location, budget, bedrooms, size_sqft:size, amenities
      }
    });
    await newSearch.save();

    const baseQuery = {
      isActive: true,
      location: { $regex: new RegExp(location, "i") }
    };

    // Step 1: Exact match
    const exactMatchQuery = {
      ...baseQuery,
      price: { $lte: parsedBudget },
      bedrooms: { $gte: parsedBedrooms },
      size_sqft: { $gte: parsedSize },
      ...(amenities.length > 0 && { amenities: { $all: amenities } })
    };

    const exactMatches = await Property.find(exactMatchQuery).sort({ createdAt: -1 });
    if (exactMatches.length > 0) {
      saveSearchedPropertyCounts(exactMatches);
      return resSender(res, 200, true, "Exact match found.", exactMatches);
    }

    // Step 2: Progressive fallback matching
    const fallbackMatches = await Property.find({
      ...baseQuery,
      price: { $lte: parsedBudget }
    }).sort({ createdAt: -1 });

    const sizeMatches = [];
    const bedroomMatches = [];

    for (const prop of fallbackMatches) {
      if (prop.bedrooms >= parsedBedrooms && prop.size_sqft >= parsedSize) {
        sizeMatches.push(prop); // Best partial match
      } else if (prop.bedrooms >= parsedBedrooms) {
        bedroomMatches.push(prop);
      }
    }

    if (sizeMatches.length > 0) {
      saveSearchedPropertyCounts(sizeMatches);
      return resSender(res, 200, true, "Close match based on most preferences.", sizeMatches);
    }

    if (bedroomMatches.length > 0) {
      saveSearchedPropertyCounts(bedroomMatches);
      return resSender(res, 200, true, "Matched by location, budget, and bedrooms.", bedroomMatches);
    }

    if (fallbackMatches.length > 0) {
      saveSearchedPropertyCounts(fallbackMatches);
      return resSender(res, 200, true, "Matched by location and budget.", fallbackMatches);
    }

    // Step 3: Match by individual preferences
    const [locationOnly, budgetOnly, bedroomOnly, sizeOnly] = await Promise.all([
      Property.find({ location: baseQuery.location, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ price: { $lte: parsedBudget }, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ bedrooms: { $gte: parsedBedrooms }, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ size_sqft: { $gte: parsedSize }, isActive: true }).sort({ createdAt: -1 }),
    ]);

    if (locationOnly.length > 0) {
      saveSearchedPropertyCounts(locationOnly);
      return resSender(res, 200, true, "Matched by location only.", locationOnly);
    }

    if (budgetOnly.length > 0) {
      saveSearchedPropertyCounts(budgetOnly);
      return resSender(res, 200, true, "Matched by budget only.", budgetOnly);
    }

    if (bedroomOnly.length > 0) {
      saveSearchedPropertyCounts(bedroomOnly);
      return resSender(res, 200, true, "Matched by bedrooms only.", bedroomOnly);
    }

    if (sizeOnly.length > 0) {
      saveSearchedPropertyCounts(sizeOnly);
      return resSender(res, 200, true, "Matched by size only.", sizeOnly);
    }

    // Final fallback
    return resSender(res, 404, false, "No matching properties found.");
  } catch (err) {
    console.error("Error during property search:", err.message);
    return resSender(res, 500, false, "Internal server error.");
  }
}

export async function searchMatchesMe(req, res) {
  try {
    const userId = req.user.id;
    let { location, budget, bedrooms, size, amenities = [] } = req.body;

    const user = await User.findById(userId);
    if(!user){
      return resSender(res, 404, false, 'user data not found');
    }
    if(location) user.preferences.location = location;
    if(budget) user.preferences.budget = budget;
    if(bedrooms) user.preferences.bedrooms = bedrooms;
    if(size) user.preferences.size_sqft = size;
    if(amenities.length > 0) user.preferences.amenities = amenities;
    await user.save();

    if(!location || !budget || !bedrooms || !size){
      location = user.preferences.location;
      budget = user.preferences.budget;
      bedrooms = user.preferences.bedrooms;
      size = user.preferences.size_sqft;
      amenities = user.preferences.amenities;
    }
    if(!location || !budget || !bedrooms || !size){
      return resSender(res, 404, false, 'Please go to settings set your preffernce.');
    }

    // Parse and validate numbers
    const parsedBudget = Number(budget);
    const parsedBedrooms = Number(bedrooms);
    const parsedSize = Number(size);
    if ([parsedBudget, parsedBedrooms, parsedSize].some(isNaN)) {
      return resSender(res, 400, false, "Budget, bedrooms, and size must be valid numbers.");
    }

    const newSearch = new SearchedProperty({
      userId: userId,
      preferences:{
        location, budget, bedrooms, size_sqft:size, amenities
      }
    });
    await newSearch.save();

    const baseQuery = {
      isActive: true,
      location: { $regex: new RegExp(location, "i") }
    };

    // Step 1: Exact match
    const exactMatchQuery = {
      ...baseQuery,
      price: { $lte: parsedBudget },
      bedrooms: { $gte: parsedBedrooms },
      size_sqft: { $gte: parsedSize },
      ...(amenities.length > 0 && { amenities: { $all: amenities } })
    };

    const exactMatches = await Property.find(exactMatchQuery).sort({ createdAt: -1 });
    if (exactMatches.length > 0) {
      saveSearchedPropertyCounts(exactMatches, userId);
      return resSender(res, 200, true, "Exact match found.", exactMatches);
    }

    // Step 2: Progressive fallback matching
    const fallbackMatches = await Property.find({
      ...baseQuery,
      price: { $lte: parsedBudget }
    }).sort({ createdAt: -1 });

    const sizeMatches = [];
    const bedroomMatches = [];

    for (const prop of fallbackMatches) {
      if (prop.bedrooms >= parsedBedrooms && prop.size_sqft >= parsedSize) {
        sizeMatches.push(prop); // Best partial match
      } else if (prop.bedrooms >= parsedBedrooms) {
        bedroomMatches.push(prop);
      }
    }

    if (sizeMatches.length > 0) {
      saveSearchedPropertyCounts(sizeMatches, userId);
      return resSender(res, 200, true, "Close match based on most preferences.", sizeMatches);
    }

    if (bedroomMatches.length > 0) {
      saveSearchedPropertyCounts(bedroomMatches, userId);
      return resSender(res, 200, true, "Matched by location, budget, and bedrooms.", bedroomMatches);
    }

    if (fallbackMatches.length > 0) {
      saveSearchedPropertyCounts(fallbackMatches, userId);
      return resSender(res, 200, true, "Matched by location and budget.", fallbackMatches);
    }

    // Step 3: Match by individual preferences
    const [locationOnly, budgetOnly, bedroomOnly, sizeOnly] = await Promise.all([
      Property.find({ location: baseQuery.location, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ price: { $lte: parsedBudget }, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ bedrooms: { $gte: parsedBedrooms }, isActive: true }).sort({ createdAt: -1 }),
      Property.find({ size_sqft: { $gte: parsedSize }, isActive: true }).sort({ createdAt: -1 }),
    ]);

    if (locationOnly.length > 0) {
      saveSearchedPropertyCounts(locationOnly, userId);
      return resSender(res, 200, true, "Matched by location only.", locationOnly);
    }

    if (budgetOnly.length > 0) {
      saveSearchedPropertyCounts(budgetOnly, userId);
      return resSender(res, 200, true, "Matched by budget only.", budgetOnly);
    }

    if (bedroomOnly.length > 0) {
      saveSearchedPropertyCounts(bedroomOnly, userId);
      return resSender(res, 200, true, "Matched by bedrooms only.", bedroomOnly);
    }

    if (sizeOnly.length > 0) {
      saveSearchedPropertyCounts(sizeOnly, userId);
      return resSender(res, 200, true, "Matched by size only.", sizeOnly);
    }

    // Final fallback
    return resSender(res, 404, false, "No matching properties found.");
  } catch (err) {
    console.error("Error during property search:", err.message);
    return resSender(res, 500, false, "Internal server error.");
  }
}