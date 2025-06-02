import React, { useState, useEffect } from 'react';

const FilterInputs = ({ allProperties, setFilteredProperties }) => {
  const [location, setLocation] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [bedroomsMin, setBedroomsMin] = useState('');
  const [bedroomsMax, setBedroomsMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Extract unique options
  const locations = [...new Set(allProperties.map(p => p.location))];
  const names = [...new Set(allProperties.map(p => p.title))];
  const allAmenities = [
    ...new Set(allProperties.flatMap(p => p.amenities))
  ];

  useEffect(() => {
    applyFilters();
  }, [
    location,
    propertyName,
    bedroomsMin,
    bedroomsMax,
    priceMin,
    priceMax,
    selectedAmenities
  ]);

  const applyFilters = () => {
    let filtered = [...allProperties];

    if (location) filtered = filtered.filter(p => p.location === location);
    if (propertyName) filtered = filtered.filter(p => p.title === propertyName);
    if (bedroomsMin) filtered = filtered.filter(p => p.bedrooms >= parseInt(bedroomsMin));
    if (bedroomsMax) filtered = filtered.filter(p => p.bedrooms <= parseInt(bedroomsMax));
    if (priceMin) filtered = filtered.filter(p => p.price >= parseInt(priceMin));
    if (priceMax) filtered = filtered.filter(p => p.price <= parseInt(priceMax));

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(p =>
        selectedAmenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAll = () => {
    setLocation('');
    setPropertyName('');
    setBedroomsMin('');
    setBedroomsMax('');
    setPriceMin('');
    setPriceMax('');
    setSelectedAmenities([]);
    setFilteredProperties(allProperties);
  };

  return (
    <div className="text-sm text-gray-800 space-y-4">
      <div className="flex justify-between items-center text-orange-600 font-semibold">
        <span>FILTER BY</span>
        <button onClick={clearAll} className="text-xs text-blue-500 hover:underline">Clear All</button>
      </div>

      {/* Property Name */}
      <div>
        <label className="font-medium">Property Name</label>
        <select
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          className="w-full mt-1 px-2 py-1 border rounded"
        >
          <option value="">All</option>
          {names.map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="font-medium">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mt-1 px-2 py-1 border rounded"
        >
          <option value="">All</option>
          {locations.map((loc, i) => (
            <option key={i} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="font-medium">Bedrooms</label>
        <div className="flex space-x-2 mt-1">
          <input
            type="number"
            value={bedroomsMin}
            onChange={(e) => setBedroomsMin(e.target.value)}
            placeholder="Min"
            className="w-1/2 px-2 py-1 border rounded"
          />
          <input
            type="number"
            value={bedroomsMax}
            onChange={(e) => setBedroomsMax(e.target.value)}
            placeholder="Max"
            className="w-1/2 px-2 py-1 border rounded"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="font-medium">Price (₹)</label>
        <div className="flex space-x-2 mt-1">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Min ₹"
            className="w-1/2 px-2 py-1 border rounded"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Max ₹"
            className="w-1/2 px-2 py-1 border rounded"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="font-medium">Amenities</label>
        <div className="max-h-[150px] overflow-y-auto mt-2 space-y-1">
          {allAmenities.map((amenity, i) => (
            <div key={i} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <label htmlFor={amenity}>{amenity}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterInputs;
