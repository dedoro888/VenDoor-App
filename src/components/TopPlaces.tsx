import { shops } from "@/data/mockData";
import { Star, ArrowRight } from "lucide-react";

const TopPlaces = () => {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between px-5 mb-1">
        <div>
          <h2 className="text-xl font-bold text-foreground">Top 10 Places to eat</h2>
          <p className="text-xs text-muted-foreground">Most ordered this week</p>
        </div>
        <button className="p-2 rounded-full bg-secondary">
          <ArrowRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto hide-scrollbar py-3">
        {shops.slice(0, 5).map((shop, index) => (
          <div key={shop.id} className="flex-shrink-0 w-40">
            <div className="relative rounded-xl overflow-hidden h-36 bg-secondary">
              <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-3xl font-black text-primary-foreground drop-shadow-lg" style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.3)" }}>
                {index + 1}
              </span>
              {!shop.isOpen && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground bg-destructive px-2 py-1 rounded-full">Closed</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-foreground truncate">{shop.name}</h3>
              <p className="text-xs text-muted-foreground">{shop.deliveryFee} Delivery Fee • {shop.deliveryTime}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
                <span className="text-xs font-medium text-foreground">{shop.rating}</span>
                <span className="text-xs text-muted-foreground">({shop.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopPlaces;
