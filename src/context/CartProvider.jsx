import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/api';
import { AuthContext } from './AuthProvider';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data);
      toast.success('Item added to cart');
      return data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      setCart(data);
      toast.success('Cart updated');
      return data;
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error(err.response?.data?.message || 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const data = await cartService.removeCartItem(productId);
      setCart(data);
      toast.success('Item removed from cart');
      return data;
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;