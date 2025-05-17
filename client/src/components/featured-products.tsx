import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FeaturedProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
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

  // Navigation for products on smaller screens
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-neutral-600">En popüler ürünlerimizi keşfedin</p>
            </div>
          </div>
          
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
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Öne Çıkan Ürünler</h2>
          <p className="text-red-500">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-2">Öne Çıkan Ürünler</h2>
            <p className="text-neutral-600">En popüler ürünlerimizi keşfedin</p>
          </div>
          <div className="hidden md:flex space-x-2">
            <button
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-primary-50 hover:border-primary-500 transition"
              onClick={scrollLeft}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-primary-50 hover:border-primary-500 transition"
              onClick={scrollRight}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 md:overflow-visible overflow-x-auto pb-4 snap-x"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} className="snap-start" />
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Link href="/products">
            <a className="text-primary-500 border border-primary-500 hover:bg-primary-50 font-medium px-6 py-2 rounded-full transition">
              Tüm Ürünleri Gör
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
