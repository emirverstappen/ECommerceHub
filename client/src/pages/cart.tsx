import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, AlertTriangle } from "lucide-react";

export default function Cart() {
  const [location, setLocation] = useLocation();
  const { cartItems, isLoading, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  const handleQuantityChange = async (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      await updateQuantity(itemId, newQuantity);
    }
  };
  
  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
    toast({
      title: "Ürün Kaldırıldı",
      description: "Ürün sepetinizden kaldırıldı.",
      variant: "default",
    });
  };
  
  const handleClearCart = async () => {
    await clearCart();
    toast({
      title: "Sepet Temizlendi",
      description: "Sepetinizdeki tüm ürünler kaldırıldı.",
      variant: "default",
    });
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapın",
        description: "Siparişi tamamlamak için lütfen giriş yapın.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingCheckout(true);
    
    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Sipariş Tamamlandı",
        description: "Siparişiniz başarıyla alındı. Teşekkürler!",
        variant: "success",
      });
      clearCart();
      setProcessingCheckout(false);
      // Redirect to success page (not implemented)
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Sepetim | ModaVista</title>
          <meta 
            name="description" 
            content="ModaVista alışveriş sepetinizi görüntüleyin, ürünleri düzenleyin veya siparişinizi tamamlayın." 
          />
        </Helmet>
        
        <Header />
        
        <main className="bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-neutral-400" />
                </div>
                <h1 className="text-2xl font-bold mb-3">Sepetiniz Boş</h1>
                <p className="text-neutral-600 mb-6">Sepetinizi görüntülemek için lütfen giriş yapın.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/products")}
                  >
                    Alışverişe Devam Et
                  </Button>
                  <Button 
                    onClick={() => setLocation("/login")}
                  >
                    Giriş Yap
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        
        <main className="bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-8">Sepetim</h1>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Skeleton className="h-[400px] w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
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
        <title>Sepetim | ModaVista</title>
        <meta 
          name="description" 
          content="ModaVista alışveriş sepetinizi görüntüleyin, ürünleri düzenleyin veya siparişinizi tamamlayın." 
        />
      </Helmet>
      
      <Header />
      
      <main className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-8">Sepetim</h1>
          
          {cartItems.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Sepetiniz Boş</h2>
                <p className="text-neutral-600 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
                <Button 
                  onClick={() => setLocation("/products")}
                >
                  Alışverişe Başla
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Ürün</TableHead>
                        <TableHead>Detay</TableHead>
                        <TableHead className="text-center">Adet</TableHead>
                        <TableHead className="text-right">Fiyat</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="p-4">
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link href={`/product/${item.product.id}`}>
                              <a className="font-medium hover:text-primary-500">{item.product.name}</a>
                            </Link>
                            <p className="text-sm text-neutral-500">{item.product.description}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-neutral-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-neutral-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sepeti Temizle
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sepeti Temizle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sepetinizdeki tüm ürünleri kaldırmak istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleClearCart}
                          >
                            Sepeti Temizle
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="outline" 
                      className="text-primary-500 border-primary-500"
                      onClick={() => setLocation("/products")}
                    >
                      Alışverişe Devam Et
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Ara Toplam</span>
                      <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Kargo</span>
                      <span>Ücretsiz</span>
                    </div>
                    {totalPrice >= 1000 && (
                      <div className="flex items-start text-sm p-3 bg-green-50 text-green-700 rounded-lg">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>1000 TL ve üzeri siparişlerde ücretsiz kargo!</p>
                      </div>
                    )}
                    <div className="border-t border-neutral-200 my-2 pt-2"></div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Toplam</span>
                      <span className="font-semibold">{totalPrice.toLocaleString('tr-TR')} TL</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full py-6 text-base" 
                      onClick={handleCheckout}
                      disabled={processingCheckout}
                    >
                      {processingCheckout ? (
                        <>
                          <div className="animate-spin mr-2 h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          Siparişi Tamamla
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium mb-2">Ödeme Yöntemleri</h3>
                  <div className="flex flex-wrap gap-2">
                    <i className="fab fa-cc-visa text-2xl text-neutral-700"></i>
                    <i className="fab fa-cc-mastercard text-2xl text-neutral-700"></i>
                    <i className="fab fa-cc-paypal text-2xl text-neutral-700"></i>
                    <i className="fab fa-apple-pay text-2xl text-neutral-700"></i>
                  </div>
                </div>
                
                <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium mb-2">Güvenli Alışveriş</h3>
                  <p className="text-sm text-neutral-600">
                    256-bit SSL şifreleme ile güvenli ödeme altyapısı kullanıyoruz. Kredi kartı bilgileriniz kesinlikle saklanmaz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
