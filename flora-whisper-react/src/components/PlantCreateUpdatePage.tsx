// components/CreateUpdatePlantPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft, FaUpload } from "react-icons/fa";

import type { PlantDto } from "../dto/PlantDto";
import type { CategoryDto } from "../dto/CategoryDto";
import {
  createPlantApiCall,
  getAllCategoriesApiCall,
  getPlantByIdApiCall,
  updatePlantApiCall,
} from "../service/FloraService";
import type { AxiosError } from "axios";

// Define category types and their respective fields
const CATEGORY_FIELDS = {
  Blooms: ["color", "piece"],
  Greenery: ["plantSize", "isEasyToCare", "careInstructions"],
  // Add more categories as needed
};

export default function CreateUpdatePlantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    updatePrice: 0,
    plantSize: "",
    isEasyToCare: false,
    careInstructions: "",
    color: "",
    piece: 1,
    category: "",
  });

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategoryFields, setSelectedCategoryFields] = useState<
    string[]
  >([]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode && id) {
      fetchPlant(parseInt(id));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    // Update visible fields when category changes
    if (formData.category) {
      const fields =
        CATEGORY_FIELDS[formData.category as keyof typeof CATEGORY_FIELDS] ||
        [];
      setSelectedCategoryFields(fields);
    } else {
      setSelectedCategoryFields([]);
    }
  }, [formData.category]);

  const fetchPlant = async (plantId: number) => {
    try {
      setLoading(true);
      const response = await getPlantByIdApiCall(plantId);
      const plant = response.data;
      setFormData({
        name: plant.name || "",
        description: plant.description || "",
        price: plant.price || 0,
        stock: plant.stock || 0,
        updatePrice: plant.updatePrice || 0,
        plantSize: plant.plantSize || "",
        isEasyToCare: plant.isEasyToCare || false,
        careInstructions: plant.careInstructions || "",
        color: plant.color || "",
        piece: plant.piece || 1,
        category: plant.category || "",
      });
    } catch (err) {
      setError("Failed to load plant data" + err);
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "category") {
      // Reset category-specific fields when category changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        plantSize: "",
        isEasyToCare: false,
        careInstructions: "",
        color: "",
        piece: 1,
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const plantDto: PlantDto = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        updatePrice: formData.updatePrice,
        plantSize: formData.plantSize,
        isEasyToCare: formData.isEasyToCare,
        careInstructions: formData.careInstructions,
        color: formData.color,
        piece: formData.piece,
        category: formData.category,
        imageUrl: imageFile ? imageFile.name : "",
      };

      console.log("=== SUBMITTING UPDATE ===");
      console.log("Plant ID:", id);
      console.log("Endpoint URL:", `/flora/plants/plant/${id}`);
      console.log("Plant DTO:", plantDto);

      if (isEditMode && id) {
        await updatePlantApiCall(parseInt(id), plantDto, imageFile);
      } else {
        await createPlantApiCall(plantDto, imageFile);
      }
      navigate("/plants");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      console.error("=== ERROR DETAILS ===");
      console.error("Request URL:", axiosError.config?.url);
      console.error("Request method:", axiosError.config?.method);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error data:", axiosError.response?.data);
      console.error("=== END ERROR ===");
      setError(axiosError.response?.data?.message || "Failed to save plant");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a field should be shown
  const shouldShowField = (fieldName: string) => {
    return selectedCategoryFields.includes(fieldName);
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/plants")}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">
              {isEditMode ? "Update Plant" : "Create New Plant"}
            </h1>
            <p className="text-emerald-600">
              {isEditMode
                ? "Edit plant information"
                : "Add a new plant to your inventory"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Plant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Image {!isEditMode && "*"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!isEditMode}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Update Price
                </label>
                <input
                  type="number"
                  name="updatePrice"
                  value={formData.updatePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Plant Size - Only show for specific categories */}
              {shouldShowField("plantSize") && (
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">
                    Plant Size
                  </label>
                  <input
                    type="text"
                    name="plantSize"
                    value={formData.plantSize}
                    onChange={handleChange}
                    placeholder="e.g., Small, Medium, Large"
                    className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Color - Only show for specific categories */}
              {shouldShowField("color") && (
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">
                    Color
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a color</option>
                    <option value="RED">RED</option>
                    <option value="WHITE">WHITE</option>
                    <option value="YELLOW">YELLOW</option>
                    <option value="PINK">PINK</option>
                    <option value="PURPLE">PURPLE</option>
                    <option value="BLUE">BLUE</option>
                    <option value="ORANGE">ORANGE</option>
                    <option value="LAVENDER">LAVENDER</option>
                    <option value="PEACH">PEACH</option>
                    <option value="GREEN">GREEN</option>
                    <option value="BLACK">BLACK</option>
                    <option value="MULTICOLOR">MULTICOLOR</option>
                  </select>
                </div>
              )}

              {/* Pieces - Only show for specific categories */}
              {shouldShowField("piece") && (
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">
                    Pieces
                  </label>
                  <input
                    type="number"
                    name="piece"
                    value={formData.piece}
                    onChange={handleChange}
                    min="1"
                    placeholder="Number of pieces"
                    className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Easy to Care - Only show for specific categories */}
            {shouldShowField("isEasyToCare") && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isEasyToCare"
                  checked={formData.isEasyToCare}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                />
                <label className="ml-2 block text-sm text-emerald-700">
                  Easy to Care For
                </label>
              </div>
            )}

            {/* Care Instructions - Only show for specific categories */}
            {shouldShowField("careInstructions") && (
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Care Instructions
                </label>
                <textarea
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Provide care instructions for this plant..."
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Category Info Display */}
            {formData.category && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700">
                  <strong>Selected Category:</strong> {formData.category}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Showing fields relevant to {formData.category.toLowerCase()}{" "}
                  plants
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-emerald-100">
          <button
            type="button"
            onClick={() => navigate("/plants")}
            className="px-6 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaSave className="text-sm" />
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Plant"
              : "Create Plant"}
          </button>
        </div>
      </form>
    </div>
  );
}
