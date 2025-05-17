import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-xl font-display font-bold text-white">ModaVista</h2>
            </div>
            <p className="mb-4">ModaVista, moda ve teknolojinin buluştuğu yenilikçi e-ticaret platformu.</p>
            {/* Social media icons removed */}
          </div>
                
          <div>
            <h3 className="text-white font-semibold mb-4">Hesabım</h3>
            <ul className="space-y-3">
              <li><Link href="/profile" className="hover:text-white transition">Hesabım</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Siparişlerim</Link></li>
              <li><Link href="/favorites" className="hover:text-white transition">Favorilerim</Link></li>
              {/* Non-clickable items removed */}
            </ul>
          </div>
                
          <div>
            <h3 className="text-white font-semibold mb-4">Bilgi</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition">Teslimat Bilgileri</a></li>
              <li><a href="#" className="hover:text-white transition">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:text-white transition">İletişim</a></li>
            </ul>
          </div>
                
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>Bağdat Cad. No:123, Kadıköy, İstanbul</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i>
                <span>+90 (212) 123 45 67</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>info@modavista.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Ödeme Yöntemleri</h4>
              <div className="flex space-x-3">
                <i className="fab fa-cc-visa text-2xl"></i>
                <i className="fab fa-cc-mastercard text-2xl"></i>
                <i className="fab fa-cc-paypal text-2xl"></i>
                <i className="fab fa-apple-pay text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
            
        <div className="border-t border-neutral-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2023 ModaVista. Tüm hakları saklıdır.</p>
          <div className="mt-4 md:mt-0">
            <div className="h-8 bg-neutral-700 rounded px-3 flex items-center">
              <span className="text-xs">Güvenli Ödeme Sistemleri</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
