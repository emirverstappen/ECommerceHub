import React, { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, Category } from "@shared/schema";

export default function Products() {
  const [match, params] = useRoute("/products/:categoryId");
  const categoryId = params?.categoryId ? parseInt(params?.categoryId) : undefined;
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', categoryId ? `category=${categoryId}` : null],
    queryFn: async () => {
      const url = categoryId 
        ? `/api/products?categoryId=${categoryId}`
        : '/api/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });
  
  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: ['/api/categories', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      return res.json();
    },
    enabled: !!categoryId
  });
  
  // Initialize scroll animation
  useEffect(() => {
    const scrollTriggers = document.querySelectorAll('.scroll-trigger');
    
    const checkScroll = () => {
      scrollTriggers.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', checkScroll);
  }, [products]);

  const isLoading = productsLoading || (categoryId && categoryLoading);
  const pageTitle = category ? `${category.name} | ModaVista` : "Tüm Ürünler | ModaVista";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta 
          name="description" 
          content={category 
            ? `${category.name} kategorisindeki tüm ürünleri keşfedin. ModaVista'da ${category.name.toLowerCase()} ürünlerinde en kaliteli seçenekler.`
            : "ModaVista'nın geniş ürün yelpazesini keşfedin. Moda, elektronik, ev & yaşam ve daha birçok kategoride ürünler."
          } 
        />
      </Helmet>
      
      <Header />
      
      <main className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              {categoryLoading && categoryId ? "Yükleniyor..." : (category ? category.name : "Tüm Ürünler")}
            </h1>
            {category && <p className="text-neutral-600">{category.description}</p>}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Ürün Bulunamadı</h2>
              <p className="text-neutral-600">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
