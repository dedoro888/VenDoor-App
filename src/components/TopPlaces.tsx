import { shops, Shop } from "@/data/mockData";
import { Star, ArrowRight, Bike, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useCart } from "@/contexts/CartContext";
import { foodItems } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { Filters } from "@/components/FilterBar";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

interface TopPlacesProps {
  filters?: Filters;
}

const TopPlaces = ({ filters }: TopPlacesProps) => {
  const navigate = useNavigate();
  const { isShopFav, toggleShopFav } = useFavourites();
  const { addToCart } = useCart();

  let filtered = [...shops];
  if (filters) {
    if (filters.openNow) filtered = filtered.filter((s) => s.isOpen);
    if (filters.minRating > 0) filtered = filtered.filter((s) => s.rating >= filters.minRating);
    if (filters.minDiscount > 0) filtered = filtered.filter((s) => (s.discount || 0) >= filters.minDiscount);
  }

  const quickAdd = (shop: Shop, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = foodItems.find((f) => f.shopId === shop.id);
    if (item) {
      addToCart(item, 1, "delivery");
      toast({ title: "Added!", description: `${item.name} from ${shop.name}` });
    }
  };

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
        {filtered.slice(0, 10).map((shop, index) => (
          <button
            key={shop.id}
            onClick={() => navigate(`/vendor/${shop.id}`)}
            className="flex-shrink-0 w-44 text-left"
          >
            <div className="relative rounded-xl overflow-hidden h-36 bg-secondary">
              <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
              <span
                className="absolute bottom-2 left-2 text-3xl font-black text-primary-foreground drop-shadow-lg"
                style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.3)" }}
              >
                {index + 1}
              </span>
              {!shop.isOpen && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground bg-destructive px-2 py-1 rounded-full">Closed</span>
                </div>
              )}
              {/* Fav button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleShopFav(shop.id); }}
                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md ${
                  isShopFav(shop.id) ? "bg-vendoor-red/20 text-vendoor-red" : "bg-card/80 text-foreground"
                }`}
              >
                <FourPointStar filled={isShopFav(shop.id)} className="w-4 h-4" />
              </button>
              {/* Quick add */}
              <button
                onClick={(e) => quickAdd(shop, e)}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-foreground truncate">{shop.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <Bike className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">₦{shop.deliveryFee}</span>
                <span>•</span>
                <span>{shop.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
                <span className="text-xs font-medium text-foreground">{shop.rating}</span>
                <span className="text-xs text-muted-foreground">({shop.reviews})</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TopPlaces;
