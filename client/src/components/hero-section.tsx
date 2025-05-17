import React from "react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800" 
          alt="Modern fashion storefront" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-lg animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Yeni Sezon Koleksiyonu</h1>
          <p className="text-lg md:text-xl mb-8 text-neutral-100">En yeni trendleri keşfedin ve tarzınızı yansıtın.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <a className="bg-white text-neutral-900 px-6 py-3 rounded-full font-medium hover:bg-neutral-100 transition text-center">
                Şimdi Alışveriş Yap
              </a>
            </Link>
            <Link href="/products/2">
              <a className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition text-center">
                Koleksiyonu Keşfet
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
