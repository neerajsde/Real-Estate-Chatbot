import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import FilterInputs from "../components/Filters/FilterInputs";
import apiHandler from "../utils/apiHandler";
import FilterCards from "../components/Filters/FilterCards";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import Loader from "../components/spinner/Loader";

const Filters = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Find Your Perfect Property | Real Estate AI";
  }, []);

  // Fetch property data from the backend
  async function getProperties() {
    setLoading(true);
    const res = await apiHandler("/property/all", "GET");
    if (res.success) {
      setPropertyData(res.data);
      setFilteredProperties(res.data);
    } else {
      setPropertyData([]);
      setFilteredProperties([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    getProperties();
  }, []);

  // Handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setFilteredProperties(propertyData);
      return;
    }

    const searchTerm = search.toLowerCase();
    const filtered = propertyData.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.amenities.some((a) => a.toLowerCase().includes(searchTerm))
    );

    setFilteredProperties(filtered);
  };

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="flex h-[87vh] overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] bg-white border-r border-gray-300 h-full overflow-y-auto p-4 sticky top-0">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <FilterInputs
            allProperties={propertyData}
            setFilteredProperties={setFilteredProperties}
          />
        </div>

        {/* Right Content */}
        <div className="w-full flex-1 overflow-y-auto bg-gray-100">
          <div className="w-full flex flex-col p-6 md:flex-row md:items-center md:justify-between mb-6 sticky top-0 bg-gray-100 z-10 py-4">
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white border border-gray-300 rounded overflow-hidden mb-4 md:mb-0 md:mr-4 w-full md:w-[50%]"
            >
              <IoSearch className="mx-2 text-xl text-gray-500" />
              <input
                type="text"
                name="search"
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 py-2 outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
              >
                Find
              </button>
            </form>

            {/* Tabs */}
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded bg-blue-500 text-white cursor-pointer`}
              >
                Filters
              </button>
              <button
                className={`px-4 py-2 border border-gray-400 rounded bg-gray-200 cursor-pointer`}
                onClick={() => navigate("/recommended")}
              >
                Recommended Properties
              </button>
            </div>
          </div>
          {/* Content */}
          {loading ? (
            <div className="w-full h-[70vh] flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <FilterCards properties={filteredProperties} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
