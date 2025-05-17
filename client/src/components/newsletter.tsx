import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir e-posta adresi girin.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Başarılı!",
        description: "Bültenimize kaydoldunuz. Teşekkür ederiz!",
        variant: "success",
      });
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Kampanyalardan Haberdar Olun</h2>
          <p className="text-primary-100 mb-8">Özel indirimler ve yeni ürünlerden ilk siz haberdar olun.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 rounded-full px-5 py-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-white border-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              className="bg-white text-primary-600 hover:bg-neutral-100 font-medium px-6 py-3 rounded-full transition"
              disabled={loading}
            >
              {loading ? "Gönderiliyor..." : "Abone Ol"}
            </Button>
          </form>
          
          <p className="text-xs text-primary-200 mt-4">Kişisel verileriniz, KVKK kapsamında korunmaktadır. İstediğiniz zaman abonelikten çıkabilirsiniz.</p>
        </div>
      </div>
    </section>
  );
}
