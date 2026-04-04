import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createCart,
  getCart,
  addToCart as addToCartApi,
  updateCartLine,
  removeFromCart as removeFromCartApi
} from '../lib/shopify';

const CartContext = createContext(null);

const CART_ID_KEY = 'ampume_cart_id';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem(CART_ID_KEY);
      if (storedCartId) {
        try {
          const existingCart = await getCart(storedCartId);
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Cart expired or invalid, clear it
            localStorage.removeItem(CART_ID_KEY);
          }
        } catch (err) {
          console.error('Error fetching existing cart:', err);
          localStorage.removeItem(CART_ID_KEY);
        }
      }
    };
    initCart();
  }, []);

  // Get cart items from edges
  const cartItems = cart?.lines?.edges?.map(edge => edge.node) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart?.cost?.subtotalAmount?.amount || '0';
  const checkoutUrl = cart?.checkoutUrl;

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const lines = [{ merchandiseId: variantId, quantity }];

      let updatedCart;
      if (cart?.id) {
        // Add to existing cart
        updatedCart = await addToCartApi(cart.id, lines);
      } else {
        // Create new cart
        updatedCart = await createCart(lines);
        localStorage.setItem(CART_ID_KEY, updatedCart.id);
      }

      setCart(updatedCart);
      setIsCartOpen(true); // Open cart drawer when item added
      return updatedCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const updateQuantity = useCallback(async (lineId, quantity) => {
    if (!cart?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedCart = await removeFromCartApi(cart.id, [lineId]);
        setCart(updatedCart);
        return updatedCart;
      }

      const lines = [{ id: lineId, quantity }];
      const updatedCart = await updateCartLine(cart.id, lines);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error updating cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const removeItem = useCallback(async (lineId) => {
    if (!cart?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromCartApi(cart.id, [lineId]);
      setCart(updatedCart);

      // If cart is empty, clear from localStorage
      if (updatedCart?.lines?.edges?.length === 0) {
        localStorage.removeItem(CART_ID_KEY);
      }

      return updatedCart;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem(CART_ID_KEY);
    setIsCartOpen(false);
  }, []);

  const value = {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    checkoutUrl,
    isCartOpen,
    isLoading,
    error,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
