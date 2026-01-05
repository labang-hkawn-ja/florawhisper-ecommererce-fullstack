import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaMapMarkerAlt,
  FaSun,
  FaLeaf,
  FaPalette,
  FaSeedling,
  FaTint,
  FaRulerVertical,
  FaCalendarAlt,
} from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import { getFlowerMeaningsByIdApiCall } from "../service/FloraService";

export default function FlowerLanguageDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flower, setFlower] = useState<FlowerLanguageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchFlower = async () => {
        setLoading(true);
        try {
          const response = await getFlowerMeaningsByIdApiCall(Number(id));
          setFlower(response.data);
        } catch (err) {
          setError("Failed to load flower details.");
          console.error("Error fetching flower:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFlower();
    }
  }, [id]);

  // Color mapping utility function
  const getColorDetails = (colorName: string) => {
    const colorMap: {
      [key: string]: {
        bgColor: string;
        textColor: string;
        displayName: string;
      };
    } = {
      // Reds
      red: {
        bgColor: "#dc2626",
        textColor: "#ffffff",
        displayName: "Classic Red",
      },

      // Pinks
      pink: { bgColor: "#ec4899", textColor: "#ffffff", displayName: "Pink" },

      // Purples
      purple: {
        bgColor: "#9333ea",
        textColor: "#ffffff",
        displayName: "Purple",
      },
      violet: {
        bgColor: "#8b5cf6",
        textColor: "#ffffff",
        displayName: "Violet",
      },
      lavender: {
        bgColor: "#a78bfa",
        textColor: "#ffffff",
        displayName: "Lavender",
      },
      lilac: { bgColor: "#c4b5fd", textColor: "#4c1d95", displayName: "Lilac" },
      orchid: {
        bgColor: "#d946ef",
        textColor: "#ffffff",
        displayName: "Orchid",
      },

      // Blues
      blue: { bgColor: "#3b82f6", textColor: "#ffffff", displayName: "Blue" },

      // Greens
      green: { bgColor: "#16a34a", textColor: "#ffffff", displayName: "Green" },
      emerald: {
        bgColor: "#10b981",
        textColor: "#ffffff",
        displayName: "Emerald",
      },
      olive: { bgColor: "#65a30d", textColor: "#ffffff", displayName: "Olive" },

      // Yellows & Oranges
      yellow: {
        bgColor: "#eab308",
        textColor: "#713f12",
        displayName: "Yellow",
      },
      gold: { bgColor: "#f59e0b", textColor: "#78350f", displayName: "Gold" },
      orange: {
        bgColor: "#f97316",
        textColor: "#ffffff",
        displayName: "Orange",
      },
      peach: { bgColor: "#fed7aa", textColor: "#9a3412", displayName: "Peach" },

      // Whites & Neutrals
      white: { bgColor: "#f8fafc", textColor: "#0f172a", displayName: "White" },

      // Special Colors
      multicolor: {
        bgColor:
          "linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b)",
        textColor: "#ffffff",
        displayName: "Multicolor",
      },
    };

    const normalizedColor = colorName.toLowerCase().trim();

    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }

    // Try partial matching for colors like "light blue", "dark red", etc.
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedColor.includes(key)) {
        return value;
      }
    }

    // Fallback for unknown colors - generate a consistent color from the string
    const fallbackColors = [
      "#ef4444",
      "#f59e0b",
      "#84cc16",
      "#06b6d4",
      "#8b5cf6",
      "#ec4899",
      "#f97316",
    ];
    const hash = normalizedColor.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const fallbackColor =
      fallbackColors[Math.abs(hash) % fallbackColors.length];

    return {
      bgColor: fallbackColor,
      textColor: "#ffffff",
      displayName:
        colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase(),
    };
  };

  // Color display component
  const ColorDisplay = ({ colorName }: { colorName: string }) => {
    const colorDetails = getColorDetails(colorName);
    const isGradient = colorDetails.bgColor.includes("gradient");

    return (
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full border-2 border-emerald-200 flex items-center justify-center ${
            isGradient ? "" : "shadow-md"
          }`}
          style={
            isGradient
              ? { background: colorDetails.bgColor }
              : {
                  backgroundColor: colorDetails.bgColor,
                  color: colorDetails.textColor,
                }
          }
        >
          {isGradient && (
            <div className="w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm" />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading flower details...</p>
        </div>
      </div>
    );
  }

  if (error || !flower) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700">{error || "Flower not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:bg-white hover:text-emerald-800 transition-colors p-3 rounded-full bg-emerald-600 shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <h1 className="text-3xl font-bold text-emerald-900">
            Flower Language
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Quick Facts */}
          <div className="lg:col-span-1 space-y-6">
            <Fade direction="down" duration={600}>
              {/* Image Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                <div className="relative">
                  {flower.imageUrls && flower.imageUrls.length > 0 ? (
                    <img
                      src={`/img/meanings/${flower.imageUrls[0]}.jpg`}
                      alt={flower.name}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-emerald-100">
                      <FaLeaf className="text-6xl text-emerald-400 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                {/* Quick Info */}
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-emerald-900 mb-2">
                    {flower.name}
                  </h1>
                  <p className="text-emerald-600 text-sm mb-4 italic">
                    {flower.scientificName}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-emerald-700">
                      <FaHeart className="text-red-500 flex-shrink-0" />
                      <span className="text-sm">{flower.meaning}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-700">
                      <FaSun className="text-yellow-500 flex-shrink-0" />
                      <span className="text-sm">{flower.season}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-700">
                      <FaMapMarkerAlt className="flex-shrink-0" />
                      <span className="text-sm">{flower.originCountry}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>

            {/* Quick Facts Card */}
            <Fade direction="left" duration={600} delay={200}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <FaLeaf className="text-emerald-500" />
                  Quick Facts
                </h3>

                <div className="space-y-4">
                  {/* Plant Type */}
                  <div className="flex items-center justify-between py-2 border-b border-emerald-50">
                    <span className="text-emerald-700 font-medium">Type</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        flower.isPerennial
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {flower.isPerennial ? "Perennial" : "Annual"}
                    </span>
                  </div>

                  {/* Blooming Period */}
                  <div className="flex items-center gap-3 py-2 border-b border-emerald-50">
                    <FaCalendarAlt className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-700 font-medium text-sm">
                        Blooms
                      </p>
                      <p className="text-emerald-600 text-sm">
                        {flower.bloomingPeriod}
                      </p>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-3 py-2 border-b border-emerald-50">
                    <FaPalette className="text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-700 font-medium text-sm">
                        Colors
                      </p>
                      <p className="text-emerald-600 text-sm">
                        {flower.colorVarieties}
                      </p>
                    </div>
                  </div>

                  {/* Ideal For */}
                  {flower.occasions && flower.occasions.length > 0 && (
                    <div className="py-2">
                      <p className="text-emerald-700 font-medium text-sm mb-2">
                        Ideal For
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {flower.occasions.slice(0, 3).map((occasion, index) => (
                          <span
                            key={index}
                            className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium"
                          >
                            {occasion}
                          </span>
                        ))}
                        {flower.occasions.length > 3 && (
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium">
                            +{flower.occasions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Fade>

            {/* Growing Tips Card */}
            <Fade direction="left" duration={600} delay={400}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <FaSeedling className="text-emerald-500" />
                  Growing Tips
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <FaSun className="text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 font-medium text-sm">
                        Sunlight
                      </p>
                      <p className="text-amber-700 text-xs">
                        Full to partial sun
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <FaTint className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Water</p>
                      <p className="text-blue-700 text-xs">
                        Moderate, well-drained soil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <FaRulerVertical className="text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-800 font-medium text-sm">
                        Height
                      </p>
                      <p className="text-green-700 text-xs">
                        Varies by species
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-emerald-800 font-medium text-sm mb-1">
                    💡 Did you know?
                  </p>
                  <p className="text-emerald-700 text-xs">
                    {flower.name} has been used in flower language for centuries
                    to express {flower.meaning?.toLowerCase()}.
                  </p>
                </div>
              </div>
              {/* Footer */}
              <div className=" lg:mt-40 flex items-center gap-4 mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white hover:bg-white hover:text-emerald-800 transition-colors p-3 rounded-full bg-emerald-600 shadow-md hover:shadow-lg"
                >
                  <FaArrowLeft className="text-sm" />
                </button>
                <h1 className="text-2xl font-bold text-emerald-900">
                  Back To Previous
                </h1>
              </div>
            </Fade>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meaning & Symbolism */}
            <Fade direction="right" duration={600}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-3">
                  <FaHeart className="text-red-500" />
                  Meaning & Symbolism
                </h2>
                <p className="text-emerald-600 mb-6 leading-relaxed text-lg">
                  {flower.symbolism}
                </p>

                {flower.colorMeanings &&
                  Object.keys(flower.colorMeanings).length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                        Color Meanings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(flower.colorMeanings).map(
                          ([color, meaning]) => (
                            <div
                              key={color}
                              className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <ColorDisplay colorName={color} />
                                <p className="text-emerald-700 font-semibold capitalize">
                                  {color}
                                </p>
                              </div>
                              <p className="text-emerald-600 text-sm">
                                {meaning}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}
              </div>
            </Fade>

            {/* Cultural Meanings */}
            <Fade direction="right" duration={600} delay={200}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  Cultural Significance
                </h2>
                <ul className="space-y-3">
                  {flower.culturalMeanings?.map((meaning, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                    >
                      <FaLeaf className="text-emerald-500 mt-1 flex-shrink-0" />
                      <span className="text-emerald-600">{meaning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Fade>

            {/* Description */}
            <Fade direction="up" duration={600}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  About {flower.name}
                </h2>
                <p className="text-emerald-600 leading-relaxed text-lg">
                  {flower.description}
                </p>
              </div>
            </Fade>

            {/* Care Instructions */}
            <Fade direction="up" duration={600} delay={200}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  Care Instructions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                      <FaSeedling className="text-emerald-500" />
                      Planting Guide
                    </h3>
                    <p className="text-emerald-600 text-sm leading-relaxed">
                      {flower.plantingGuide}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                      <FaSun className="text-yellow-500" />
                      Daily Care
                    </h3>
                    <p className="text-emerald-600 text-sm leading-relaxed">
                      {flower.careInstructions}
                    </p>
                  </div>
                </div>
              </div>
            </Fade>

            {/* Image Gallery */}
            {flower.imageUrls && flower.imageUrls.length > 1 && (
              <Fade direction="up" duration={600} delay={400}>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {flower.imageUrls.slice(1).map((imgUrl, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl"
                      >
                        <img
                          src={`/img/meanings/${imgUrl}.jpg`}
                          alt={`${flower.name} variety ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </Fade>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
