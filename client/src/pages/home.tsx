import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero-section";
import { FeaturesBanner } from "@/components/features-banner";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProducts } from "@/components/featured-products";
import { PromoBanner } from "@/components/promo-banner";
import { NewArrivals } from "@/components/new-arrivals";
import { Newsletter } from "@/components/newsletter";

export default function Home() {
  // Initialize scroll animations when page loads
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
  }, []);

  return (
    <>
      <Helmet>
        <title>ModaVista - Modern E-Ticaret Platformu</title>
        <meta 
          name="description" 
          content="ModaVista ile moda ve teknolojinin buluştuğu yenilikçi e-ticaret platformunda en kaliteli ürünleri keşfedin. Giyimden elektroniğe, ev yaşamdan kozmetiğe birçok kategoride ürün." 
        />
      </Helmet>
      
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
        <Newsletter />
      </main>
      
      <Footer />
    </>
  );
}
