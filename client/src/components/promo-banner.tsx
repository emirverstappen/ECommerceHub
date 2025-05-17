import React from "react";
import { Link } from "wouter";

export function PromoBanner() {
  return (
    <section className="py-10 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <div className="bg-primary-50 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition scroll-trigger">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 md:p-8 md:w-1/2">
                <span className="text-sm font-medium text-primary-600 mb-2 inline-block">Moda & Giyim</span>
                <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">Yaz Koleksiyonu</h3>
                <p className="text-neutral-600 mb-4">Yeni sezonda %30'a varan indirimler</p>
                <Link href="/products/2">
                  <a className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2 rounded-full transition">
                    Alışverişe Başla
                  </a>
                </Link>
              </div>
              <div className="md:w-1/2 relative h-48 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                  alt="Yaz Koleksiyonu" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
                    
          {/* Promo 2 */}
          <div className="bg-accent-50 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition scroll-trigger">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 md:p-8 md:w-1/2">
                <span className="text-sm font-medium text-accent-600 mb-2 inline-block">Teknoloji</span>
                <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">Akıllı Cihazlar</h3>
                <p className="text-neutral-600 mb-4">Yeni nesil teknolojide kampanyalar</p>
                <Link href="/products/3">
                  <a className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium px-5 py-2 rounded-full transition">
                    Fırsatları Keşfet
                  </a>
                </Link>
              </div>
              <div className="md:w-1/2 relative h-48 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1592890288564-76628a30a657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                  alt="Akıllı Cihazlar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
