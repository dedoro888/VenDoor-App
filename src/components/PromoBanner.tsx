import food1 from "@/assets/food-1.jpg";
import food3 from "@/assets/food-3.jpg";
import food6 from "@/assets/food-6.jpg";
import food2 from "@/assets/food-2.jpg";
import { useState, useEffect, useRef } from "react";
import { Tag, ArrowRight } from "lucide-react";

const promos = [
  {
    id: 1,
    headline: "50% Off",
    sub: "Your first order today",
    badge: "NEW USER",
    cta: "Order Now",
    image: food1,
    colorFrom: "hsl(var(--primary))",
    colorTo: "hsl(var(--vendoor-amber))",
  },
  {
    id: 2,
    headline: "Free Delivery",
    sub: "On all orders above ₦3,000",
    badge: "LIMITED",
    cta: "Claim Now",
    image: food3,
    colorFrom: "hsl(177 98% 19%)",
    colorTo: "hsl(177 70% 30%)",
  },
  {
    id: 3,
    headline: "₦500 Off",
    sub: "Use code VENDOOR10",
    badge: "PROMO",
    cta: "Use Code",
    image: food6,
    colorFrom: "hsl(var(--vendoor-amber))",
    colorTo: "hsl(38 95% 38%)",
  },
  {
    id: 4,
    headline: "Buy 1 Get 1",
    sub: "Every weekend, all vendors",
    badge: "WEEKEND",
    cta: "Shop Now",
    image: food2,
    colorFrom: "hsl(4 80% 50%)",
    colorTo: "hsl(24 100% 40%)",
  },
];

const AUTO_SCROLL_MS = 4000;

const PromoBanner = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % promos.length);
    }, AUTO_SCROLL_MS);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    startTimer(); // reset timer on manual tap
  };

  const p = promos[active];

  return (
    <div className="px-5 mt-4">
      <div className="relative rounded-3xl overflow-hidden h-40 shadow-lg">
        {/* Background image */}
        {promos.map((promo, i) => (
          <img
            key={promo.id}
            src={promo.image}
            alt={promo.headline}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `linear-gradient(110deg, ${p.colorFrom}ee 0%, ${p.colorFrom}99 45%, ${p.colorTo}44 75%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1">
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black w-fit"
            style={{ background: "white", color: p.colorFrom }}
          >
            <Tag className="w-2.5 h-2.5" />
            {p.badge}
          </div>
          <p className="text-3xl font-black text-white leading-tight drop-shadow">{p.headline}</p>
          <p className="text-white/85 text-xs font-medium">{p.sub}</p>
          <button
            className="mt-1 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full w-fit"
            style={{ background: "white", color: p.colorFrom }}
          >
            {p.cta} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {promos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "18px" : "5px",
                background: i === active ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
