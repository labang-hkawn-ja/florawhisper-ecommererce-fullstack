import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTruck,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  getAllOrdersApiCall,
  type CheckoutResponseDto,
} from "../service/FloraService";

export default function CheckoutTablePage() {
  const [orders, setOrders] = useState<CheckoutResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    console.log(orders.length);
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersApiCall();
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders" + err);
    } finally {
      setLoading(false);
    }
  };



  const getShippingStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PENDING":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "RETURNED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getShippingStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "OUT_FOR_DELIVERY":
        return <FaTruck className="text-blue-500" />;
      case "PENDING":
        return <FaClock className="text-gray-500" />;
      default:
        return null;
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">
            Orders Management
          </h1>
          <p className="text-emerald-600">
            Manage customer orders and delivery status
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Order Confirm Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Shipping Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-emerald-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-emerald-900">
                      #{order.orderCode}
                    </div>
                    {order.expectedDeliveryDate === null ? (
                      <div className="text-sm text-emerald-500">
                        Expected: Still Processing
                      </div>
                    ) : (
                      <div className="text-sm text-emerald-500">
                        Expected:{" "}
                        {new Date(
                          order.expectedDeliveryDate!
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-emerald-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-emerald-500">
                      {order.customerEmail}
                    </div>
                    <div className="text-xs text-emerald-400 truncate max-w-xs">
                      {order.shippingAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-900">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                    {order.totalItems} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                    {new Date(order.orderDate!).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getShippingStatusIcon(order.shippingStatus || "PENDING")}
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getShippingStatusColor(
                          order.shippingStatus || "PENDING"
                        )}`}
                      >
                        {(order.shippingStatus || "PENDING")?.replace(
                          /_/g,
                          " "
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="items-center gap-3">
                      <Link
                        to={`/checkout/update/${order.id}`}
                        className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                        title="Update Status"
                      >
                        <FaEdit className="text-sm" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-emerald-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-emerald-900 mb-2">
              No orders found
            </h3>
            <p className="text-emerald-600">
              {orders.length === 0
                ? "No orders have been placed yet."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
