import fs from 'fs';

export function mergePropertyData(basicsPath, characteristicsPath, imagesPath, outputPath) {
  // Load data from files
  const basics = JSON.parse(fs.readFileSync(basicsPath, 'utf-8'));
  const characteristics = JSON.parse(fs.readFileSync(characteristicsPath, 'utf-8'));
  const images = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));

  // Create maps for fast lookup
  const characteristicsMap = new Map();
  const imagesMap = new Map();

  characteristics.forEach(item => characteristicsMap.set(item.id, item));
  images.forEach(item => imagesMap.set(item.id, item));

  // Merge all data based on id
  const mergedData = basics.map(basic => {
    return {
      ...basic,
      ...(characteristicsMap.get(basic.id) || {}),
      ...(imagesMap.get(basic.id) || {})
    };
  });

  // Write the merged data to a new file
  fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf-8');

  console.log(`✅ Merged Properties data written to ${outputPath}`);
  return mergedData;
}
