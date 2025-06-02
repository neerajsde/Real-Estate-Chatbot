import mongoose from 'mongoose';
import Property from '../models/Property.js';

export async function saveSearchedPropertyCounts(resData, userId = null) {
  try {
    if (!resData || resData.length === 0) return;

    const propertyIds = resData
      .map(p => {
        try {
          return new mongoose.Types.ObjectId(p._id); // Convert to ObjectId safely
        } catch {
          return null;
        }
      })
      .filter(_id => _id); // Remove invalid/null entries

    const properties = await Property.find({ _id: { $in: propertyIds } });

    const bulkOps = properties.map(property => {
      const update = {
        $inc: { searchCount: 1 },
      };

      if (userId) {
        update.$addToSet = { searchedBy: userId };
      }

      return {
        updateOne: {
          filter: { _id: property._id },
          update,
        },
      };
    });

    if (bulkOps.length > 0) {
      await Property.bulkWrite(bulkOps);
    }

  } catch (err) {
    console.error("Error while saving searched properties:", err.message);
  }
}
