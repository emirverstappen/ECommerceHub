import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  cartItems, CartItem, InsertCartItem, CartItemWithProduct
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItems(userId: number): Promise<CartItemWithProduct[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private cartItemId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.cartItemId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id, productCount: 0 };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    // Get products with highest rating
    const allProducts = Array.from(this.products.values());
    const sortedProducts = [...allProducts].sort((a, b) => b.rating - a.rating);
    return sortedProducts.slice(0, limit);
  }
  
  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    // Get products marked as new
    const newProducts = Array.from(this.products.values()).filter(product => product.isNew);
    return newProducts.slice(0, limit);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { 
      ...product, 
      id, 
      rating: 0, 
      reviewCount: 0 
    };
    this.products.set(id, newProduct);
    
    // Update category product count
    const category = this.categories.get(product.categoryId);
    if (category) {
      this.categories.set(product.categoryId, {
        ...category,
        productCount: category.productCount + 1
      });
    }
    
    return newProduct;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the product exists
    const product = await this.getProduct(cartItem.productId);
    if (!product) {
      throw new Error(`Product with ID ${cartItem.productId} not found`);
    }
    
    // Check if the user already has this product in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === cartItem.userId && item.productId === cartItem.productId
    );
    
    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + cartItem.quantity 
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }
    
    // Create new cart item
    const id = this.cartItemId++;
    const newCartItem: CartItem = { ...cartItem, id };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    
    if (!cartItem) {
      return undefined;
    }
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
    
    userCartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }

  // Initialize demo data for the application
  private initializeDemoData() {
    // Create demo categories
    const categoryData: InsertCategory[] = [
      {
        name: "Erkek",
        slug: "erkek",
        description: "Erkek giyim ürünleri",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Kadın",
        slug: "kadin",
        description: "Kadın giyim ürünleri",
        imageUrl: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Elektronik",
        slug: "elektronik",
        description: "Elektronik ürünler",
        imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Ev & Yaşam",
        slug: "ev-yasam",
        description: "Ev ve yaşam ürünleri",
        imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
    ];

    categoryData.forEach(category => {
      this.createCategory(category);
    });

    // Create demo products
    const productData: InsertProduct[] = [
      {
        name: "Premium Spor Ayakkabı",
        slug: "premium-spor-ayakkabi",
        description: "Hafif ve konforlu tasarım",
        price: 899,
        oldPrice: 1299,
        imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 1,
        stock: 50,
        isNew: true,
        isOnSale: true,
        isLimited: false
      },
      {
        name: "Kablosuz Kulaklık",
        slug: "kablosuz-kulaklik",
        description: "Aktif gürültü engelleme",
        price: 1249,
        oldPrice: 1799,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 3,
        stock: 30,
        isNew: false,
        isOnSale: true,
        isLimited: false
      },
      {
        name: "Kadın Deri Kol Saati",
        slug: "kadin-deri-kol-saati",
        description: "Şık ve minimalist tasarım",
        price: 650,
        oldPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1526045431048-f857369baa09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 2,
        stock: 15,
        isNew: false,
        isOnSale: false,
        isLimited: false
      },
      {
        name: "Akıllı Tablet 10 inç",
        slug: "akilli-tablet-10-inc",
        description: "Yüksek performans, ince tasarım",
        price: 3199,
        oldPrice: 3599,
        imageUrl: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 3,
        stock: 10,
        isNew: false,
        isOnSale: true,
        isLimited: true
      },
      {
        name: "Tasarım El Çantası",
        slug: "tasarim-el-cantasi",
        description: "Gerçek deri, premium kalite",
        price: 1450,
        oldPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 2,
        stock: 20,
        isNew: true,
        isOnSale: false,
        isLimited: false
      },
      {
        name: "Ultra X Akıllı Telefon",
        slug: "ultra-x-akilli-telefon",
        description: "256GB, Gece Mavisi",
        price: 12999,
        oldPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 3,
        stock: 8,
        isNew: true,
        isOnSale: false,
        isLimited: false
      },
      {
        name: "Modern Sandalye",
        slug: "modern-sandalye",
        description: "Ergonomik tasarım, sağlam yapı",
        price: 750,
        oldPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 4,
        stock: 25,
        isNew: true,
        isOnSale: false,
        isLimited: false
      },
      {
        name: "Erkek Klasik Kol Saati",
        slug: "erkek-klasik-kol-saati",
        description: "Su geçirmez, safir cam",
        price: 1850,
        oldPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
        categoryId: 1,
        stock: 18,
        isNew: true,
        isOnSale: false,
        isLimited: false
      }
    ];

    productData.forEach(product => {
      // Set random ratings for products
      const rating = (Math.random() * 2 + 3); // Random rating between 3 and 5
      const reviewCount = Math.floor(Math.random() * 100); // Random review count up to 100
      
      const productWithRating = {
        ...product,
        rating,
        reviewCount
      };
      
      this.createProduct(productWithRating);
    });
    
    // Create a demo user
    this.createUser({
      username: "demo",
      password: "password123",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      address: "123 Main St, Istanbul",
      phone: "+90 555 123 4567",
    });
  }
}

export const storage = new MemStorage();
