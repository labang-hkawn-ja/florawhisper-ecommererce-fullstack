import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import {
  deleteFlowerMeaningApiCall,
  getAllFlowerMeaningsApiCall,
} from "../service/FloraService";

export default function FlowerLanguageTablePage() {
  const [flowerMeanings, setFlowerMeanings] = useState<FlowerLanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    fetchFlowerMeanings();

    // Hide scroll hint after 5 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchFlowerMeanings = async () => {
    try {
      setLoading(true);
      const response = await getAllFlowerMeaningsApiCall();
      setFlowerMeanings(response.data);
    } catch (err) {
      setError("Failed to load flower meanings" + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this flower meaning?")
    ) {
      try {
        await deleteFlowerMeaningApiCall(id);
        await fetchFlowerMeanings(); // Refresh the list
      } catch (err) {
        setError("Failed to delete flower meaning" + err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">
            Flower Meanings
          </h1>
          <p className="text-emerald-600">
            Manage flower language and symbolism
          </p>
        </div>
        <Link
          to="/flower-meanings/create"
          className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="text-sm" />
          Add New Flower Meaning
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Scroll Indicator */}
      {showScrollHint && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center justify-center gap-3 animate-pulse">
          <FaArrowLeft className="text-blue-500" />
          <span className="text-sm font-medium">
            Scroll horizontally to see all columns
          </span>
          <FaArrowRight className="text-blue-500" />
        </div>
      )}

      {/* Flowers Table with Enhanced Scroll Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Container with Visual Scroll Indicators */}
        <div className="relative">
          {/* Left Gradient Fade - Hidden by default, shows when scrolled */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 opacity-0 transition-opacity duration-300"
            id="left-fade"
          ></div>

          {/* Scrollable Table Container */}
          <div
            className="overflow-x-auto relative"
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              const leftFade = document.getElementById("left-fade");
              const rightFade = document.getElementById("right-fade");

              if (leftFade && rightFade) {
                // Show left fade when scrolled right
                leftFade.style.opacity = target.scrollLeft > 10 ? "1" : "0";
                // Show right fade when not at the end
                rightFade.style.opacity =
                  target.scrollLeft <
                  target.scrollWidth - target.clientWidth - 10
                    ? "1"
                    : "0";
              }
            }}
          >
            <table className="min-w-full divide-y divide-emerald-200">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Flower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Scientific Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Meaning
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Season
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Origin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Bloom Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-200">
                {flowerMeanings.map((flower) => (
                  <tr
                    key={flower.id}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {flower.imageUrls && flower.imageUrls.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`/img/meanings/${flower.imageUrls[0]}.jpg`}
                              alt={flower.name}
                              onError={(e) => {
                                // Fallback if image doesn't exist
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center ${
                              flower.imageUrls && flower.imageUrls.length > 0
                                ? "hidden"
                                : ""
                            }`}
                          >
                            <span className="text-emerald-600 text-sm">🌺</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-emerald-900">
                            {flower.name}
                          </div>
                          <div className="text-sm text-emerald-500">
                            {flower.occasions?.slice(0, 2).join(", ")}
                            {flower.occasions &&
                              flower.occasions.length > 2 &&
                              "..."}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 italic">
                      {flower.scientificName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 max-w-xs truncate">
                      {flower.meaning}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        {flower.season || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                      {flower.originCountry || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                      {flower.bloomingPeriod || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          flower.isPerennial
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {flower.isPerennial ? "Perennial" : "Annual"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/flower-meanings/update/${flower.id}`}
                          className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1 transition-colors p-2 rounded hover:bg-emerald-100"
                          title="Edit"
                        >
                          <FaEdit className="text-sm" />
                        </Link>
                        <button
                          onClick={() => flower.id && handleDelete(flower.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors p-2 rounded hover:bg-red-100"
                          title="Delete"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Gradient Fade - Always visible initially to indicate scroll */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
            id="right-fade"
          ></div>
        </div>

        {/* Empty State */}
        {flowerMeanings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-emerald-400 text-6xl mb-4">🌻</div>
            <h3 className="text-lg font-medium text-emerald-900 mb-2">
              No flower meanings found
            </h3>
            <p className="text-emerald-600">
              Get started by adding your first flower meaning.
            </p>
            <Link
              to="/flower-meanings/create"
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Your First Flower
            </Link>
          </div>
        )}

        {/* Table Footer with Scroll Info */}
        {flowerMeanings.length > 0 && (
          <div className="bg-emerald-50 px-6 py-3 border-t border-emerald-200">
            <div className="flex justify-between items-center text-sm text-emerald-600">
              <span>
                Showing {flowerMeanings.length} flower
                {flowerMeanings.length !== 1 ? "s" : ""}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <FaArrowLeft className="text-xs" />
                Scroll to see more columns
                <FaArrowRight className="text-xs" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
