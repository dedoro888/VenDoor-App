import { FoodItem, shops } from "@/data/mockData";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useState } from "react";
import { Star, Plus, Flame } from "lucide-react";

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
  const hasDiscount = !!food.originalPrice && food.originalPrice > food.price;

  return (
    <button
      onClick={() => onTap(food)}
      className="flex-shrink-0 w-44 text-left card-lift"
    >
      <div
        className="relative rounded-3xl overflow-hidden h-36 shadow-lg"
        style={{ boxShadow: "0 4px 20px hsl(0 0% 0% / 0.35)" }}
      >
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {!food.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white bg-destructive px-2 py-0.5 rounded-full">Closed</span>
          </div>
        )}

        {/* Discount tag */}
        {hasDiscount && food.discount ? (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "hsl(var(--destructive))", color: "white" }}
          >
            -{food.discount}% OFF
          </span>
        ) : (
          <span
            className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "hsl(var(--primary))", color: "white" }}
          >
            ₦{food.price.toLocaleString()}
          </span>
        )}

        {/* Fav button */}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors"
          style={{
            background: isFav ? "hsl(var(--destructive) / 0.25)" : "hsl(0 0% 0% / 0.45)",
            color: isFav ? "hsl(var(--destructive))" : "white",
          }}
        >
          <FourPointStar
            filled={isFav}
            className={`w-3.5 h-3.5 ${starPop ? "star-pop" : ""}`}
          />
        </button>

        {/* Plus button */}
        <button
          onClick={(e) => { e.stopPropagation(); onTap(food); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg btn-press"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>{food.name}</h3>
        <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{food.shopName}</p>

        {/* Price row with discount */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {hasDiscount ? (
            <>
              <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                ₦{food.price.toLocaleString()}
              </span>
              <span
                className="text-[10px] line-through"
                style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
              >
                ₦{food.originalPrice!.toLocaleString()}
              </span>
            </>
          ) : null}
        </div>

        {/* Rating + order count */}
        <div className="flex items-center gap-2 mt-0.5">
          {shop && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3" style={{ fill: "hsl(var(--vendoor-amber))", color: "hsl(var(--vendoor-amber))" }} />
              <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{shop.rating}</span>
            </div>
          )}
          {food.orderCount && food.orderCount > 50 && (
            <div className="flex items-center gap-0.5">
              <Flame className="w-3 h-3" style={{ color: "hsl(var(--vendoor-orange))" }} />
              <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                {food.orderCount}+ orders
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default FoodCard;
