import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CartContext } from "../context/CartProvider";
import { WishlistContext } from "../context/WishlistProvider";
import { AuthContext } from "../context/AuthProvider";
import { productService, cartService, wishlistService } from "../services/api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();

        const productsData = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
          ? response.data
          : [];

        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product, e) => {
    e?.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      await cartService.addToCart(product._id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const handleAddToWishlist = async (product, e) => {
    e?.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }

    try {
      await addToWishlist(product._id);
      toast.success(`${product.name} added to wishlist`);
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
      toast.error("Failed to add product to wishlist");
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeProductDetail = () => {
    setShowDetailModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeProductDetail();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDetailModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex justify-center items-center transition-opacity duration-300 ${
        showDetailModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeProductDetail}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-transform duration-300"
        style={{
          transform: showDetailModal ? "scale(1)" : "scale(0.95)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedProduct?.name}
          </h2>
          <button
            onClick={closeProductDetail}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close dialog"
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
        {selectedProduct && (
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <div className="bg-gray-50 rounded-lg p-2 mb-4">
                <img
                  src={
                    selectedProduct?.images?.[0] || "/api/placeholder/400/400"
                  }
                  alt={selectedProduct?.name || "Product"}
                  className="w-full h-auto object-contain rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex items-center mb-6">
                <span className="text-2xl text-blue-600 font-bold">
                  ${Number(selectedProduct?.price || 0).toFixed(2)}
                </span>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedProduct?.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedProduct?.inStock
                    ? `In Stock (${selectedProduct?.quantity || 0})`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedProduct?.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Category
                </h3>
                <div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-gray-700 capitalize">
                  {selectedProduct?.category || "Uncategorized"}
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={(e) => handleAddToCart(selectedProduct, e)}
                  disabled={!selectedProduct?.inStock}
                  className={`flex-1 py-3 rounded-md font-medium transition duration-200 ${
                    selectedProduct?.inStock
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedProduct?.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={(e) => handleAddToWishlist(selectedProduct, e)}
                  className="flex-1 border border-gray-300 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200 shadow-sm hover:shadow"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-md p-4"
        >
          <div className="w-full h-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="flex justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Our Products
        </h1>
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        renderSkeletonLoader()
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                onClick={() => openProductDetail(product)}
              >
                <div className="h-48 overflow-hidden relative group cursor-pointer">
                  <img
                    src={product.images?.[0] || "/api/placeholder/300/300"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-blue-600 font-bold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex justify-between gap-2 mt-auto">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock}
                      className={`flex-1 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
                        product.inStock
                          ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button
                      onClick={(e) => handleAddToWishlist(product, e)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 hover:border-gray-400"
                      aria-label="Add to wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductDetail(product);
                      }}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 hover:border-gray-400"
                      aria-label="View product details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-gray-500 mb-2">
                No products found matching "{searchTerm}"
              </p>
              <p className="text-gray-400">
                Try adjusting your search or browse our categories
              </p>
            </div>
          )}
        </div>
      )}

      {renderDetailModal()}
    </div>
  );
};

export default HomePage;
