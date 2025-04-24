import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ecommercetest-iota.vercel.app/ecommerce-api-production-f1c1.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: async (userData) => {
    const response = await api.post("/api/register", userData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (userData) => {
    const response = await api.post("/api/login", userData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getProfile: async () => {
    const response = await api.get("/api/profile");
    return response.data;
  },
};

export const productService = {
  getAllProducts: async () => {
    const response = await api.get("/api/products");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post("/api/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get("/api/cart");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/api/cart", { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/api/cart/${productId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (productId) => {
    const response = await api.delete(`/api/cart/${productId}`);
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get("/api/orders");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/api/wishlist");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post("/api/wishlist", { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/api/wishlist/${productId}`);
    return response.data;
  },
};

export default api;
