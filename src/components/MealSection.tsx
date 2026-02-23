import { shops } from "@/data/mockData";
import { Star, ArrowRight } from "lucide-react";

interface MealSectionProps {
  title: string;
  filterFn?: (s: typeof shops[0]) => boolean;
}

const MealSection = ({ title, filterFn }: MealSectionProps) => {
  const filtered = filterFn ? shops.filter(filterFn) : shops;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <button className="p-2 rounded-full bg-secondary">
          <ArrowRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto hide-scrollbar pb-2">
        {filtered.map((shop) => (
          <div key={shop.id} className="flex-shrink-0 w-56">
            <div className="relative rounded-xl overflow-hidden h-36 bg-secondary">
              <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
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

export default MealSection;
