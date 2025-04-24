import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { wishlistService } from "../services/api";
import { AuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    setLoading(true);
    try {
      const data = await wishlistService.addToWishlist(productId);
      setWishlist(data);
      toast.success("Item added to wishlist");
      return data;
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error(
        err.response?.data?.message || "Failed to add item to wishlist"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const data = await wishlistService.removeFromWishlist(productId);
      setWishlist(data);
      toast.success("Item removed from wishlist");
      return data;
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error(
        err.response?.data?.message || "Failed to remove item from wishlist"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some((product) => product._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.products.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
