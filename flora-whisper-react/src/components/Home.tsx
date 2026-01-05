import { useEffect, useState } from "react";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { AiOutlineTruck } from "react-icons/ai";
import { GiPlantWatering } from "react-icons/gi";
import { PiGift, PiPottedPlant } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigator = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1603436326446-74e2d65f3168?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=471",
    "https://images.unsplash.com/photo-1618667066353-06982fc2ea72?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
    "https://plus.unsplash.com/premium_photo-1678653651490-647ad9d75f7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
    "https://images.unsplash.com/photo-1557939628-3e476420db6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    "https://plus.unsplash.com/premium_photo-1676117272892-785c4e6294d2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* Home Section */}
      <div className="min-h-screen bg-white py-8 px-4 flex items-center content-center">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-none my-8"></div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Text */}
            <div className="home_datalg:w-1/3 text-center lg:text-left lg:pl-12">
              <Fade direction="left" duration={800}>
                <h2 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-12 leading-tight">
                  Where Love Grows Wild
                </h2>
              </Fade>

              <Fade direction="left" duration={800} delay={200}>
                <div className="space-y-1">
                  <h3 className="text-4xl font-bold text-emerald-700">280+</h3>
                  <p className="text-lg text-emerald-600 font-medium">
                    Hearts connected through nature's beauty
                  </p>
                </div>
              </Fade>
            </div>

            {/* Spinning Circle */}
            <div className="lg:w-1/3 flex justify-center">
              <Zoom duration={1000}>
                <div className="relative">
                  {/* Outer spinning circle with inline style */}
                  <div
                    className="w-64 h-64 md:w-80 md:h-80 border-8 border-emerald-200 border-t-emerald-600 rounded-full"
                    style={{
                      animation: "spin-slow 8s linear infinite",
                    }}
                  >
                    {/* Spinning element */}
                  </div>

                  {/* Fixed inner circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 md:w-72 md:h-72 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden border-4 border-emerald-100">
                      <img
                        src={images[currentImageIndex]}
                        alt="Plant"
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-emerald-800 rounded-full"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full"></div>
                </div>
              </Zoom>
            </div>

            {/* Right Text */}
            <div className="lg:w-1/3 text-center lg:text-left lg:pr-12 lg:self-end">
              <Fade direction="right" duration={800}>
                <div className="mb-8">
                  <p className="text-emerald-700 text-base leading-relaxed max-w-md">
                    Every plant tells a story of love and care. Like
                    relationships, they grow stronger with attention, patience,
                    and the right environment. Let us help you cultivate not
                    just plants, but connections that blossom.
                  </p>
                </div>
              </Fade>

              <Fade direction="right" duration={800} delay={200}>
                <button
                  onClick={() => navigator("/plant")}
                  className="border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-800 hover:border-emerald-800 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 w-fit"
                >
                  Begin Your Love Story
                </button>
              </Fade>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <Fade direction="up" duration={600}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
                Our Promise to You
              </h2>
              <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
                We nurture your green dreams with the same care you'd give to
                someone you love
              </p>
            </div>
          </Fade>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Card 1 */}
            <Fade direction="up" duration={600} delay={100}>
              <div className="border-2 border-emerald-400 p-6 cursor-pointer rounded-xl hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white shadow-lg hover:shadow-emerald-100/50">
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <AiOutlineTruck className="text-2xl md:text-3xl text-emerald-800"></AiOutlineTruck>
                  </div>
                  <p className="md:text-lg font-bold text-emerald-800">
                    Swift <br />
                    Delivery
                  </p>
                </div>
                <p className="text-emerald-600">
                  Your green companions arrive fresh and ready to bring joy to
                  your space, delivered with care
                </p>
              </div>
            </Fade>

            {/* Card 2 */}
            <Fade direction="up" duration={600} delay={200}>
              <div className="border-2 border-emerald-400 p-6 cursor-pointer rounded-xl hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white shadow-lg hover:shadow-emerald-100/50">
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <PiPottedPlant className="text-2xl md:text-3xl text-emerald-800"></PiPottedPlant>
                  </div>
                  <p className="md:text-lg font-bold text-emerald-800">
                    Living <br />
                    Love
                  </p>
                </div>
                <p className="text-emerald-600">
                  Each plant is chosen with love, nurtured with care, and ready
                  to grow alongside your journey
                </p>
              </div>
            </Fade>

            {/* Card 3 */}
            <Fade direction="up" duration={600} delay={300}>
              <div className="border-2 border-emerald-400 p-6 cursor-pointer rounded-xl hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white shadow-lg hover:shadow-emerald-100/50">
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <GiPlantWatering className="text-2xl md:text-3xl text-emerald-800"></GiPlantWatering>
                  </div>
                  <p className="md:text-lg font-bold text-emerald-800">
                    Growing <br />
                    Together
                  </p>
                </div>
                <p className="text-emerald-600">
                  We're here for every step - from first bloom to flourishing
                  growth, like true companionship
                </p>
              </div>
            </Fade>

            {/* Card 4 */}
            <Fade direction="up" duration={600} delay={400}>
              <div className="border-2 border-emerald-400 p-6 cursor-pointer rounded-xl hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white shadow-lg hover:shadow-emerald-100/50">
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <PiGift className="text-2xl md:text-3xl text-emerald-800"></PiGift>
                  </div>
                  <p className="md:text-lg font-bold text-emerald-800">
                    Gift of <br />
                    Nature
                  </p>
                </div>
                <p className="text-emerald-600">
                  Wrap your affection in nature's beauty - the perfect way to
                  say "I care" with lasting meaning
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </div>

      {/* Gift Card Section */}
      <div className="bg-white py-10 px-4">
        <div className="container mx-auto mx-w-7xl">
          <Slide direction="up" duration={800}>
            <div className="bg-emerald-50/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400">
              <div className="flex flex-col lg:flex-row">
                {/* Image Side */}
                <div className="lg:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=500&fit=crop"
                    alt="Beautiful flowers"
                    className="w-full h-30 lg:h-60 object-cover"
                  />
                </div>

                {/* Text Side */}
                <div className="lg:w-1/2 p-3 lg:p-5 flex flex-col justify-center bg-white/10">
                  <Fade direction="right" duration={600}>
                    <h2 className="text-2xl md:text-2xl font-bold text-emerald-900 mb-4">
                      The Language of Love
                    </h2>
                    <p className="text-emerald-800 text-md leading-relaxed mb-5 font-serif">
                      "Roses whisper 'I love you,' lavender promises devotion,
                      and sunflowers speak of adoration. Let flowers express
                      what words cannot - the silent, growing language of the
                      heart."
                    </p>
                    <button
                      onClick={() => navigator("/flower-language")}
                      className="border-2 border-emerald-400 text-sm text-emerald-600 hover:bg-emerald-800 hover:border-emerald-800 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 w-fit"
                    >
                      Discover Flower Meanings
                    </button>
                  </Fade>
                </div>
              </div>
            </div>
          </Slide>
        </div>
      </div>
    </>
  );
}
