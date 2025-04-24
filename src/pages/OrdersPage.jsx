import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import { orderService } from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); 

  const fetchOrderDetails = async (orderId) => {
    try {
      const data = await orderService.getOrderById(orderId);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
    }
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">
            You don't have any orders yet
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedOrder && selectedOrder._id === order._id
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => fetchOrderDetails(order._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:w-1/2">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Order ID: #{selectedOrder._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(selectedOrder.createdAt)}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  <h3 className="font-semibold mb-2">Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            item.product.imageUrl || "/api/placeholder/50/50"
                          }
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>

                {selectedOrder.shippingAddress && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-700">
                      {selectedOrder.shippingAddress.street},{" "}
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode},{" "}
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Link to="/" className="text-blue-600 hover:text-blue-800">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center py-16">
                <p className="text-gray-600">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
