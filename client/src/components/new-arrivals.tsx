import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewArrivals() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/new'],
  });
  
  // Scroll animation initialization
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

  if (isLoading) {
    return (
      <section className="py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Yeni Gelenler</h2>
          <p className="text-neutral-600 mb-8">Bu haftanın en yeni ürünleri</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
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
        </div>
      </section>
    );
  }

  if (error || !products) {
    return (
      <section className="py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Yeni Gelenler</h2>
          <p className="text-red-500">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Yeni Gelenler</h2>
        <p className="text-neutral-600 mb-8">Bu haftanın en yeni ürünleri</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
