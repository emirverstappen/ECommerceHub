import React from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-neutral-600">Yükleniyor...</p>
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
        <title>Hesabım | ModaVista</title>
        <meta 
          name="description" 
          content="ModaVista hesabınızı yönetin, siparişlerinizi takip edin ve favorilerinizi görüntüleyin."
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">Hesabım</h1>
            <p className="text-neutral-600">Hoş geldin, {user?.firstName || user?.username}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left sidebar */}
            <div className="col-span-1">
              <Card>
                <CardContent className="p-0">
                  <div className="py-6 px-4 border-b border-neutral-200 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.firstName || user?.username}</div>
                      <div className="text-sm text-neutral-500">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 p-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <div className="cursor-pointer font-medium text-primary-700">Profil Bilgileri</div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <div className="cursor-pointer">Siparişlerim</div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <div className="cursor-pointer">Favorilerim</div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <div className="cursor-pointer">Adreslerim</div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Çıkış Yap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="col-span-1 md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Ad</h3>
                        <p className="font-medium">{user?.firstName || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Soyad</h3>
                        <p className="font-medium">{user?.lastName || '-'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">E-posta</h3>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Telefon</h3>
                      <p className="font-medium">{user?.phone || '-'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Adres</h3>
                      <p className="font-medium">{user?.address || '-'}</p>
                    </div>
                    
                    <Button className="mt-4">
                      Profili Düzenle
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Son Siparişler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-neutral-500">
                      <p>Henüz bir sipariş vermediniz.</p>
                      <Button className="mt-4" asChild>
                        <a href="/products">Alışverişe Başla</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}