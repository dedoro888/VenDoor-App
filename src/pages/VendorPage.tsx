import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Bike, Clock, Share2, Minus, Plus, ChevronRight, MapPin } from "lucide-react";
import { shops, foodItems, FoodItem } from "@/data/mockData";
import { useFavourites } from "@/contexts/FavouritesContext";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import FoodItemModal from "@/components/FoodItemModal";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const VendorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isShopFav, toggleShopFav, isFoodFav, toggleFoodFav } = useFavourites();
  const [activeCategory, setActiveCategory] = useState("All");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const shop = shops.find((s) => s.id === id);
  if (!shop) return <div className="p-8 text-center text-muted-foreground">Vendor not found</div>;

  const vendorFoods = foodItems.filter((f) => f.shopId === shop.id);
  const vendorCategories = ["All", ...shop.categories];
  const filteredFoods = activeCategory === "All" ? vendorFoods : vendorFoods.filter((f) => f.category === activeCategory);

  const getQty = (foodId: string) => quantities[foodId] || 0;

  const incrementQty = (food: FoodItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantities((prev) => ({ ...prev, [food.id]: (prev[food.id] || 0) + 1 }));
  };

  const decrementQty = (foodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantities((prev) => ({ ...prev, [foodId]: Math.max(0, (prev[foodId] || 0) - 1) }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: shop.name, text: `Check out ${shop.name} on VenDoor!` });
    } else {
      toast({ title: "Link copied!", description: shop.name });
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-52">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Top controls */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="p-2 rounded-full bg-card/80 backdrop-blur-md">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => toggleShopFav(shop.id)}
            className={`p-2 rounded-full backdrop-blur-md ${
              isShopFav(shop.id) ? "bg-vendoor-red/20 text-vendoor-red" : "bg-card/80 text-foreground"
            }`}
          >
            <FourPointStar filled={isShopFav(shop.id)} className="w-5 h-5" />
          </button>
        </div>

        {/* Vendor avatar overlapping banner */}
        <div className="absolute -bottom-8 left-5">
          <div className="w-16 h-16 rounded-2xl border-2 border-background overflow-hidden shadow-lg">
            <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Vendor Info — no boxed border */}
      <div className="px-5 pt-10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{shop.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  shop.isOpen
                    ? "bg-vendoor-green/15 text-vendoor-green"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {shop.isOpen ? "Open" : "Closed"}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{shop.openTime} – {shop.closeTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-vendoor-amber text-vendoor-amber" />
            <span className="text-sm font-bold text-foreground">{shop.rating}</span>
            <span className="text-xs text-muted-foreground">({shop.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bike className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-foreground">₦{shop.deliveryFee}</span>
            <span>• {shop.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 mt-2 overflow-x-auto hide-scrollbar pb-1">
        {vendorCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-foreground text-background"
                : "bg-secondary text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items */}
      <div className="px-5 mt-3 space-y-3 pb-28">
        {filteredFoods.map((food, idx) => {
          const qty = getQty(food.id);
          return (
            <button
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="w-full text-left flex gap-3 p-3 rounded-2xl bg-card border border-border active:scale-[0.99] transition-transform"
            >
              <div className="relative flex-shrink-0">
                <img src={food.image} alt={food.name} className="w-20 h-20 rounded-xl object-cover" />
                {/* rank within category */}
                <span className="absolute bottom-1 left-1 text-lg font-black text-primary-foreground drop-shadow"
                  style={{ WebkitTextStroke: "0.5px hsl(var(--foreground)/0.3)" }}>
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-primary">₦{food.price.toLocaleString()}</span>
                    <h3 className="text-sm font-semibold text-foreground truncate mt-0.5">{food.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{food.description}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFoodFav(food.id); }}
                    className={`flex-shrink-0 p-1 ${isFoodFav(food.id) ? "text-vendoor-red" : "text-muted-foreground"}`}
                  >
                    <FourPointStar filled={isFoodFav(food.id)} className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom row: rating + delivery + qty */}
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
                      <span className="font-medium text-foreground">4.2</span>
                    </div>
                    <span>•</span>
                    <Bike className="w-3 h-3 text-primary" />
                    <span>₦{shop.deliveryFee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={(e) => decrementQty(food.id, e)}
                          className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="text-sm font-bold text-foreground w-4 text-center">{qty}</span>
                      </>
                    )}
                    <button
                      onClick={(e) => incrementQty(food, e)}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        {filteredFoods.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No items in this category</p>
        )}
      </div>

      <FoodItemModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      <BottomNav active="" />
    </div>
  );
};

export default VendorPage;
