import React from "react";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/products/${category.id}`}>
      <div className={cn(
        "category-card relative rounded-xl overflow-hidden shadow-sm transition hover:shadow-md scroll-trigger",
        className
      )}>
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-56 object-cover"
        />
        <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white font-semibold text-lg">{category.name}</h3>
          <p className="text-neutral-200 text-sm">{category.productCount} ürün</p>
        </div>
      </div>
    </Link>
  );
}
