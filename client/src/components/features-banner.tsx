import React from "react";
import { Truck, RotateCcw, CreditCard, Headset } from "lucide-react";

export function FeaturesBanner() {
  const features = [
    {
      icon: Truck,
      title: "Hızlı Teslimat",
      description: "24 saat içinde kargoda"
    },
    {
      icon: RotateCcw,
      title: "Kolay İade",
      description: "30 gün iade garantisi"
    },
    {
      icon: CreditCard,
      title: "Güvenli Ödeme",
      description: "SSL güvenlik sertifikası"
    },
    {
      icon: Headset,
      title: "7/24 Destek",
      description: "Her zaman yanınızdayız"
    }
  ];

  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {features.map((feature, index) => (
            <div key={index} className="p-4 transition hover:transform hover:scale-105">
              <div className="text-primary-500 mb-2">
                <feature.icon className="mx-auto h-8 w-8" />
              </div>
              <h3 className="text-sm md:text-base font-medium text-neutral-800">{feature.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
