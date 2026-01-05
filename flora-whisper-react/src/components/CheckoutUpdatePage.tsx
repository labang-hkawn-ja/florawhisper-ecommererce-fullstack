import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTruck, FaCheckCircle } from "react-icons/fa";
import {
  updateOrderStatusApiCall,
  getAllOrdersApiCall,
  type CheckoutResponseDto,
} from "../service/FloraService";
import type { AxiosError } from "axios";

export default function CheckoutUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<CheckoutResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
  }, [id]);

  const fetchOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await getAllOrdersApiCall();
      const foundOrder = response.data.find(
        (order: CheckoutResponseDto) => order.id === orderId
      );
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order data" + err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    newStatus: "OUT_FOR_DELIVERY" | "DELIVERED"
  ) => {
    if (!order?.id) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      await updateOrderStatusApiCall(order.id, newStatus);
      setSuccess(`Order status updated to ${newStatus.replace(/_/g, " ")}`);

      // Refresh order data
      await fetchOrder(order.id);
    } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PENDING":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canUpdateToOutForDelivery =
    order?.status !== "DELIVERED" && order?.shippingStatus !== "OUT_FOR_DELIVERY";
  const canUpdateToDelivered = order?.shippingStatus === "OUT_FOR_DELIVERY";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-emerald-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-emerald-600 mb-4">
          The requested order could not be found.
        </p>
        <button
          onClick={() => navigate("/checkouts")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/checkouts")}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">
              Update Order Status
            </h1>
            <p className="text-emerald-600">
              Order #{order.orderCode} - {order.customerName}
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

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4 border-b border-emerald-100 pb-2">
            Order Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-emerald-600">Order Code:</span>
              <span className="font-medium text-emerald-900">
                #{order.orderCode}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-emerald-600">Order Date:</span>
              <span className="font-medium text-emerald-900">
                {new Date(order.orderDate!).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-emerald-600">Total Amount:</span>
              <span className="font-medium text-emerald-900">
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-emerald-600">Total Items:</span>
              <span className="font-medium text-emerald-900">
                {order.totalItems} items
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-emerald-600">Current Status:</span>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                  order.status!
                )}`}
              >
                {order.status?.replace(/_/g, " ")}
              </span>
            </div>

            {order.expectedDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-emerald-600">Expected Delivery:</span>
                <span className="font-medium text-emerald-900">
                  {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4 border-b border-emerald-100 pb-2">
            Customer Information
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-emerald-600 block mb-1">
                Customer Name:
              </span>
              <span className="font-medium text-emerald-900">
                {order.customerName}
              </span>
            </div>

            <div>
              <span className="text-emerald-600 block mb-1">Email:</span>
              <span className="font-medium text-emerald-900">
                {order.customerEmail}
              </span>
            </div>

            <div>
              <span className="text-emerald-600 block mb-1">
                Shipping Address:
              </span>
              <span className="font-medium text-emerald-900">
                {order.shippingAddress}
              </span>
            </div>

            {order.customerNotes && (
              <div>
                <span className="text-emerald-600 block mb-1">
                  Customer Notes:
                </span>
                <span className="font-medium text-emerald-900">
                  {order.customerNotes}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-emerald-900 mb-4 border-b border-emerald-100 pb-2">
          Update Order Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Out for Delivery Button */}
          <button
            onClick={() => handleStatusUpdate("OUT_FOR_DELIVERY")}
            disabled={!canUpdateToOutForDelivery || updating}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
              canUpdateToOutForDelivery
                ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaTruck className="text-xl" />
            <div className="text-left">
              <div className="font-semibold">Mark as Out for Delivery</div>
              <div className="text-sm">
                {canUpdateToOutForDelivery
                  ? "Set order status to out for delivery"
                  : "Order is already delivered or out for delivery"}
              </div>
            </div>
          </button>

          {/* Delivered Button */}
          <button
            onClick={() => handleStatusUpdate("DELIVERED")}
            disabled={!canUpdateToDelivered || updating}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
              canUpdateToDelivered
                ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaCheckCircle className="text-xl" />
            <div className="text-left">
              <div className="font-semibold">Mark as Delivered</div>
              <div className="text-sm">
                {canUpdateToDelivered
                  ? "Set order status to delivered"
                  : "Order must be out for delivery first"}
              </div>
            </div>
          </button>
        </div>

        {/* Status Update Info */}
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-700">
            <strong>Note:</strong> When marking an order as "Out for Delivery",
            the expected delivery date will be automatically set to tomorrow.
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-emerald-700">Updating order status...</p>
          </div>
        </div>
      )}
    </div>
  );
}
