import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAllPlantsApiCall,
  getAllPlantsByCategoryIdApiCall,
  searchPlantsApiCall,
} from "../service/FloraService";
import type { PlantDto } from "../dto/PlantDto";
import { useCart } from "../dto/UseCart";

export default function HeroSection() {
  const [plants, setPlants] = useState<PlantDto[]>([]);
  const [color, setColor] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  const { cartItems, addToCart, removeFromCart } = useCart();

  const isInCart = (plantId: number) => {
    return cartItems.some((item) => item.plant.plantId === plantId);
  };

  const colors = [
    "RED",
    "WHITE",
    "YELLOW",
    "PINK",
    "BLUE",
    "PURPLE",
    "PEACH",
    "MULTICOLOR",
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initialLoadRef = useRef(true);

  useEffect(() => {
    fetchPlants();
    initialLoadRef.current = false;
  }, [id]);

  useEffect(() => {
    if (initialLoadRef.current && !color && !searchName) {
      return;
    }

    const timer = setTimeout(() => {
      fetchPlants();
    }, 300);

    return () => clearTimeout(timer);
  }, [color, searchName]);

  const fetchPlants = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching plants with:", { id, color, name: searchName });

      if (id && !isNaN(Number(id))) {
        const categoryId = Number(id);

        const hasActiveFilters = color !== "" || searchName !== "";
        console.log("Has active filters:", hasActiveFilters);

        let res;
        if (hasActiveFilters) {
          console.log("Calling SEARCH API with filters");
          res = await searchPlantsApiCall(categoryId, color, searchName);
        } else {
          console.log("Calling CATEGORY API - No filters");
          res = await getAllPlantsByCategoryIdApiCall(categoryId);
        }

        console.log("API response data length:", res.data?.length || 0);
        setPlants(Array.isArray(res.data) ? res.data : []);
      } else {
        console.log("Calling ALL PLANTS API");
        const res = await getAllPlantsApiCall();
        setPlants(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: unknown) {
      console.error("Error fetching plants:", err);
      setError("Failed to load plants. Please try again.");
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlants();
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
    setColor("");
    setSearchName("");
  };

  const hasActiveFilters = color !== "" || searchName !== "";
  const showNoResults = !loading && plants.length === 0;
  const showPlants = !loading && plants.length > 0;

  return (
    <div className="bg-white pt-20 max-w-7xl mx-auto px-4 py-12">
      {/* Search Section */}
      {(id === "1" || id === "2") && (
        <div className="flex justify-end mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-row items-center gap-3 rounded-2xl p-4 w-fit"
          >
            {/* Color Dropdown - Only for Flowers (id=1) */}
            {id === "1" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="border border-emerald-200 bg-white text-emerald-800 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-40 text-left flex justify-between items-center hover:bg-emerald-50 transition-colors"
                >
                  <span>
                    {color
                      ? (() => {
                          const foundColor = colors.find((c) => c === color);
                          return foundColor
                            ? foundColor.charAt(0) +
                                foundColor.slice(1).toLowerCase()
                            : color;
                        })()
                      : "All Colors"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-emerald-200 rounded-xl shadow-lg z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setColor("");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-emerald-800 hover:bg-emerald-400 hover:text-white transition-colors first:rounded-t-xl"
                    >
                      All Colors
                    </button>
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setColor(c);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-emerald-800 hover:bg-emerald-400 hover:text-white transition-colors last:rounded-b-xl"
                      >
                        {c.charAt(0) + c.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder={
                  id === "1" ? "Search flowers..." : "Search plants..."
                }
                className="border border-emerald-200 bg-white text-emerald-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64 placeholder-emerald-400"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-emerald-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="col-span-full text-center py-12">
          <div className="flex justify-center items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-emerald-700">Loading plants...</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {showNoResults && (
        <div className="col-span-full text-center py-12">
          <div className="text-emerald-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">No plants found</p>
          <p className="text-gray-400 text-sm">
            {hasActiveFilters
              ? "Try adjusting your search filters"
              : "No plants available in this category"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Plants Grid */}
      {showPlants && (
        <>
          <div className="text-emerald-700 mb-4">
            Found {plants.length} plant{plants.length !== 1 ? "s" : ""}
            {hasActiveFilters && " matching your search"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plants.map((plant) => {
              const inCart = isInCart(plant.plantId!);
              return (
                <div
                  key={plant.plantId}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-100 overflow-hidden group h-[380px] flex flex-col"
                >
                  {/* Your plant card content */}
                  <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <img
                      src={
                        plant.imageUrl
                          ? `data:image/jpeg;base64,${plant.imageUrl}`
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={plant.name || "Plant"}
                      className="w-full h-48 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {plant.updatePrice && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Off Sale
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (inCart) {
                          removeFromCart(plant.plantId!);
                        } else {
                          addToCart(plant);
                        }
                      }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm ${
                        inCart
                          ? "bg-emerald-500 text-white"
                          : "bg-white/95 hover:bg-emerald-500 text-emerald-600 hover:text-white"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2">
                        {plant.name}
                      </h3>
                      <p className="text-emerald-600 text-sm leading-relaxed line-clamp-2">
                        {plant.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-baseline gap-2">
                        {plant.updatePrice === 0 ? (
                          <span className="text-xl font-bold text-emerald-700">
                            ${plant.price}
                          </span>
                        ) : (
                          <>
                            <span className="text-xl font-bold text-emerald-700">
                              ${plant.updatePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${plant.price}
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        to={`/plant-detail/${plant.plantId}`}
                        className="group/details flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300"
                      >
                        <span className="text-sm">View</span>
                        <svg
                          className="w-4 h-4 transform group-hover/details:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
