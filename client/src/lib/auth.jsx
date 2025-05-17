import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/login", { username, password });
      const userData = await res.json();
      setUser(userData);
      
      toast({
        title: "Success!",
        description: "Login successful.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Login failed, try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiRequest("GET", "/api/logout");
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to log out, try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/register", userData);
      const newUser = await res.json();
      setUser(newUser);
      
      toast({
        title: "Success!",
        description: "Your account has been created and you are logged in.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to register, try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}