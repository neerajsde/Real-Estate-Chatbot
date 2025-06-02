import mongoose from "mongoose";
import fs from "fs";
import Property from "./models/Property.js";
import { mergePropertyData } from "./utils/merge_json_files.js";
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ DB Connected");

    mergePropertyData(
      "./data/property/basics.json",
      "./data/property/characteristics.json",
      "./data/property/images.json",
      "./data/property/merged.json"
    );

    const mergedData = JSON.parse(
      fs.readFileSync("./data/property/merged.json", "utf-8")
    );

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of mergedData) {
      const existing = await Property.findOne({ id: item.id });

      if (!existing) {
        // Insert new document
        await Property.create(item);
        insertedCount++;
      } else {
        // Compare fields and update if necessary
        const fieldsToCompare = ["id", "title", "price", "location", "bedrooms", "bathrooms", "size_sqft", "amenities", "image_url"];
        let needsUpdate = false;

        for (const field of fieldsToCompare) {
          if (JSON.stringify(existing[field]) !== JSON.stringify(item[field])) {
            needsUpdate = true;
            break;
          }
        }

        if (needsUpdate) {
          await Property.updateOne({ id: item.id }, { $set: item });
          updatedCount++;
        }
      }
    }

    console.log(`✅ Inserted: ${insertedCount} new properties.`);
    console.log(`♻️ Updated: ${updatedCount} existing properties.`);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();