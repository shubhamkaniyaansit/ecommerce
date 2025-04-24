import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartProvider";
import { WishlistContext } from "../context/WishlistProvider";
import { AuthContext } from "../context/AuthProvider";
import { cartService, productService } from "../services/api";
import { toast } from "react-hot-toast";

const ProductPage = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin;
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    category: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      const productsData = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : [];

      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      images: "",
      category: "",
      quantity: "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    const imagesString = Array.isArray(product.images)
      ? product.images.join(", ")
      : typeof product.images === "string"
      ? product.images
      : "";

    setForm({
      ...product,
      images: imagesString,
    });
    setSelectedProduct(product);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.name || !form.description || !form.price) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payload = {
        ...form,
        images: form.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img),
        price: parseFloat(form.price) || 0,
        quantity: parseInt(form.quantity) || 0,
        inStock: (parseInt(form.quantity) || 0) > 0,
      };

      if (isCreating) {
        await productService.createProduct(payload);
        toast.success("Product created successfully");
      } else {
        await productService.updateProduct(selectedProduct._id, payload);
        toast.success("Product updated successfully");
      }

      fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Error saving product: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId);
        toast.success("Product deleted successfully");

        setShowModal(false);
        setShowDetailModal(false);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Error deleting product");
      }
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      await cartService.addToCart(product._id);

      const updatedCart = await cartService.getCart();

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  
  const handleAddToWishlist = async (product) => {
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
  const renderFormModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center ${
        showModal ? "visible" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">
            {isCreating ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
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
        <div className="p-6 space-y-4">
          {[
            "name",
            "description",
            "price",
            "images",
            "category",
            "quantity",
          ].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize mb-1 text-gray-700">
                {field}
                {field === "images" && " (comma separated URLs)"}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                  rows="4"
                  placeholder={`Enter product ${field}`}
                />
              ) : (
                <input
                  name={field}
                  type={
                    field === "price" || field === "quantity"
                      ? "number"
                      : "text"
                  }
                  value={form[field] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                  placeholder={`Enter product ${field}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          {!isCreating && (
            <button
              onClick={() => handleDelete(selectedProduct._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setShowModal(false)}
            className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            {isCreating ? "Create" : "Update"} Product
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetailModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center ${
        showDetailModal ? "visible" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">{selectedProduct?.name}</h2>
          <button
            onClick={() => setShowDetailModal(false)}
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
        {selectedProduct && (
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              <img
                src={selectedProduct?.images?.[0] || "/placeholder.png"}
                alt={selectedProduct?.name || "Product"}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex items-center mb-4">
                <span className="text-xl text-blue-600 font-semibold">
                  ${Number(selectedProduct?.price || 0).toFixed(2)}
                </span>
                <span
                  className={`ml-4 px-2 py-1 rounded-full text-sm font-semibold ${
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
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{selectedProduct?.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Category</h2>
                <p className="text-gray-700 capitalize">
                  {selectedProduct?.category || "Uncategorized"}
                </p>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={!selectedProduct?.inStock}
                  className={`flex-1 py-3 rounded-md font-medium transition duration-200 ${
                    selectedProduct?.inStock
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(selectedProduct)}
                  className="flex-1 border border-gray-300 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200"
                >
                  Add to Wishlist
                </button>
              </div>

              {isAdmin && (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedProduct);
                    }}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => handleDelete(selectedProduct._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Delete Product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={() => setShowDetailModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {isAdmin && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add New Product
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-48">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-2">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex gap-2 justify-between">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`flex-1 py-2 text-xs rounded-md font-medium transition duration-200 ${
                      product.inStock
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                    title="Add to Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
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
                    onClick={() => handleViewDetails(product)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                    title="View Details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
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
                  {isAdmin && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
                      title="Edit Product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No products found</p>
          {isAdmin && (
            <button
              onClick={handleAddNew}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {renderFormModal()}
      {renderDetailModal()}
    </div>
  );
};

export default ProductPage;
