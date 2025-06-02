import React from "react";
import PropertyCard from "../property/PropertyCard";

const FilterCards = ({ properties }) => {
  if (properties.length === 0) {
    return <div className="w-full h-[70vh] flex justify-center items-center">No properties match your filters.</div>;
  }
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
      {properties.map((item, index) => (
        <PropertyCard key={index} item={item} />
      ))}
    </div>
  );
};

export default FilterCards;
