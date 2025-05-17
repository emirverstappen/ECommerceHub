import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginModal } from "@/components/login-modal";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"></path>
                </svg>
                <h1 className="text-2xl font-display font-bold text-neutral-800">ModaVista</h1>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="w-full relative">
                <Input 
                  type="text" 
                  className="w-full rounded-full py-2 px-4 border border-neutral-300 focus:border-primary-500"
                  placeholder="Ürün, kategori veya marka ara..."
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-500">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex items-center space-x-5">
              {/* Search Toggle - Mobile */}
              <button 
                className="md:hidden text-neutral-600 hover:text-primary-500"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>

              {/* Account */}
              <div className="relative dropdown">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-neutral-600 hover:text-primary-500 flex items-center">
                        <User size={20} />
                        <span className="hidden md:inline ml-1 text-sm">Hesabım</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem disabled className="font-medium">
                        Merhaba, {user?.firstName || user?.username}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profilim</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">Siparişlerim</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites">Favorilerim</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()}>
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button 
                    className="text-neutral-600 hover:text-primary-500 flex items-center"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    <User size={20} />
                    <span className="hidden md:inline ml-1 text-sm">Hesabım</span>
                  </button>
                )}
              </div>

              {/* Favorites */}
              <button className="text-neutral-600 hover:text-primary-500 relative">
                <Heart size={20} />
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">0</span>
              </button>

              {/* Cart */}
              <Link href="/cart">
                <button className="text-neutral-600 hover:text-primary-500 relative">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{totalItems}</span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Categories Nav */}
          <nav className="border-t border-neutral-200 py-3 overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-neutral-700 hover:text-primary-500 font-medium text-sm flex items-center px-0">
                    <Menu className="mr-2 h-4 w-4" />
                    Tüm Kategoriler
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem>
                    <Link href="/products/1">Erkek</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products/2">Kadın</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products/3">Elektronik</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products/4">Ev & Yaşam</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/products/1">
                <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Erkek</a>
              </Link>
              <Link href="/products/2">
                <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Kadın</a>
              </Link>
              <Link href="/products/3">
                <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Elektronik</a>
              </Link>
              <Link href="/products/4">
                <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Ev & Yaşam</a>
              </Link>
              <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Kozmetik</a>
              <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Spor & Outdoor</a>
              <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Kitap & Hobi</a>
              <a className="text-neutral-700 hover:text-primary-500 font-medium text-sm">Süpermarket</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Search - Hidden by default */}
      {searchOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-3">
            <div className="relative">
              <Input 
                type="text" 
                className="w-full rounded-full py-2 px-4 border border-neutral-300 focus:border-primary-500"
                placeholder="Ürün, kategori veya marka ara..."
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-500">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
