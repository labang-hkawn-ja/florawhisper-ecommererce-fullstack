import { useEffect, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import type { CategoryDto } from "../dto/CategoryDto";
import { Link, useNavigate } from "react-router-dom";
import { GiFlowerPot } from "react-icons/gi";
import { isLoggedIn, logoutApiCall } from "../service/AuthService";
import { getAllCategoriesApiCall } from "../service/FloraService";
import { useCart } from "../dto/UseCart";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const navigator = useNavigate();
  const beLogin = isLoggedIn();

  const { cartItems } = useCart();

  const logoutHandler = () => {
    logoutApiCall();
    navigator("/login");
    window.location.reload();
  };

  useEffect(() => {
    getAllCategoriesApiCall()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Navigation items component
  const NavigationItems = ({ isMobile = false, onItemClick = () => {} }) => (
    <>
      <a
        href="/"
        className="hover:text-emerald-100 transition-colors font-medium py-2"
        onClick={onItemClick}
      >
        Home
      </a>

      {/* Category Dropdown */}
      <div className="relative">
        <button
          className={`flex items-center space-x-1 hover:text-emerald-100 transition-colors font-medium ${
            isMobile ? "justify-between w-full py-2" : ""
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>Category</span>
          <FaChevronDown className="text-sm" />
        </button>

        {isDropdownOpen && (
          <div
            className={`${
              isMobile
                ? "ml-4 mt-2 bg-white text-emerald-800 rounded-lg py-2"
                : "absolute top-full left-0 mt-2 w-48 bg-white text-emerald-800 rounded-lg shadow-xl py-2 z-50"
            }`}
          >
            <Link
              to={"/plant"}
              className={`block px-4 py-2 transition-colors ${
                isMobile
                  ? "hover:bg-emerald-600 hover:text-white"
                  : "hover:bg-emerald-600 hover:text-white"
              }`}
              onClick={() => {
                setIsDropdownOpen(false);
                onItemClick();
              }}
            >
              All
            </Link>

            {categories.length > 0 &&
              categories.map((category) => (
                <Link
                  key={category.categoryId}
                  to={`/plants/${category.categoryId}`}
                  className={`block px-4 py-2 transition-colors ${
                    isMobile
                      ? "hover:bg-emerald-600 hover:text-white"
                      : "hover:bg-emerald-600 hover:text-white"
                  }`}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onItemClick();
                  }}
                >
                  {category.categoryName}
                </Link>
              ))}
          </div>
        )}
      </div>

      <Link
        to="/flower-language"
        className="hover:text-emerald-100 transition-colors font-medium py-2"
        onClick={onItemClick}
      >
        Flower Language
      </Link>

      {beLogin && <Link
        to="/history"
        className="hover:text-emerald-100 transition-colors font-medium py-2"
        onClick={onItemClick}
      >
        Order History
      </Link>}

      {/* Auth Buttons */}
      <div
        className={`flex ${
          isMobile
            ? "flex-col space-y-4 pt-4 border-t border-emerald-700"
            : "items-center space-x-4"
        }`}
      >
        {beLogin ? (
          <>
            <button
              className="flex items-center space-x-2 hover:text-emerald-100 transition-colors font-medium py-2"
              onClick={() => navigator("/user-profile")}
            >
              <FaUser className="text-sm" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                logoutHandler();
                onItemClick();
              }}
              className="flex items-center space-x-2 hover:text-emerald-100 transition-colors font-medium py-2"
            >
              <FaSignOutAlt className="text-sm" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to={"/login"}
              className={`flex items-center space-x-2 bg-white text-emerald-600 hover:bg-emerald-50 transition-colors font-medium ${
                isMobile
                  ? "px-4 py-2 rounded-full text-center justify-center"
                  : "px-4 py-2 rounded-full"
              }`}
              onClick={onItemClick}
            >
              <FaSignInAlt className="text-sm" />
              <span>Login</span>
            </Link>
            {isMobile && <span className="text-center">Or</span>}
            <Link
              to={"/register"}
              className={`flex items-center space-x-2 bg-white text-emerald-600 hover:bg-emerald-50 transition-colors font-medium ${
                isMobile
                  ? "px-4 py-2 rounded-full text-center justify-center"
                  : "px-4 py-2 rounded-full"
              }`}
              onClick={onItemClick}
            >
              <FaUserPlus className="text-sm" />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </>
  );

  return (
    <header className="bg-emerald-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <a href="/" className="hover:text-emerald-100 transition-colors">
              <div className="flex items-center space-x-2">
                <GiFlowerPot className="text-4xl text-white animate-pulse" />
                <span className="text-2xl font-bold">FloraWhisper</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationItems />

            {/* Cart Icon - Added to desktop navigation */}
            {beLogin && (
              <Link to={"/add-to-cart"}>
                <div className="flex items-center space-x-2 hover:text-emerald-100 transition-colors font-medium py-2">
                  <FaShoppingCart size={25} className="me-1" />
                  <span className="p-1 rounded-full bg-emerald-500 text-white text-xs">
                    {cartItems.length}
                  </span>
                </div>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-emerald-800 shadow-lg py-4 px-4 border-t border-emerald-700">
            <div className="flex flex-col space-y-2">
              <NavigationItems
                isMobile={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Cart Icon - Added to mobile menu */}
              {beLogin && (
                <Link to={"/add-to-cart"}>
                  <div className="flex items-center space-x-2 hover:text-emerald-100 transition-colors font-medium py-2">
                    <FaShoppingCart className="text-sm" />
                    <span>Cart</span>
                    <span className="p-1 rounded-full bg-emerald-500 text-white text-xs">
                      {cartItems.length}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
