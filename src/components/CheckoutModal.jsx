import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { orderService } from "../services/api";

const CheckoutModal = ({ isOpen, onClose, cart, onSuccess, clearCart }) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "creditCard",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: cart.totalAmount,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await orderService.createOrder(orderData);
      toast.success("Order placed successfully!");
      clearCart();
      onSuccess(response.data._id);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="creditCard"
                  name="paymentMethod"
                  type="radio"
                  value="creditCard"
                  checked={formData.paymentMethod === "creditCard"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="creditCard"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Credit Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="paypal"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  PayPal
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="cod"
                  name="paymentMethod"
                  type="radio"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="cod"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: ${cart.totalAmount.toFixed(2)}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  isProcessing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;