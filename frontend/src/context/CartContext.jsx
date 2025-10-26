import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);

    let newCart;
    if (existingItem) {
      newCart = cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      toast.success('Cart updated!');
    } else {
      newCart = [...cartItems, { ...product, quantity }];
      toast.success('Added to cart!');
    }

    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cartItems.filter(item => item._id !== productId);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.info('Removed from cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info('Cart cleared');
  };

  const addToWishlist = (product) => {
    const existingItem = wishlistItems.find(item => item._id === product._id);

    if (existingItem) {
      toast.info('Already in wishlist');
      return;
    }

    const newWishlist = [...wishlistItems, product];
    setWishlistItems(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlistItems.filter(item => item._id !== productId);
    setWishlistItems(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    toast.info('Removed from wishlist');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};