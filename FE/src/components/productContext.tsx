"use client";
import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCurrency } from "./currency/currencyContext";
import { applyExchangeRate } from "./currency/exchangeRate";

export interface CartItem {
  _id: string;
  name?: string;
  type: string;
  images: string[];
  price: number; // Current display price
  discountPrice?: number | null; // Current display discount
  basePrice: number; // Original base price (e.g. in USD)
  baseDiscountPrice?: number | null; // Original base discount
  quantity: number; // Available stock quantity
  cartQuantity: number; // Selected quantity by user
  material?: string;
}

interface ProductContextType {
  cartItems: CartItem[];
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (id: string, newQuantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  mainLoading: boolean;
  setMainLoading: (loading: boolean) => void;
  shouldSearch: boolean;
  setShouldSearch: (search: boolean) => void;
  setShouldFetchCart: (fetch: boolean) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [shouldFetchCart, setShouldFetchCart] = useState(false);
  const { exchangeRate } = useCurrency();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (shouldFetchCart) {
      fetchCart().then(() => setShouldFetchCart(false));
    }
  }, [shouldFetchCart]);

  // Derived state
  const cartCount = useMemo(() => cartItems.length, [cartItems]);
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.discountPrice || item.price;
      return acc + (price * item.cartQuantity);
    }, 0);
  }, [cartItems]);

  // Re-calculate cart prices when exchange rate changes
  useEffect(() => {
    if (exchangeRate && cartItems.length > 0) {
      setCartItems(prev => {
        // Only update if the prices would actually change to avoid infinite loops
        const updated = applyExchangeRate(prev, exchangeRate);
        if (JSON.stringify(updated) === JSON.stringify(prev)) return prev;
        return updated;
      });
    }
  }, [exchangeRate]);

  // Sync with localStorage for guest state
  useEffect(() => {
    const savedCart = localStorage.getItem("localCartList");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("localCartList", JSON.stringify(cartItems));
    localStorage.setItem("total", cartTotal.toString());
  }, [cartItems, cartTotal]);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${apiUrl}/api/cart/list`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data && response.data.cartItems) {
        let serverItems = response.data.cartItems.map((item: any) => ({
          ...item,
          cartQuantity: item.newquantity || item.cartQuantity || 1,
          _id: item._id
        }));
        
        // Apply current exchange rate to server items
        if (exchangeRate) {
          serverItems = applyExchangeRate(serverItems, exchangeRate);
        }
        
        setCartItems(serverItems);
      }
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    }
  }, [apiUrl, exchangeRate]);

  // Auth initialization
  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setAuthenticated(false);
        setMainLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${apiUrl}/api/auth/customer/checkAuth`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setAuthenticated(true);
          await fetchCart();
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setMainLoading(false);
      }
    };

    checkAuth();
  }, [apiUrl, fetchCart]);

  const addToCart = async (product: any) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      toast.success("Item already in cart");
      return;
    }

    // Ensure we have base prices
    const itemWithBase = applyExchangeRate(product, exchangeRate || 1);

    const newItem: CartItem = {
      ...itemWithBase,
      cartQuantity: 1,
      _id: product._id
    };

    setCartItems(prev => [...prev, newItem]);

    if (authenticated) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(`${apiUrl}/api/cart/add`, 
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
      } catch (error) {
        console.error("Error adding to cart on server:", error);
      }
    }
    toast.success("Added to cart");
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    setCartItems(prev => prev.map(item => 
      item._id === id ? { ...item, cartQuantity: newQuantity } : item
    ));

    if (authenticated) {
      const token = localStorage.getItem("token");
      try {
        // Based on typical backend routes, quantity update might be a POST/PUT
        // Looking at server/routes/customer/cart.ts (if exists) or similar
        // For now, let's use the add endpoint if it handles updates, or a generic update
        await axios.post(`${apiUrl}/api/cart/add`, 
          { productId: id, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
      } catch (error) {
        console.error("Error updating quantity on server:", error);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    setCartItems(prev => prev.filter(item => item._id !== id));

    if (authenticated) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${apiUrl}/api/cart/delete`, {
          data: { productId: id },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      } catch (error) {
        console.error("Error removing from cart on server:", error);
      }
    }
    toast.success("Removed from cart");
  };

  return (
    <ProductContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        cartCount,
        cartTotal,
        authenticated,
        setAuthenticated,
        mainLoading,
        setMainLoading,
        shouldSearch,
        setShouldSearch,
        setShouldFetchCart,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};