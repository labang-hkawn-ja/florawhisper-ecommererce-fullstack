import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import {
  createFlowerMeaningApiCall,
  getFlowerMeaningsByIdApiCall,
  updateFlowerMeaningApiCall,
} from "../service/FloraService";
import type { AxiosError } from "axios";

export default function FlowerLanguageCreateUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [flowerMeaning, setFlowerMeaning] = useState<FlowerLanguageDto>({
    name: "",
    scientificName: "",
    meaning: "",
    symbolism: "",
    description: "",
    plantingGuide: "",
    careInstructions: "",
    season: "",
    occasions: [],
    culturalMeanings: [],
    imageUrls: [],
    bloomingPeriod: "",
    colorVarieties: "",
    colorMeanings: new Map(),
    originCountry: "",
    isPerennial: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newOccasion, setNewOccasion] = useState("");
  const [newCulturalMeaning, setNewCulturalMeaning] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColorMeaning, setNewColorMeaning] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      fetchFlowerMeaning(parseInt(id));
    }
  }, [id, isEditMode]);

  const fetchFlowerMeaning = async (flowerId: number) => {
    try {
      setLoading(true);
      const response = await getFlowerMeaningsByIdApiCall(flowerId);
      // Convert colorMeanings object back to Map if needed
      const flowerData = response.data;
      if (
        flowerData.colorMeanings &&
        !(flowerData.colorMeanings instanceof Map)
      ) {
        flowerData.colorMeanings = new Map(
          Object.entries(flowerData.colorMeanings)
        );
      }
      setFlowerMeaning(flowerData);
    } catch (err) {
      setError("Failed to load flower meaning data" + err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFlowerMeaning((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFlowerMeaning((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInput = (
    field: "occasions" | "culturalMeanings",
    value: string
  ) => {
    if (value.trim()) {
      setFlowerMeaning((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    }
  };

  const removeArrayItem = (
    field: "occasions" | "culturalMeanings",
    index: number
  ) => {
    setFlowerMeaning((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleColorMeaningAdd = () => {
    if (newColor.trim() && newColorMeaning.trim()) {
      setFlowerMeaning((prev) => ({
        ...prev,
        colorMeanings: new Map(prev.colorMeanings).set(
          newColor.trim(),
          newColorMeaning.trim()
        ),
      }));
      setNewColor("");
      setNewColorMeaning("");
    }
  };

  const removeColorMeaning = (color: string) => {
    const newColorMeanings = new Map(flowerMeaning.colorMeanings);
    newColorMeanings.delete(color);
    setFlowerMeaning((prev) => ({
      ...prev,
      colorMeanings: newColorMeanings,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert Map to object for API
      const submitData = {
        ...flowerMeaning,
        colorMeanings: Object.fromEntries(
          flowerMeaning.colorMeanings || new Map()
        ),
      };

      if (isEditMode && id) {
        await updateFlowerMeaningApiCall(parseInt(id), submitData);
      } else {
        await createFlowerMeaningApiCall(submitData);
      }
      navigate("/flower-meanings");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || "Failed to save flower meaning"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/flower-meanings")}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">
              {isEditMode ? "Update Flower Meaning" : "Create Flower Meaning"}
            </h1>
            <p className="text-emerald-600">
              {isEditMode
                ? "Edit flower language and symbolism"
                : "Add new flower meaning to the database"}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Flower Name *
              </label>
              <input
                type="text"
                name="name"
                value={flowerMeaning.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Scientific Name
              </label>
              <input
                type="text"
                name="scientificName"
                value={flowerMeaning.scientificName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Meaning *
              </label>
              <input
                type="text"
                name="meaning"
                value={flowerMeaning.meaning}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Symbolism *
              </label>
              <textarea
                name="symbolism"
                value={flowerMeaning.symbolism}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={flowerMeaning.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Occasions */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Occasions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newOccasion}
                  onChange={(e) => setNewOccasion(e.target.value)}
                  placeholder="Add occasion..."
                  className="flex-1 px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleArrayInput("occasions", newOccasion);
                    setNewOccasion("");
                  }}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {flowerMeaning.occasions?.map((occasion, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                  >
                    {occasion}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("occasions", index)}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
              Additional Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Season
                </label>
                <select
                  name="season"
                  value={flowerMeaning.season}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select season</option>
                  <option value="SPRING">Spring</option>
                  <option value="SUMMER">Summer</option>
                  <option value="AUTUMN">Autumn</option>
                  <option value="WINTER">Winter</option>
                  <option value="ALL_SEASON">All Season</option>
                  <option value="SPRING_SUMMER">Spring & Summer</option>
                  <option value="SUMMER_AUTUMN">Summer & Autumn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Origin Country
                </label>
                <input
                  type="text"
                  name="originCountry"
                  value={flowerMeaning.originCountry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Blooming Period
              </label>
              <input
                type="text"
                name="bloomingPeriod"
                value={flowerMeaning.bloomingPeriod}
                onChange={handleInputChange}
                placeholder="e.g., March to May"
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Color Varieties
              </label>
              <input
                type="text"
                name="colorVarieties"
                value={flowerMeaning.colorVarieties}
                onChange={handleInputChange}
                placeholder="e.g., Red, Pink, White, Yellow"
                className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Color Meanings */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Color Meanings
              </label>
              <div className="space-y-2 mb-2">
                <select
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a color
                  </option>
                  {[
                    "RED",
                    "WHITE",
                    "YELLOW",
                    "PINK",
                    "PURPLE",
                    "BLUE",
                    "ORANGE",
                    "LAVENDER",
                    "PEACH",
                    "GREEN",
                    "BLACK",
                    "MULTICOLOR",
                  ].map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newColorMeaning}
                  onChange={(e) => setNewColorMeaning(e.target.value)}
                  placeholder="Meaning"
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleColorMeaningAdd}
                  className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  Add Color Meaning
                </button>
              </div>
              <div className="space-y-2">
                {Array.from(flowerMeaning.colorMeanings || new Map()).map(
                  ([color, meaning]) => (
                    <div
                      key={color}
                      className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-emerald-900">
                          {color}:
                        </span>
                        <span className="text-emerald-700 ml-2">{meaning}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeColorMeaning(color)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Cultural Meanings */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Cultural Meanings
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCulturalMeaning}
                  onChange={(e) => setNewCulturalMeaning(e.target.value)}
                  placeholder="Add cultural meaning..."
                  className="flex-1 px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleArrayInput("culturalMeanings", newCulturalMeaning);
                    setNewCulturalMeaning("");
                  }}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              <div className="space-y-1">
                {flowerMeaning.culturalMeanings?.map((meaning, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
                  >
                    <span className="text-amber-800">{meaning}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("culturalMeanings", index)}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Planting Guide
                </label>
                <textarea
                  name="plantingGuide"
                  value={flowerMeaning.plantingGuide}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Care Instructions
                </label>
                <textarea
                  name="careInstructions"
                  value={flowerMeaning.careInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border text-emerald-600 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPerennial"
                checked={flowerMeaning.isPerennial}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
              />
              <label className="ml-2 block text-sm text-emerald-700">
                Perennial Plant
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-emerald-100">
          <button
            type="button"
            onClick={() => navigate("/flower-meanings")}
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
              ? "Update Flower Meaning"
              : "Create Flower Meaning"}
          </button>
        </div>
      </form>
    </div>
  );
}
