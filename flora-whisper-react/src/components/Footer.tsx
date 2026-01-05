import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import { GiFlowerPot } from "react-icons/gi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAllCategoriesApiCall } from "../service/FloraService";
import type { CategoryDto } from "../dto/CategoryDto";

export default function Footer() {

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
      getAllCategoriesApiCall()
        .then((res) => setCategories(res.data))
        .catch((err) => console.log(err));
    }, []);

  return (
    <div className="bg-emerald-800 text-white">
      <Fade direction="up" duration={600} triggerOnce>
        <footer className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and About */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <GiFlowerPot className="text-4xl text-white animate-pulse" />
                  <h3 className="text-2xl font-bold">FloraWhisper</h3>
                </div>
                <p className="text-emerald-100 mb-4 max-w-md leading-relaxed">
                  Bringing nature's beauty into your home with carefully
                  selected plants and flowers that speak the language of love
                  and care.
                </p>
                <div className="flex space-x-4 text-emerald-100">
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="mailto:info@florawhisper.com"
                    className="hover:text-white transition-colors"
                    aria-label="Email"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="text-emerald-100 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/flower-language"
                      className="text-emerald-100 hover:text-white transition-colors"
                    >
                      Flower Language
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/plant"
                      className="text-emerald-100 hover:text-white transition-colors"
                    >
                      Shop Plants
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user-profile"
                      className="text-emerald-100 hover:text-white transition-colors"
                    >
                      My Profile
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Popular Categories */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  Popular Categories
                </h4>
                <ul className="space-y-2">

                  {categories.map(cate => (
                    <li key={cate.categoryId}>
                    <Link
                      to={`/plants/${cate.categoryId}`}
                      className="text-emerald-100 hover:text-white transition-colors"
                    >
                      {cate.categoryName}
                    </Link>
                  </li>))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-emerald-500 mt-8 pt-8 text-center">
              <p className="text-emerald-100 text-sm">
                © {new Date().getFullYear()} FloraWhisper. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </Fade>
    </div>
  );
}
