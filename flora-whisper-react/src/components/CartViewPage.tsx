import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaLeaf,
} from "react-icons/fa";
import { isLoggedIn } from "../service/AuthService";
import { calculateOrderTotal } from "../service/FloraService";
import { useCart } from "../dto/UseCart";

export default function CartViewPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalCost,
    getTotalItems,
  } = useCart();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  //   const handleQuantityChange = (plantId: number, newQuantity: number) => {
  //     if (newQuantity < 1) {
  //       removeFromCart(plantId);
  //     } else {
  //       updateQuantity(plantId, newQuantity);
  //     }
  //   };

  const handleIncrement = (
    plantId: number,
    currentQuantity: number,
    stock: number
  ) => {
    if (currentQuantity < stock) {
      updateQuantity(plantId, currentQuantity + 1);
    }
  };

    const handleQuantityChange = (plantId: number, newQuantity: number) => {
        updateQuantity(plantId, newQuantity);
    };

  const handleDecrement = (plantId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(plantId, currentQuantity - 1);
    } else {
      removeFromCart(plantId);
    }
  };

  const { shipping, tax, total } = calculateOrderTotal(getTotalCost());

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-4xl font-bold text-emerald-900">
              Shopping Cart
            </h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-emerald-100">
            <FaShoppingCart className="text-6xl text-emerald-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-emerald-700 text-lg mb-8">
              Discover our beautiful collection of plants and add some greenery
              to your life!
            </p>
            <Link
              to="/plants"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
            >
              <FaLeaf />
              Browse Plants
            </Link>
          </div>
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
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold text-emerald-900">Shopping Cart</h1>
          <div className="ml-auto bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-900">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <FaTrash className="text-sm" />
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.plant.plantId}
                    className="flex items-center gap-4 p-4 border border-emerald-100 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    {/* Plant Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={`data:image/jpeg;base64,${item.plant.imageUrl}`}
                        alt={item.plant.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>

                    {/* Plant Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-emerald-900 text-lg mb-1">
                        {item.plant.name}
                      </h3>
                      <p className="text-emerald-600 text-sm mb-2 line-clamp-1">
                        {item.plant.description}
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        ${item.plant.price.toFixed(2)}
                      </p>
                      {item.plant.stock < 10 && (
                        <p className="text-amber-600 text-xs mt-1">
                          Only {item.plant.stock} left in stock
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleDecrement(item.plant.plantId!, item.quantity)
                        }
                        className="w-8 h-8 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 1;
                          if (newValue >= 1 && newValue <= item.plant.stock) {
                            handleQuantityChange(item.plant.plantId!, newValue);
                          }
                        }}
                        onBlur={(e) => {
                          let newValue = parseInt(e.target.value) || 1;
                          // Ensure value is within bounds
                          newValue = Math.max(
                            1,
                            Math.min(newValue, item.plant.stock)
                          );
                          handleQuantityChange(item.plant.plantId!, newValue);
                        }}
                        min="1"
                        max={item.plant.stock}
                        className="w-16 h-8 border border-emerald-200 rounded-lg text-center font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />

                      <button
                        onClick={() =>
                          handleIncrement(
                            item.plant.plantId!,
                            item.quantity,
                            item.plant.stock
                          )
                        }
                        disabled={item.quantity >= item.plant.stock}
                        className="w-8 h-8 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-20">
                      <p className="font-bold text-emerald-900 text-lg">
                        ${(item.plant.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.plant.plantId!)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100 sticky top-8">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-semibold text-emerald-900">
                    ${getTotalCost().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Shipping</span>
                  <span className="font-semibold text-emerald-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Tax</span>
                  <span className="font-semibold text-emerald-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-emerald-100 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-emerald-900">Total</span>
                    <span className="text-2xl text-emerald-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                <FaShoppingCart />
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              {/* Continue Shopping */}
              <Link
                to="/plants"
                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-xl font-semibold text-center block mt-4 transition-all duration-300"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-700 mb-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">Secure Checkout</span>
                </div>
                <p className="text-emerald-600 text-sm">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
