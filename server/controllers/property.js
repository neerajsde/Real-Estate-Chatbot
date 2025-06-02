import Property from "../models/Property.js";
import resSender from "../utils/resSender.js";

export async function getProperties(req, res) {
  try {
    const properties = await Property.find();
    if (!properties || properties.length === 0) {
      return resSender(res, 404, false, "Empty Properties");
    }
    return resSender(res, 200, true, "Fetch all properties data", properties);
  } catch (err) {
    console.log("Error while getting properties data: ", err.message);
    return resSender(res, 500, false, err.message, "Internal server error");
  }
}

export async function getMostSearchedProperty(req, res) {
  try {
    const properties = await Property.aggregate([
      {
        $addFields: {
          searchedByCount: { $size: { $ifNull: ["$searchedBy", []] } },
        },
      },
      {
        $sort: {
          searchCount: -1,
          searchedByCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    resSender(res, 200, true, "Top 10 most searched properties", properties);
  } catch (error) {
    console.log("Error while getting most searched property: ", err.message);
    return resSender(res, 500, false, err.message);
  }
}
