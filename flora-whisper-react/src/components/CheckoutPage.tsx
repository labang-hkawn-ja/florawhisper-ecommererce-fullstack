import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useCart } from "../dto/UseCart";
import {
  processCheckout,
  type CheckoutRequestDto,
  type CheckoutResponseDto,
} from "../service/FloraService";
import { getLoggedInUserName } from "../service/AuthService";
import type { AxiosError } from "axios";

// Calculate order total with shipping and tax (same as cart page)
const calculateOrderTotal = (subtotal: number) => {
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalCost, getPlantQuantities, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<CheckoutResponseDto | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    customerEmail: "",
    shippingAddress: "",
    customerNotes: "",
    fromAccountNumber: "",
    paymentUsername: "",
    code: "",
  });

  const handleInputChange = (
    field: keyof typeof checkoutData,
    value: string
  ) => {
    setCheckoutData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleCheckout = async () => {
    // Validation
    if (!checkoutData.customerEmail.trim()) {
      setError("Customer's actual email is required");
      return;
    }
    if (!checkoutData.shippingAddress.trim()) {
      setError("Shipping address is required");
      return;
    }
    if (!checkoutData.fromAccountNumber.trim()) {
      setError("Account number is required");
      return;
    }
    if (!checkoutData.paymentUsername.trim()) {
      setError("Payment username is required");
      return;
    }
    if (!checkoutData.code.trim()) {
      setError("Security code is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const subtotal = getTotalCost();
      const { total } = calculateOrderTotal(subtotal);

      const checkoutRequest: CheckoutRequestDto = {
        plantQuantities: getPlantQuantities(),
        totalAmount: total, // Use the calculated total with shipping and tax
        customerEmail: checkoutData.customerEmail,
        shippingAddress: checkoutData.shippingAddress,
        customerNotes: checkoutData.customerNotes,
        fromAccountNumber: checkoutData.fromAccountNumber,
        paymentUsername: checkoutData.paymentUsername,
        code: checkoutData.code,
      };

      const response = await processCheckout(checkoutRequest);

      // Success
      setOrderData(response.data);
      setOrderSuccess(true);
      clearCart(); // Clear cart after successful order
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      setError(
        axiosErr.response?.data?.error || "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderData) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-emerald-900 mb-4">
              Order Successful!
            </h1>
            <p className="text-lg text-emerald-700 mb-2">
              Thank you for your order, {getLoggedInUserName()}!
            </p>
            <div className="bg-emerald-50 rounded-xl p-6 mb-6">
              <p className="text-emerald-800 font-semibold">
                Order Code:{" "}
                <span className="text-emerald-600">{orderData.orderCode}</span>
              </p>
              <p className="text-emerald-700">
                Total Amount:{" "}
                <span className="font-bold">
                  ${orderData.totalAmount!.toFixed(2)}
                </span>
              </p>
              <p className="text-emerald-600 text-sm mt-2">
                We'll send a confirmation email to {orderData.customerEmail}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/history")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/plants")}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <FaShoppingCart className="text-6xl text-emerald-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-emerald-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-emerald-700 mb-6">
              Add some beautiful plants to your cart first!
            </p>
            <button
              onClick={() => navigate("/plants")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Plants
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalCost();
  const { total } = calculateOrderTotal(subtotal);

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
          <h1 className="text-4xl font-bold text-emerald-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Now takes less space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 sticky top-8">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                Order Summary
              </h2>

              {/* Compact Items List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.plant.plantId}
                    className="flex items-center gap-3 p-3 border border-emerald-100 rounded-lg"
                  >
                    <img
                      src={`data:image/jpeg;base64,${item.plant.imageUrl}`}
                      alt={item.plant.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-emerald-900 text-sm truncate">
                        {item.plant.name}
                      </h3>
                      <p className="text-emerald-600 text-xs">
                        Qty: {item.quantity} × ${item.plant.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-semibold text-emerald-900 text-sm whitespace-nowrap">
                      ${(item.plant.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}

              <div className="border-t border-emerald-100 pt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-emerald-900">Total</span>
                  <span className="text-xl text-emerald-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form - Takes more space now */}
          <div className="lg:col-span-2">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border mb-6 border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Active Email *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.customerEmail}
                      onChange={(e) =>
                        handleInputChange("customerEmail", e.target.value)
                      }
                      className="w-full h-24 p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your active email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      value={checkoutData.shippingAddress}
                      onChange={(e) =>
                        handleInputChange("shippingAddress", e.target.value)
                      }
                      className="w-full h-24 p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your complete shipping address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={checkoutData.customerNotes}
                      onChange={(e) =>
                        handleInputChange("customerNotes", e.target.value)
                      }
                      className="w-full h-20 p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Any special instructions or notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      From Account Number *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.fromAccountNumber}
                      onChange={(e) =>
                        handleInputChange("fromAccountNumber", e.target.value)
                      }
                      className="w-full p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Payment Username *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.paymentUsername}
                      onChange={(e) =>
                        handleInputChange("paymentUsername", e.target.value)
                      }
                      className="w-full p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter payment username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Security Code *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.code}
                      onChange={(e) =>
                        handleInputChange("code", e.target.value)
                      }
                      className="w-full p-3 border border-emerald-200 text-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter security code"
                    />
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Complete Order - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
