import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { WishlistContext } from "../context/WishlistProvider";
import { CartContext } from "../context/CartProvider";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, fetchWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    toast.success("Item removed from wishlist");
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images || "/api/placeholder/300/300"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                </Link>
                <p className="text-gray-700 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                {product.stock <= 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">
                    Out of Stock
                  </span>
                )}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => handleMoveToCart(product)}
                    className={`px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                      product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
