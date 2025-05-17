import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth";

const CartContext = createContext({
  cartItems: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {}
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Calculate cart totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

  // Fetch cart when user auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/cart", {
        productId,
        quantity
      });
      
      await fetchCart(); // Refresh the cart
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Couldn't add product to cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      await fetchCart(); // Refresh the cart
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Couldn't update cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      await fetchCart(); // Refresh the cart
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Couldn't remove item from cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", "/api/cart");
      setCartItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Couldn't clear cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      totalItems,
      totalPrice,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}