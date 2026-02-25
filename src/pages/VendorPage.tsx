import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Bike, Clock, Share2, Minus, Plus } from "lucide-react";
import { shops, foodItems, FoodItem } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const VendorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, items } = useCart();
  const { isShopFav, toggleShopFav, isFoodFav, toggleFoodFav } = useFavourites();
  const [activeCategory, setActiveCategory] = useState("All");

  const shop = shops.find((s) => s.id === id);

  if (!shop) return <div className="p-8 text-center text-muted-foreground">Vendor not found</div>;

  const vendorFoods = foodItems.filter((f) => f.shopId === shop.id);
  const vendorCategories = ["All", ...shop.categories];
  const filteredFoods = activeCategory === "All" ? vendorFoods : vendorFoods.filter((f) => f.category === activeCategory);

  const getCartQty = (foodId: string) => items.find((i) => i.food.id === foodId)?.quantity || 0;

  const handleAdd = (food: FoodItem) => {
    addToCart(food, 1, "delivery");
    toast({ title: "Added!", description: `${food.name}` });
  };

  const handleRemove = (foodId: string) => {
    const qty = getCartQty(foodId);
    if (qty > 0) updateQuantity(foodId, qty - 1);
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
      {/* Hero */}
      <div className="relative h-48">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-md">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="p-2 rounded-full bg-card/80 backdrop-blur-md">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => toggleShopFav(shop.id)}
            className={`p-2 rounded-full backdrop-blur-md ${isShopFav(shop.id) ? "bg-vendoor-red/20 text-vendoor-red" : "bg-card/80 text-foreground"}`}
          >
            <FourPointStar filled={isShopFav(shop.id)} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-lg">
          <h1 className="text-xl font-bold text-foreground">{shop.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{shop.openTime} – {shop.closeTime}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${shop.isOpen ? "bg-vendoor-green/15 text-vendoor-green" : "bg-destructive/15 text-destructive"}`}>
              {shop.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-vendoor-amber text-vendoor-amber" />
              <span className="font-medium text-foreground">{shop.rating}</span>
              <span className="text-muted-foreground">({shop.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bike className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">₦{shop.deliveryFee}</span>
              <span>• {shop.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 mt-4 overflow-x-auto hide-scrollbar">
        {vendorCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items */}
      <div className="px-5 mt-4 space-y-3 pb-28">
        {filteredFoods.map((food) => {
          const qty = getCartQty(food.id);
          return (
            <div key={food.id} className="flex gap-3 p-3 rounded-2xl bg-card border border-border">
              <img src={food.image} alt={food.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{food.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{food.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFoodFav(food.id)}
                    className={`flex-shrink-0 ml-2 ${isFoodFav(food.id) ? "text-vendoor-red" : "text-muted-foreground"}`}
                  >
                    <FourPointStar filled={isFoodFav(food.id)} className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-primary">₦{food.price.toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => handleRemove(food.id)}
                          className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5 text-foreground" />
                        </button>
                        <span className="text-sm font-bold text-foreground w-4 text-center">{qty}</span>
                      </>
                    )}
                    <button
                      onClick={() => handleAdd(food)}
                      className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredFoods.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No items in this category</p>
        )}
      </div>

      <BottomNav active="" />
    </div>
  );
};

export default VendorPage;
