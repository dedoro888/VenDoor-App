import { shops, Shop } from "@/data/mockData";
import { Star, ArrowRight, Bike, MapPin, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "@/contexts/FavouritesContext";
import { Filters } from "@/components/FilterBar";
import { FoodItem } from "@/data/mockData";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

interface TopPlacesProps {
  filters?: Filters;
  onFoodTap?: (food: FoodItem) => void;
}

const TopPlaces = ({ filters }: TopPlacesProps) => {
  const navigate = useNavigate();
  const { isShopFav, toggleShopFav } = useFavourites();

  let filtered = [...shops];
  if (filters) {
    if (filters.openNow) filtered = filtered.filter((s) => s.isOpen);
    if (filters.minRating > 0) filtered = filtered.filter((s) => s.rating >= filters.minRating);
    if (filters.minDiscount > 0) filtered = filtered.filter((s) => (s.discount || 0) >= filters.minDiscount);
    if (filters.freeDelivery) filtered = filtered.filter((s) => s.deliveryFee === 0);
  }

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between px-5 mb-1">
        <div>
          <h2 className="text-xl font-bold text-foreground">Top 10 Vendors</h2>
          <p className="text-xs text-muted-foreground">Most orders this week</p>
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
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

              {/* Rank */}
              <span
                className="absolute bottom-2 left-2 text-3xl font-black text-primary-foreground drop-shadow-lg"
                style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.3)" }}
              >
                {index + 1}
              </span>

              {/* Closed overlay */}
              {!shop.isOpen && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground bg-destructive px-2 py-1 rounded-full">Closed</span>
                </div>
              )}

              {/* Discount badge */}
              {shop.discount && (
                <div className="absolute top-2 left-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  <Tag className="w-2.5 h-2.5" />
                  {shop.discount}% Off
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
            </div>

            <div className="mt-2">
              {/* Name + open/closed */}
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-foreground truncate flex-1">{shop.name}</h3>
                <span className={`text-[10px] font-bold flex-shrink-0 ${shop.isOpen ? "text-vendoor-green" : "text-destructive"}`}>
                  {shop.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {/* Delivery fee + time */}
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <Bike className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">₦{shop.deliveryFee}</span>
                <span>•</span>
                <span>{shop.deliveryTime}</span>
              </div>

              {/* Rating */}
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
