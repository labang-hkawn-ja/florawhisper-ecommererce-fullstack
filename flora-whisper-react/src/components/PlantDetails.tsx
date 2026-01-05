// PlantDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaSeedling,
  FaRulerVertical,
  FaSmile,
  FaPalette,
  FaCube,
  FaTint,
  FaSun,
  FaThermometerHalf,
} from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { getPlantByIdApiCall } from "../service/FloraService";
import type { PlantDto } from "../dto/PlantDto";
import { useCart } from "./CartContext";

export default function PlantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<PlantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { cartItems, addToCart, removeFromCart } = useCart();

  const isInCart = cartItems.some(
    (item) => item.plant.plantId === plant?.plantId
  );

  useEffect(() => {
    const fetchPlant = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getPlantByIdApiCall(parseInt(id));
        setPlant(response.data);
      } catch (err: unknown) {
        console.error("Error fetching plant:", err);
        setError("Failed to load plant details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
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
        <div>
          <span className="text-emerald-900 font-medium block">
            {colorDetails.displayName}
          </span>
          <span className="text-emerald-600 text-sm block">
            {colorName.toLowerCase() !==
              colorDetails.displayName.toLowerCase() && colorName}
          </span>
        </div>
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!plant) return;

    if (!isInCart) {
      addToCart(plant, quantity);
    } else {
      removeFromCart(plant.plantId!);
    }

    console.log("Added to cart:", {
      plant,
      quantity,
      totalPrice: (plant.price * quantity).toFixed(2),
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite logic
  };

  const incrementQuantity = () => {
    if (plant && quantity < plant.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for better UX
    if (value === "") {
      setQuantity(0);
      return;
    }

    // Only allow numbers
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (plant && numValue > plant.stock) {
        setQuantity(plant.stock);
      } else if (numValue < 1) {
        setQuantity(1);
      } else {
        setQuantity(numValue);
      }
    }
  };

  const handleQuantityBlur = () => {
    // If input is empty or 0, set to 1
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  const isBlooms =
    plant?.category === "1" || plant?.category?.toLowerCase().includes("bloom");
  const isGreenery =
    plant?.category === "2" || plant?.category?.toLowerCase().includes("green");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLeaf className="text-4xl text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            Plant Not Found
          </h2>
          <p className="text-emerald-700 mb-6">
            {error || "The plant you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/plants")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Plants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Fade direction="down" duration={600}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-6 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Plants</span>
          </button>
        </Fade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Plant Image */}
          <Fade direction="left" duration={600}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
              <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-50">
                <img
                  src={`data:image/jpeg;base64,${plant.imageUrl}`}
                  alt={plant.name}
                  className="w-full h-full bg-cover"
                />
              </div>
            </div>
          </Fade>

          {/* Product Details */}
          <Fade direction="right" duration={600}>
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isBlooms
                      ? "bg-pink-100 text-pink-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isBlooms ? "🌸 Blooms" : "🌿 Greenery"}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs ${
                    plant.stock > 10
                      ? "bg-emerald-100 text-emerald-700"
                      : plant.stock > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {plant.stock > 10
                    ? "In Stock"
                    : plant.stock > 0
                    ? "Low Stock"
                    : "Out of Stock"}
                </div>
              </div>

              {/* Plant Name */}
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900">
                {plant.name}
              </h1>

              {/* Description */}
              <p className="text-lg text-emerald-700 leading-relaxed">
                {plant.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-emerald-900">
                  ${plant.price.toFixed(2)}
                </span>
                {plant.updatePrice && plant.updatePrice !== plant.price && (
                  <span className="text-xl text-emerald-600 line-through">
                    ${plant.updatePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Category Specific Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blooms Category Details */}
                {isBlooms && (
                  <>
                    {plant.color && (
                      <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <FaPalette className="text-emerald-600" />
                          <h3 className="font-semibold text-emerald-900">
                            Color
                          </h3>
                        </div>
                        <ColorDisplay colorName={plant.color} />
                      </div>
                    )}

                    {plant.piece && (
                      <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <FaCube className="text-emerald-600" />
                          <h3 className="font-semibold text-emerald-900">
                            Bundle
                          </h3>
                        </div>
                        <p className="text-emerald-700">
                          {plant.piece} pieces per bundle
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Greenery Category Details */}
                {isGreenery && (
                  <>
                    {plant.plantSize && (
                      <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <FaRulerVertical className="text-emerald-600" />
                          <h3 className="font-semibold text-emerald-900">
                            Size
                          </h3>
                        </div>
                        <p className="text-emerald-700">{plant.plantSize}</p>
                      </div>
                    )}

                    {plant.isEasyToCare !== undefined && (
                      <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <FaSmile className="text-emerald-600" />
                          <h3 className="font-semibold text-emerald-900">
                            Care Level
                          </h3>
                        </div>
                        <p className="text-emerald-700">
                          {plant.isEasyToCare
                            ? "Easy to Care For"
                            : "Requires Attention"}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Care Instructions for Greenery */}
              {isGreenery && plant.careInstructions && (
                <div className="bg-white rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">
                    Care Instructions
                  </h3>
                  <p className="text-emerald-700 leading-relaxed">
                    {plant.careInstructions}
                  </p>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Selector with Input */}
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-medium">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        -
                      </button>

                      {/* Quantity Input Field */}
                      <input
                        type="text"
                        value={quantity}
                        onChange={handleQuantityInput}
                        onBlur={handleQuantityBlur}
                        className="w-16 h-10 text-center border border-emerald-200 rounded-xl font-semibold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />

                      <button
                        onClick={incrementQuantity}
                        disabled={!plant || quantity >= plant.stock}
                        className="w-10 h-10 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={plant.stock === 0}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    <FaShoppingCart />
                    {plant.stock === 0
                      ? "Out of Stock"
                      : isInCart
                      ? "Remove From Cart"
                      : `Add to Cart - $${(plant.price * quantity).toFixed(2)}`}
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={toggleFavorite}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isFavorite
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <FaHeart className={isFavorite ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Stock Information */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-emerald-600">
                    {plant.stock > 0
                      ? `${plant.stock} available in stock`
                      : "Currently out of stock"}
                  </p>
                </div>
              </div>

              {/* Additional Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <FaTint className="text-emerald-600 text-xl mx-auto mb-2" />
                  <p className="text-sm text-emerald-700">Water Guide</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <FaSun className="text-amber-500 text-xl mx-auto mb-2" />
                  <p className="text-sm text-emerald-700">Light Needs</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <FaThermometerHalf className="text-blue-500 text-xl mx-auto mb-2" />
                  <p className="text-sm text-emerald-700">Temperature</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <FaSeedling className="text-emerald-600 text-xl mx-auto mb-2" />
                  <p className="text-sm text-emerald-700">Care Tips</p>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}
