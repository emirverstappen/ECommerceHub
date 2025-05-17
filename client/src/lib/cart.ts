import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItemWithProduct, Product } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth";

interface CartContextType {
  cartItems: CartItemWithProduct[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
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
        title: "Hata",
        description: "Sepet bilgileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapın",
        description: "Sepete ürün eklemek için lütfen giriş yapın.",
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
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Ürün sepete eklenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      await fetchCart(); // Refresh the cart
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Sepet güncellenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      await fetchCart(); // Refresh the cart
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Ürün sepetten çıkarılamadı.",
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
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Sepet temizlenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        isLoading,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
