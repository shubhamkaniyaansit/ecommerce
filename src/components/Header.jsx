import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import { CartContext } from "../context/CartProvider";
import { WishlistContext } from "../context/WishlistProvider";

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-black text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Ecommerce
        </Link>

        <div className="flex items-center space-x-4">
          <a href="/cart" className="relative">
            <FaShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute bg-red-500 -top-2 -right-2 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
          </a>

          {isAuthenticated && (
            <a href="/wishlist" className="relative">
              <FaHeart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {wishlistCount}
                </span>
              )}
            </a>
          )}

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <FaUserCircle size={24} />
                <span>{user.name}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
