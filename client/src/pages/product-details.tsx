import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";
import { Link } from "wouter";
import { Home, Minus, Plus, ShoppingBag, Heart } from "lucide-react";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:productId");
  const productId = params?.productId ? parseInt(params.productId) : undefined;
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
    enabled: !!productId
  });

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product.id, quantity);
    
    toast({
      title: "Başarılı!",
      description: "Ürün sepete eklendi.",
      // Using default variant instead of success
      variant: "default",
    });
  };
  
  // Initialize scroll animations
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

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h2>
              <p className="text-neutral-600 mb-6">Bu ürün mevcut değil veya kaldırılmış olabilir.</p>
              <Link href="/products">
                <Button>Ürünlere Geri Dön</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} | ModaVista` : "Ürün Detayı | ModaVista"}</title>
        <meta 
          name="description" 
          content={product 
            ? `${product.name} - ${product.description}. ModaVista'da en uygun fiyatlar ve hızlı teslimat ile alışveriş yapın.`
            : "ModaVista'da ürün detaylarını görüntüleyin. Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat garantisiyle."
          } 
        />
      </Helmet>
      
      <Header />
      
      <main className="bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Ana Sayfa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Ürünler</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={product ? `/products/${product.categoryId}` : "#"}>
                {isLoading ? "Yükleniyor..." : (product ? "Kategori" : "")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink aria-current="page">
                {isLoading ? "Yükleniyor..." : (product ? product.name : "")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                  <Skeleton className="h-8 w-1/3" />
                </div>
                <div className="pt-4 flex space-x-4">
                  <Skeleton className="h-12 w-36" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </div>
          ) : product ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
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
                  <span className="text-sm text-neutral-500 ml-1">({product.reviewCount} değerlendirme)</span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-2xl font-semibold text-neutral-800 mr-3">{product.price.toLocaleString('tr-TR')} TL</span>
                    {product.oldPrice && (
                      <span className="text-neutral-400 text-lg line-through">{product.oldPrice.toLocaleString('tr-TR')} TL</span>
                    )}
                  </div>
                  
                  {product.oldPrice && (
                    <span className="inline-block bg-secondary-500 text-white text-sm px-2 py-1 rounded">
                      %{Math.round((1 - product.price / product.oldPrice) * 100)} İndirim
                    </span>
                  )}
                </div>
                
                <p className="text-neutral-600 mb-6">{product.description}</p>
                
                <div className="mb-8">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm font-medium">
                      {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Stokta Yok'}
                    </span>
                  </div>
                </div>
                
                {product.stock > 0 && (
                  <>
                    <div className="flex items-center mb-6">
                      <span className="text-neutral-700 mr-4">Adet:</span>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 rounded-l-md rounded-r-none"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-9 px-4 flex items-center justify-center border-y border-input">
                          {quantity}
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 rounded-r-md rounded-l-none"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        className="px-8 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full flex items-center"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Sepete Ekle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-11 w-11 rounded-full"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="mt-8 border-t border-neutral-200 pt-6 space-y-4">
                  <div className="flex">
                    <i className="fas fa-truck text-primary-500 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-neutral-800">Hızlı Teslimat</h4>
                      <p className="text-sm text-neutral-600">Siparişiniz 24 saat içinde kargoya verilir.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <i className="fas fa-undo text-primary-500 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-neutral-800">Kolay İade</h4>
                      <p className="text-sm text-neutral-600">30 gün içinde ücretsiz iade hakkı.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Product Details Tabs */}
          {product && (
            <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-neutral-200">
                <div className="flex">
                  <button className="px-6 py-4 text-primary-500 border-b-2 border-primary-500 font-medium">
                    Ürün Detayları
                  </button>
                  <button className="px-6 py-4 text-neutral-600 hover:text-neutral-800">
                    Değerlendirmeler ({product.reviewCount})
                  </button>
                  <button className="px-6 py-4 text-neutral-600 hover:text-neutral-800">
                    Teslimat Bilgileri
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Ürün Açıklaması</h3>
                <p className="text-neutral-600 mb-4">
                  {product.description}
                </p>
                <p className="text-neutral-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Praesent euismod, nisi id aliquet tincidunt, nisl nunc tincidunt nisl, eget tincidunt nisl nunc eget nisl. Nulla facilisi. Praesent euismod, nisi id aliquet tincidunt, nisl nunc tincidunt nisl, eget tincidunt nisl nunc eget nisl.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Özellikler</h3>
                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                  <li>Yüksek kaliteli malzeme</li>
                  <li>Dayanıklı ve uzun ömürlü</li>
                  <li>Modern tasarım</li>
                  <li>Kolay kullanım</li>
                  <li>Geniş renk seçeneği</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 mb-8">Benzer Ürünler</h2>
            <FeaturedProducts />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
