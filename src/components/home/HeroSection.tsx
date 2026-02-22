"use client";

import { BookingForm } from "@/components/booking/BookingForm";

export function HeroSection() {
  return (
    <section id="booking" className="relative overflow-hidden bg-black text-white">
      {/* Background with subtle parallax via transform-origin */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920)",
          opacity: 0.45,
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="relative mx-auto max-w-container px-6 py-12 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-sm lg:text-5xl">
              Rent a car in Thailand
            </h1>
            <p className="mt-4 text-lg text-white/95 drop-shadow-sm">
              Premium vehicles. Transparent pricing. Pay now or pay at counter.
            </p>
          </div>
          <div className="mt-8 animate-fade-in-delay border border-white/30 bg-black/50 p-6 backdrop-blur-sm lg:mt-0">
            <h2 className="mb-4 text-lg font-bold text-white">Search availability</h2>
            <BookingForm dark />
          </div>
        </div>
      </div>
    </section>
  );
}
