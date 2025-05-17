import React from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product.id, 1);
    
    toast({
      title: "Başarılı!",
      description: "Ürün sepete eklendi.",
      variant: "success",
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Could implement a modal for quick view
  };

  return (
    <div className={cn(
      "product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition scroll-trigger",
      className
    )}>
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2">
            <button 
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 hover:text-accent-500 flex items-center justify-center transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add favorite functionality
              }}
            >
              <i className="far fa-heart"></i>
            </button>
          </div>
          
          {product.isNew && (
            <div className="absolute top-2 left-2">
              <span className="inline-block bg-accent-500 text-white text-xs px-2 py-1 rounded">Yeni</span>
            </div>
          )}
          
          {product.isOnSale && !product.isNew && (
            <div className="absolute top-2 left-2">
              <span className="inline-block bg-secondary-500 text-white text-xs px-2 py-1 rounded">İndirim</span>
            </div>
          )}
          
          {product.isLimited && !product.isNew && !product.isOnSale && (
            <div className="absolute top-2 left-2">
              <span className="inline-block bg-neutral-800 text-white text-xs px-2 py-1 rounded">Sınırlı Stok</span>
            </div>
          )}
          
          <button 
            className="quick-view absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-neutral-800 font-medium rounded-full px-4 py-2 text-sm opacity-0 transition"
            onClick={handleQuickView}
          >
            Hızlı Bakış
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-1">
            <div className="flex text-amber-400 text-sm">
              {[...Array(5)].map((_, i) => {
                const filled = Math.floor(product.rating);
                const half = Math.round(product.rating) > filled;
                
                if (i < filled) {
                  return <i key={i} className="fas fa-star"></i>;
                } else if (i === filled && half) {
                  return <i key={i} className="fas fa-star-half-alt"></i>;
                } else {
                  return <i key={i} className="far fa-star"></i>;
                }
              })}
            </div>
            <span className="text-xs text-neutral-500 ml-1">({product.reviewCount})</span>
          </div>
          
          <h3 className="font-medium text-neutral-800 hover:text-primary-600 transition mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-neutral-500 mb-3 truncate">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-neutral-800 font-semibold">{product.price.toLocaleString('tr-TR')} TL</span>
              {product.oldPrice && (
                <span className="text-neutral-400 text-sm line-through ml-2">{product.oldPrice.toLocaleString('tr-TR')} TL</span>
              )}
            </div>
            <button 
              className="w-9 h-9 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition"
              onClick={handleAddToCart}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
