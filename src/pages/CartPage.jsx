import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { CartContext } from "../context/CartProvider";
import { AuthContext } from "../context/AuthProvider";
import CheckoutModal from "../components/CheckoutModal";

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, loading } =
    useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsModalOpen(true);
  };

  const handleOrderSuccess = (orderId) => {
    setIsModalOpen(false);
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">Loading your cart...</p>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <tr key={item.product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            <img
                              className="h-16 w-16 object-cover rounded"
                              src={
                                item.product.images ||
                                "/api/placeholder/100/100"
                              }
                              alt={item.product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center border border-gray-300 rounded-md w-24">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-l border-r border-gray-300 text-center w-10">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between py-4 text-lg font-semibold">
                <span>Total</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={cart}
        onSuccess={handleOrderSuccess}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CartPage;
