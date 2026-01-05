import { useState, useEffect } from "react";
import {
  getCheckoutHistory,
  type CheckoutResponseDto,
} from "../service/FloraService";
import {
  FaBox,
  FaCalendar,
  FaDollarSign,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

export default function OrderHistory() {
  const [orders, setOrders] = useState<CheckoutResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await getCheckoutHistory();
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load order history" + err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "SHIPPED":
        return <FaTruck className="text-blue-500" />;
      case "PROCESSING":
        return <FaClock className="text-amber-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            Order History
          </h1>
          <p className="text-emerald-600">
            Track your purchases and deliveries
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaBox className="text-6xl text-emerald-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">
              No orders yet
            </h2>
            <p className="text-emerald-600 mb-4">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => (window.location.href = "/plants")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderCode}
                className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        {getStatusIcon(order.shippingStatus!)}
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-lg">
                          Order #{order.orderCode}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-emerald-600 mt-1">
                          <div className="flex items-center gap-1">
                            <FaCalendar className="text-xs" />
                            <span>
                              Ordered:{" "}
                              {new Date(order.orderDate!).toLocaleDateString()}
                            </span>
                          </div>
                          {order.expectedDeliveryDate && (
                            <div className="flex items-center gap-1">
                              <FaTruck className="text-xs" />
                              <span>
                                Expected:{" "}
                                {new Date(
                                  order.expectedDeliveryDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <FaShoppingCart className="text-emerald-500 text-sm" />
                        <span className="text-emerald-700 font-medium">
                          {order.totalItems} items
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <FaDollarSign className="text-emerald-500 text-sm" />
                        <span className="text-emerald-700 font-medium">
                          ${order.totalAmount!.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(
                          order.shippingStatus!
                        )}`}
                      >
                        {order.shippingStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-emerald-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-2">
                          Shipping Address
                        </h4>
                        <p className="text-emerald-600 text-sm leading-relaxed">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>

                    {order.expectedDeliveryDate && (
                      <div className="flex items-start gap-3">
                        <FaTruck className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-emerald-900 mb-2">
                            Delivery Timeline
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-emerald-600">
                              <span className="font-medium">Ordered:</span>{" "}
                              {new Date(order.orderDate!).toLocaleDateString()}
                            </p>
                            <p className="text-blue-600 font-medium">
                              <span className="font-semibold">
                                Expected Delivery:
                              </span>{" "}
                              {new Date(
                                order.expectedDeliveryDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Status */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between text-xs text-emerald-600 mb-2">
                    <span>Ordered</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        order.shippingStatus === "PENDING"
                          ? "bg-amber-500 w-1/3"
                          : order.shippingStatus === "OUT_FOR_DELIVERY"
                          ? "bg-blue-500 w-2/3"
                          : order.shippingStatus === "DELIVERED"
                          ? "bg-green-500 w-full"
                          : "bg-emerald-500 w-1/4"
                      } transition-all duration-500`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-900">
                {orders.length}
              </div>
              <div className="text-emerald-600 text-sm">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-900">
                $
                {orders
                  .reduce((sum, order) => sum + order.totalAmount!, 0)
                  .toFixed(2)}
              </div>
              <div className="text-emerald-600 text-sm">Total Spent</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-900">
                {
                  orders.filter((order) => order.shippingStatus === "DELIVERED")
                    .length
                }
              </div>
              <div className="text-emerald-600 text-sm">Delivered</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
