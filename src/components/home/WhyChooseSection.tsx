"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useState } from "react";

const items = [
  {
    title: "Premium fleet",
    description: "Well-maintained vehicles from economy to luxury.",
  },
  {
    title: "Transparent pricing",
    description: "No hidden fees. Pay now or pay at counter.",
  },
  {
    title: "24/7 support",
    description: "Round-the-clock assistance for your rental.",
  },
  {
    title: "Nationwide coverage",
    description: "Airports and city locations across Thailand.",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [ref, isVisible] = useIntersectionObserver();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1500;
    const step = value / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function WhyChooseSection() {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`border-b border-hertz-border bg-white py-12 transition-all duration-500 ease-out lg:py-16 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-container px-6">
        <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
          Why choose Hertz
        </h2>
        <div className="mb-12 rounded border border-hertz-border bg-[#FAFAFA] p-8">
          <p className="text-center text-4xl font-bold text-black lg:text-5xl">
            <AnimatedCounter value={1000000} suffix="+" /> rentals in Thailand
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-bold text-black">{item.title}</h3>
              <p className="mt-2 text-sm text-hertz-black-80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
