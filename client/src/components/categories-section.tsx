import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { CategoryCard } from "@/components/ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
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
  }, [categories]);

  if (isLoading) {
    return (
      <section className="py-10 md:py-14 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-3">Kategoriler</h2>
          <p className="text-neutral-600 mb-10">İhtiyacınıza göre kategorilere göz atın</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Skeleton className="w-full h-56" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section className="py-10 md:py-14 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-3">Kategoriler</h2>
          <p className="text-red-500">Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-3">Kategoriler</h2>
        <p className="text-neutral-600 mb-10">İhtiyacınıza göre kategorilere göz atın</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
