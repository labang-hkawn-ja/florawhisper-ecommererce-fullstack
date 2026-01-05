// components/PlantsTablePage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaFilter } from "react-icons/fa";
import type { PlantDto } from "../dto/PlantDto";
import type { CategoryDto } from "../dto/CategoryDto";
import {
  deletePlantApiCall,
  getAllCategoriesApiCall,
  getAllPlantsApiCall,
} from "../service/FloraService";

export default function PlantsTablePage() {
  const [plants, setPlants] = useState<PlantDto[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterPlants();
  }, [plants, searchTerm, selectedCategory]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await getAllPlantsApiCall();
      setPlants(response.data);
    } catch (err) {
      setError("Failed to load plants" + err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApiCall();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories" + err);
    }
  };

  const filterPlants = () => {
    let filtered = plants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (plant) => plant.category === selectedCategory
      );
    }

    setFilteredPlants(filtered);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleDelete = async (plantId: number) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await deletePlantApiCall(plantId);
        await fetchPlants(); // Refresh the list
      } catch (err) {
        setError("Failed to delete plant" + err);
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
            Plants Management
          </h1>
          <p className="text-emerald-600">Manage your plant inventory</p>
        </div>
        <Link
          to="/plants/create"
          className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="text-sm" />
          Add New Plant
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-emerald-400" />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end text-emerald-700">
            Showing {filteredPlants.length} of {plants.length} plants
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Plants Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-200">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Plant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-emerald-200">
              {filteredPlants.map((plant) => (
                <tr
                  key={plant.plantId}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`data:image/png;base64,${plant.imageUrl}`}
                          alt={plant.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-emerald-900">
                          {plant.name}
                        </div>
                        <div className="text-sm text-emerald-500 truncate max-w-xs">
                          {plant.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {plant.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                    ${plant.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plant.stock > 10
                          ? "bg-green-100 text-green-800"
                          : plant.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plant.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/plants/update/${plant.plantId}`}
                        className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <FaEdit className="text-sm" />
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          plant.plantId && handleDelete(plant.plantId)
                        }
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-emerald-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-emerald-900 mb-2">
              No plants found
            </h3>
            <p className="text-emerald-600">
              {plants.length === 0
                ? "Get started by adding your first plant."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
