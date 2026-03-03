import { FoodItem, shops } from "@/data/mockData";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useState } from "react";
import { Star, Plus } from "lucide-react";

const FourPointStar = ({ filled, className, onClick }: { filled: boolean; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    onClick={onClick}
  >
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

interface FoodCardProps {
  food: FoodItem;
  onTap: (food: FoodItem) => void;
}

const FoodCard = ({ food, onTap }: FoodCardProps) => {
  const { isFoodFav, toggleFoodFav } = useFavourites();
  const [starPop, setStarPop] = useState(false);
  const shop = shops.find((s) => s.id === food.shopId);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFoodFav(food.id);
    setStarPop(true);
    setTimeout(() => setStarPop(false), 300);
  };

  const isFav = isFoodFav(food.id);

  return (
    <button
      onClick={() => onTap(food)}
      className="flex-shrink-0 w-44 text-left card-lift"
    >
      <div className="relative rounded-3xl overflow-hidden h-36 bg-muted shadow-sm">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {!food.isOpen && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white bg-destructive px-2 py-0.5 rounded-full">Closed</span>
          </div>
        )}

        {/* Price badge */}
        <span className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-xs font-bold text-primary px-2 py-0.5 rounded-full">
          ₦{food.price.toLocaleString()}
        </span>

        {/* Fav button */}
        <button
          onClick={handleFav}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
            isFav ? "bg-destructive/20 text-destructive" : "bg-card/80 text-foreground"
          }`}
        >
          <FourPointStar
            filled={isFav}
            className={`w-3.5 h-3.5 ${starPop ? "star-pop" : ""}`}
          />
        </button>

        {/* Plus button */}
        <button
          onClick={(e) => { e.stopPropagation(); onTap(food); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md btn-press"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-semibold text-foreground truncate">{food.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{food.shopName}</p>
        {shop && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
            <span className="text-xs font-medium text-foreground">{shop.rating}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default FoodCard;
