import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import { getAllFlowerMeaningsApiCall } from "../service/FloraService";
import { TbLocationHeart } from "react-icons/tb";

export default function FlowerLanguagePage() {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState<FlowerLanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      try {
        const response = await getAllFlowerMeaningsApiCall();
        setFlowers(response.data);
      } catch (err) {
        setError("Failed to load flower meanings.");
        console.error("Error fetching flowers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  if (loading) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading flower meanings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700">{error}</p>
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
    <div className="mt-15 bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Fade direction="down" duration={600}>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:bg-white hover:text-emerald-800 transition-colors p-2 rounded-full bg-emerald-600 shadow-md"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-4xl font-bold text-emerald-900">
              Flower Language Collection
            </h1>
          </div>
        </Fade>

        {/* Flower Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flowers.map((flower) => (
            <Fade key={flower.id} direction="up" duration={600} triggerOnce>
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative h-48">
                  {flower.imageUrls && flower.imageUrls.length > 0 ? (
                    <img
                      src={
                        `/img/meanings/${flower.imageUrls[0]}` + ".jpg" ||
                        ".png"
                      }
                      alt={flower.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                      <TbLocationHeart className="text-4xl" />
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/flower-language/${flower.id}`)}
                    className="absolute bg-gray-400 top-2 right-2 text-white p-2 rounded-full hover:bg-emerald-400 transition-colors"
                  >
                    <TbLocationHeart className="text-2xl" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    {flower.name}
                  </h3>
                  <p className="text-emerald-600 text-sm truncate">
                    {flower.meaning}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </div>
  );
}
