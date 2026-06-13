import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    try {
      const { data } = await cartApi.get('/cart');
      setCart(data.cart);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      await cartApi.post('/cart/items', {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        image_url: product.image_url,
        quantity,
      });
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    await cartApi.put(`/cart/items/${productId}`, { quantity });
    await refreshCart();
  };

  const removeFromCart = async (productId) => {
    await cartApi.delete(`/cart/items/${productId}`);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartApi.delete('/cart');
    await refreshCart();
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, itemCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);